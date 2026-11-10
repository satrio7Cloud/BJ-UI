import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { generateIdempotencyKey } from "../../../../api/httpClient";
import { generateInvoiceApi, type InvoiceData } from "../../../../api/invoice";
import { createOrderApi, uploadCustomerDocument } from "../../../../api/order";
import { getShippingRates, type ShippingRate } from "../../../../api/shipping";
import { getModels, type VehicleModel } from "../../../../api/vehicle";
import { useCompanyProfile } from "../../../../shared/hooks/useCompanyProfile";
import { useDeliveryMethods } from "../../../../shared/hooks/useDeliveryMethods";
import {
  type CheckoutData,
  type CheckoutFormData,
  type CheckoutStep,
  type FormErrors,
} from "../types";
import CheckoutPaymentStep from "./CheckoutPaymentStep";
import CheckoutSuccess from "./CheckoutSuccess";
import CustomerDataCard from "./CustomerDataCard";
import DocumentUploadCard from "./DocumentUploadCard";
import OrderReviewCard from "./OrderReviewCard";
import OrderSummaryCard from "./OrderSummaryCard";
import ServiceNoticeCard from "./ServiceNoticeCard";
import ShippingLogisticsCard from "./ShippingLogisticsCard";
import VehicleDataCard from "./VehicleDataCard";

interface CheckoutFormProps {
  checkoutData: CheckoutData;
  onBack: () => void;
  step?: CheckoutStep;
  setStep?: React.Dispatch<React.SetStateAction<CheckoutStep>>;
}

export default function CheckoutForm({
  checkoutData,
  onBack,
  step: externalStep,
  setStep: externalSetStep,
}: CheckoutFormProps) {
  const { profile: officeProfile } = useCompanyProfile();
  const { deliveryMethods } = useDeliveryMethods();
  const location = useLocation();
  const prefill = (location.state as any)?.prefill;
  const estimasiPajakTotal = prefill?.estimasiPajakTotal || 0;

  // Local step fallback jika tidak disediakan dari parent
  const [internalStep, setInternalStep] = useState<CheckoutStep>(1);
  const currentStep = externalStep ?? internalStep;
  const setStep = externalSetStep ?? setInternalStep;

  // Form State
  const [formData, setFormData] = useState<CheckoutFormData>({
    fullname: "",
    email: "",
    phone_number: "",
    address: "",
    postal_code: "",
    nik: prefill?.nik || "",
    model_id: "",
    plate_number: prefill?.nopol || "",
    year: prefill?.tahun || new Date().getFullYear().toString(),
    shipping_scenario: "A",
    pickup_method: "",
    pickup_courier: "",
    pickup_address: "",
    return_method: "",
    return_address: "",
    customer_tracking_number: "",
    is_name_transfer_required: false,
    notes: prefill?.noRangkaMesin ? `Notes: ${prefill.noRangkaMesin}` : "",
    samsat_origin: "",
    samsat_destination: "",
  });

  // Set default metode pengantaran dari data backend yang aktif
  useEffect(() => {
    const active = deliveryMethods.filter((m) => m.is_active);
    if (active.length > 0 && !formData.pickup_method) {
      setFormData((prev) => ({
        ...prev,
        pickup_method: active[0].method_code,
      }));
    }
  }, [deliveryMethods, formData.pickup_method]);

  // Validation Errors State
  const [errors, setErrors] = useState<FormErrors>({});

  const clearError = (field: keyof FormErrors) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const updated = { ...prev };
      delete updated[field];
      return updated;
    });
  };

  // Shipping & Rates State
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
  const [selectedCourierCompany, setSelectedCourierCompany] =
    useState<string>("");
  const [selectedRate, setSelectedRate] = useState<ShippingRate | null>(null);
  const [isLoadingRates, setIsLoadingRates] = useState(false);
  const [ratesErrorMessage, setRatesErrorMessage] = useState<string | null>(
    null,
  );

  // Models & Documents State
  const [models, setModels] = useState<VehicleModel[]>([]);
  const [ktpFile, setKtpFile] = useState<File | null>(null);
  const [stnkFile, setStnkFile] = useState<File | null>(null);

  // Submitting, Idempotency & Success State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderIdRef, setOrderIdRef] = useState<string | null>(null);
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);

  // Idempotency Key unik per checkout session & submission guard
  const idempotencyKeyRef = useRef<string>(generateIdempotencyKey());
  const isSubmittingLockRef = useRef<boolean>(false);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await getModels();
        setModels(response.data);
      } catch (err) {
        console.error("Gagal memuat model kendaraan:", err);
      }
    };
    fetchModels();
  }, []);

  const adminFee = checkoutData.service.admin_fee || 0;
  const serviceNameLower = checkoutData.service.service_name.toLowerCase();
  const categoryLower = checkoutData.service.category.toLowerCase();

  const isServiceInherentlyNameTransfer =
    categoryLower === "mutasi kendaraan" || categoryLower === "balik nama";

  const isPhysicalCheckRequired =
    isServiceInherentlyNameTransfer ||
    serviceNameLower.includes("5 tahunan") ||
    serviceNameLower.includes("ganti plat") ||
    formData.is_name_transfer_required;

  const physicalCheckFee = isPhysicalCheckRequired
    ? checkoutData.service.physical_check_fee || 0
    : 0;

  // Perhitungan Ongkos Kirim Dinamis berdasarkan satu metode terpilih:
  const selectedDeliveryMethod = deliveryMethods.find(
    (m) =>
      m.method_code === formData.pickup_method ||
      m.method_code === formData.return_method,
  );

  const deliveryFee = selectedDeliveryMethod
    ? selectedDeliveryMethod.requires_courier
      ? selectedRate
        ? (selectedRate.final_price ?? selectedRate.price ?? 0)
        : 0
      : selectedDeliveryMethod.flat_fee || 0
    : 0;

  const totalDisplayPrice =
    checkoutData.price + adminFee + physicalCheckFee + deliveryFee;

  // Auto fetch shipping rates saat postal_code terisi 5 digit dan metode memerlukan kurir
  useEffect(() => {
    const needsCourier = selectedDeliveryMethod?.requires_courier;

    if (formData.postal_code.trim().length === 5 && needsCourier) {
      const fetchRates = async () => {
        setIsLoadingRates(true);
        setRatesErrorMessage(null);
        try {
          const res = await getShippingRates(
            formData.postal_code.trim(),
            formData.pickup_method || "DOOR_TO_DOOR",
          );

          const rawRates = res?.data?.rates || [];
          if (rawRates.length > 0) {
            const normalizedRates: ShippingRate[] = rawRates.map((r) => ({
              ...r,
              price: r.final_price,
            }));

            setShippingRates(normalizedRates);
            const initialCompany = normalizedRates[0].courier_name;
            setSelectedCourierCompany((prev) =>
              prev && normalizedRates.some((r) => r.courier_name === prev)
                ? prev
                : initialCompany,
            );

            setSelectedRate((prev) => {
              if (
                prev &&
                normalizedRates.some(
                  (r) =>
                    r.courier_name === prev.courier_name &&
                    (r.courier_service_code === prev.courier_service_code ||
                      r.courier_service_name === prev.courier_service_name),
                )
              ) {
                const existing = normalizedRates.find(
                  (r) =>
                    r.courier_name === prev.courier_name &&
                    (r.courier_service_code === prev.courier_service_code ||
                      r.courier_service_name === prev.courier_service_name),
                );
                return existing || prev;
              }
              return (
                normalizedRates.find(
                  (r) => r.courier_name === initialCompany,
                ) || normalizedRates[0]
              );
            });
            clearError("courier");
            clearError("postal_code");
            setRatesErrorMessage(null);
            toast.success("Ongkir ekspedisi berhasil diperbarui!");
          } else {
            setShippingRates([]);
            setSelectedRate(null);
            setSelectedCourierCompany("");
            const notFoundMsg =
              "Kodepos tidak ditemukan atau tidak valid. Pastikan kodepos 5 digit benar.";
            setRatesErrorMessage(notFoundMsg);
            setErrors((prev) => ({ ...prev, postal_code: notFoundMsg }));
            toast.error(notFoundMsg);
          }
        } catch (err: any) {
          console.error("Gagal memuat ongkos kirim:", err);
          setShippingRates([]);
          setSelectedRate(null);
          setSelectedCourierCompany("");
          const notFoundMsg =
            "Kodepos tidak ditemukan atau tidak valid. Pastikan kodepos 5 digit benar.";
          setRatesErrorMessage(notFoundMsg);
          setErrors((prev) => ({ ...prev, postal_code: notFoundMsg }));
          toast.error(notFoundMsg);
        } finally {
          setIsLoadingRates(false);
        }
      };
      fetchRates();
    } else if (!needsCourier) {
      setShippingRates([]);
      setSelectedRate(null);
      setSelectedCourierCompany("");
      setRatesErrorMessage(null);
      clearError("courier");
      clearError("postal_code");
    } else {
      // Kodepos belum 5 digit
      setShippingRates([]);
      setSelectedRate(null);
      setSelectedCourierCompany("");
      setRatesErrorMessage(null);
    }
  }, [
    formData.postal_code,
    formData.pickup_method,
    selectedDeliveryMethod?.requires_courier,
  ]);

  /**
   * Validasi Komprehensif Seluruh Input Customer
   */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // 1. Nama Lengkap
    if (!formData.fullname.trim()) {
      newErrors.fullname = "Nama lengkap wajib diisi sesuai KTP.";
    } else if (formData.fullname.trim().length < 3) {
      newErrors.fullname = "Nama lengkap minimal 3 karakter.";
    }

    // 2. Nomor WhatsApp
    const cleanPhone = formData.phone_number.replace(/\D/g, "");
    if (!cleanPhone) {
      newErrors.phone_number = "Nomor WhatsApp aktif wajib diisi.";
    } else if (!/^(08|628)[0-9]{8,12}$/.test(cleanPhone)) {
      newErrors.phone_number =
        "Nomor tidak valid. Gunakan awalan 08 atau 628 (10-14 digit angka).";
    }

    // 3. NIK (16 digit)
    const cleanNik = formData.nik.replace(/\D/g, "");
    if (!cleanNik) {
      newErrors.nik = "Nomor Induk Kependudukan (NIK) wajib diisi.";
    } else if (cleanNik.length !== 16) {
      newErrors.nik = `NIK harus tepat 16 digit angka (saat ini ${cleanNik.length} digit).`;
    }

    // 4. Email
    if (!formData.email.trim()) {
      newErrors.email = "Alamat email wajib diisi.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Format email tidak valid (contoh: nama@email.com).";
    }

    // 5. Alamat Lengkap Pemesan
    if (!formData.address.trim()) {
      newErrors.address = "Alamat lengkap wajib diisi.";
    } else if (formData.address.trim().length < 10) {
      newErrors.address =
        "Harap tulis alamat lebih detail (minimal 10 karakter).";
    }

    // 6. Alamat Penjemputan / Pengantaran Berkas (Wajib jika metode memerlukan alamat)
    if (selectedDeliveryMethod?.requires_address) {
      const activeAddr =
        formData.pickup_address?.trim() || formData.address?.trim();
      if (!activeAddr) {
        newErrors.pickup_address =
          "Alamat penjemputan/pengantaran berkas fisik wajib diisi.";
      }
    }

    // 7. Kode Pos & Pilihan Kurir Ekspedisi (Wajib jika metode memerlukan kurir)
    if (selectedDeliveryMethod?.requires_courier) {
      const cleanPostal = formData.postal_code.trim();
      if (!cleanPostal) {
        newErrors.postal_code =
          "Kode pos wajib 5 digit angka untuk menghitung ongkir ekspedisi.";
      } else if (cleanPostal.length !== 5) {
        newErrors.postal_code = "Kode pos harus tepat 5 digit angka.";
      } else if (ratesErrorMessage) {
        newErrors.postal_code = ratesErrorMessage;
      }

      if (!selectedRate) {
        newErrors.courier =
          "Harap pilih salah satu opsi kurir ekspedisi pengiriman berkas.";
      }
    }

    // 8. Model Kendaraan
    if (!formData.model_id) {
      newErrors.model_id =
        "Silakan pilih model kendaraan dari daftar pencarian.";
    }

    // 9. Plat Nomor
    const cleanPlate = formData.plate_number.trim().toUpperCase();
    if (!cleanPlate) {
      newErrors.plate_number = "Nomor Polisi (Plat) wajib diisi.";
    } else if (!/^[A-Z]{1,2}\s[0-9]{1,4}\s[A-Z]{1,3}$/.test(cleanPlate)) {
      newErrors.plate_number =
        "Format plat nomor tidak valid. Contoh: B 1234 ABC (gunakan spasi antar blok).";
    }

    // 10. Tahun Kendaraan
    const yearInt = parseInt(formData.year, 10);
    const maxYear = new Date().getFullYear() + 1;
    if (!formData.year || isNaN(yearInt)) {
      newErrors.year = "Tahun kendaraan wajib diisi.";
    } else if (yearInt < 1900 || yearInt > maxYear) {
      newErrors.year = `Tahun harus berada di antara 1900 dan ${maxYear}.`;
    }

    // 11. Samsat Asal & Tujuan jika mutasi / balik nama
    if (isServiceInherentlyNameTransfer || formData.is_name_transfer_required) {
      if (!formData.samsat_origin.trim()) {
        newErrors.samsat_origin = "Samsat kota asal kendaraan wajib diisi.";
      }
      if (!formData.samsat_destination.trim()) {
        newErrors.samsat_destination = "Samsat kota tujuan mutasi wajib diisi.";
      }
    }

    setErrors(newErrors);

    const errorKeys = Object.keys(newErrors) as (keyof FormErrors)[];
    if (errorKeys.length > 0) {
      const firstErrorMessage = newErrors[errorKeys[0]];
      toast.error(
        firstErrorMessage ||
          "Harap lengkapi seluruh data wajib yang ditandai merah.",
      );
      return false;
    }

    return true;
  };

  /**
   * Langkah 1 -> Langkah 2: Lanjut ke Tinjau Pesanan
   */
  const handleProceedToReview = () => {
    if (validateForm()) {
      // Pastikan Idempotency Key baru dibuat untuk sesi checkout ini
      if (!idempotencyKeyRef.current) {
        idempotencyKeyRef.current = generateIdempotencyKey();
      }
      setStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  /**
   * Langkah 2: Konfirmasi Final & Buat Pesanan dengan Proteksi Idempotency Ganda
   */
  const handleConfirmOrder = async () => {
    // 1. Double Submit Lock Guard (mencegah klik ganda beruntun)
    if (isSubmitting || isSubmittingLockRef.current) {
      return;
    }

    isSubmittingLockRef.current = true;
    setIsSubmitting(true);

    try {
      const isWalkIn =
        selectedDeliveryMethod?.method_code === "WALK_IN" ||
        (!selectedDeliveryMethod?.requires_courier &&
          !selectedDeliveryMethod?.requires_address);

      const effectiveReturnAddress = isWalkIn
        ? "AMBIL_LANGSUNG_DI_KANTOR"
        : formData.return_address?.trim() ||
          formData.pickup_address?.trim() ||
          formData.address;

      const effectivePickupAddress = isWalkIn
        ? "DATANG_LANGSUNG_KE_KANTOR"
        : formData.pickup_address?.trim() || formData.address;

      // Ringkasan checkout pengiriman sesuai spesifikasi
      const checkoutShippingSummary = {
        delivery_method_code:
          selectedDeliveryMethod?.method_code || formData.pickup_method,
        selected_courier_code: selectedDeliveryMethod?.requires_courier
          ? selectedRate?.courier_code || ""
          : null,
        selected_courier_service: selectedDeliveryMethod?.requires_courier
          ? selectedRate?.courier_service_code || ""
          : null,
        courier_display_name:
          selectedDeliveryMethod?.requires_courier && selectedRate
            ? `${selectedRate.courier_name} - ${selectedRate.courier_service_name}`
            : selectedDeliveryMethod?.method_name || "Tanpa Kurir Ekspedisi",
        shipping_fee: deliveryFee,
        destination_postal_code: selectedDeliveryMethod?.requires_courier
          ? formData.postal_code
          : "",
        destination_address: effectivePickupAddress,
      };

      try {
        sessionStorage.setItem(
          "bj_checkout_shipping_summary",
          JSON.stringify(checkoutShippingSummary),
        );
      } catch (e) {
        // Abaikan jika quota storage penuh / SSR
      }

      // Panggil createOrderApi dengan menyertakan Idempotency Key unik
      const orderRes = await createOrderApi({
        fullname: formData.fullname.trim(),
        email: formData.email.trim(),
        phone_number: formData.phone_number.trim(),
        address: formData.address.trim(),
        nik: formData.nik.trim(),

        model_id: formData.model_id,
        plate_number: formData.plate_number.trim().toUpperCase(),
        year: parseInt(formData.year, 10),

        service_id: checkoutData.service.id,
        pickup_method:
          selectedDeliveryMethod?.method_code ||
          formData.pickup_method ||
          "WALK_IN",
        pickup_address: effectivePickupAddress,
        return_address: effectiveReturnAddress,
        return_method:
          formData.return_method &&
          formData.return_method !== "RETURN_SAME_METHOD"
            ? formData.return_method
            : selectedDeliveryMethod?.method_code || "WALK_IN",
        customer_tracking_number: formData.customer_tracking_number,
        tax_amount: estimasiPajakTotal,
        service_fee: checkoutData.service.service_fee,
        admin_fee: adminFee,
        physical_check_fee: physicalCheckFee,
        delivery_fee: deliveryFee,
        express_fee:
          checkoutData.pkg === "express" ? checkoutData.service.express_fee : 0,
        courier_name: selectedDeliveryMethod?.requires_courier
          ? (
              selectedRate?.courier_code || selectedRate?.courier_name
            )?.toLowerCase()
          : undefined,
        courier_service: selectedDeliveryMethod?.requires_courier
          ? (
              selectedRate?.courier_service_code ||
              selectedRate?.courier_service_name
            )?.toLowerCase()
          : undefined,
        postal_code: formData.postal_code?.trim() || undefined,
        destination_postal_code: formData.postal_code?.trim() || undefined,
        service_level: checkoutData.pkg.toUpperCase(),
        is_name_transfer_required:
          formData.is_name_transfer_required || isServiceInherentlyNameTransfer,
        samsat_origin:
          isServiceInherentlyNameTransfer || formData.is_name_transfer_required
            ? formData.samsat_origin
            : undefined,
        samsat_destination:
          isServiceInherentlyNameTransfer || formData.is_name_transfer_required
            ? formData.samsat_destination
            : undefined,
        notes:
          formData.notes?.trim() ||
          (isWalkIn
            ? "[Metode: Datang Langsung ke Kantor]"
            : `[Metode: ${selectedDeliveryMethod?.method_name || formData.pickup_method}]`),
      });

      const orderId = orderRes.data?.id;
      if (!orderId) throw new Error("Gagal membuat pesanan.");

      // Upload berkas KTP & STNK jika dilampirkan
      if (ktpFile) {
        await uploadCustomerDocument(orderId, "KTP", ktpFile);
      }
      if (stnkFile) {
        await uploadCustomerDocument(orderId, "STNK", stnkFile);
      }

      // Generate Tagihan & Token Pembayaran Midtrans Snap
      let createdInvoice: InvoiceData | null = null;
      try {
        const invRes = await generateInvoiceApi(orderId);
        if (invRes?.data) {
          createdInvoice = invRes.data;
        }
      } catch (invErr: any) {
        console.warn("Gagal auto-generate invoice saat checkout:", invErr);
      }

      // Pindahkan ke Langkah 3: Pembayaran Online Midtrans
      setOrderIdRef(orderId);
      setInvoiceData(createdInvoice);
      setStep(3);
      window.scrollTo({ top: 0, behavior: "smooth" });
      toast.success("Pesanan berhasil dibuat! Mengalihkan ke pembayaran...");
    } catch (error: any) {
      console.error("Kesalahan saat checkout:", error);
      toast.error(error.message || "Terjadi kesalahan saat memproses pesanan.");
    } finally {
      setIsSubmitting(false);
      isSubmittingLockRef.current = false;
    }
  };

  // 1. Tampilan Langkah 3: Pembayaran Online Midtrans Snap
  if (currentStep === 3 && orderIdRef) {
    return (
      <CheckoutPaymentStep
        orderId={orderIdRef}
        initialInvoice={invoiceData}
        checkoutData={checkoutData}
        formData={formData}
        deliveryFee={deliveryFee}
        totalDisplayPrice={totalDisplayPrice}
        officeProfile={officeProfile}
        onFinish={() => {
          setIsSuccess(true);
        }}
      />
    );
  }

  // 2. Tampilan Sukses (Opsional / Setelah Selesai)
  if (isSuccess) {
    return (
      <CheckoutSuccess
        orderIdRef={orderIdRef}
        shippingScenario={formData.shipping_scenario}
        onBack={onBack}
        onResetSuccess={() => {
          setIsSuccess(false);
          setStep(1);
        }}
        officeProfile={officeProfile}
      />
    );
  }

  // 3. Tampilan Langkah 2: Review & Ringkasan Pesanan (E-Commerce Review Step)
  if (currentStep === 2) {
    return (
      <OrderReviewCard
        checkoutData={checkoutData}
        formData={formData}
        selectedRate={selectedRate}
        models={models}
        ktpFile={ktpFile}
        stnkFile={stnkFile}
        estimasiPajakTotal={estimasiPajakTotal}
        adminFee={adminFee}
        physicalCheckFee={physicalCheckFee}
        deliveryFee={deliveryFee}
        totalDisplayPrice={totalDisplayPrice}
        isSubmitting={isSubmitting}
        officeProfile={officeProfile}
        onBackToEdit={() => {
          setStep(1);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onConfirmOrder={handleConfirmOrder}
      />
    );
  }

  // 3. Tampilan Langkah 1: Input Data & Pengiriman
  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Left Column - Form Inputs with Inline Errors */}
      <div className="lg:col-span-2 space-y-6">
        <ServiceNoticeCard
          serviceName={checkoutData.service.service_name}
          category={checkoutData.service.category}
          isNameTransferRequired={formData.is_name_transfer_required}
        />

        <CustomerDataCard
          formData={formData}
          setFormData={setFormData}
          prefillNik={prefill?.nik}
          errors={errors}
          onClearError={clearError}
        />

        <VehicleDataCard
          formData={formData}
          setFormData={setFormData}
          models={models}
          prefill={{
            jenisKendaraan: prefill?.jenisKendaraan,
            nopol: prefill?.nopol,
            tahun: prefill?.tahun,
          }}
          errors={errors}
          onClearError={clearError}
        />

        <ShippingLogisticsCard
          formData={formData}
          setFormData={setFormData}
          shippingRates={shippingRates}
          selectedCourierCompany={selectedCourierCompany}
          setSelectedCourierCompany={setSelectedCourierCompany}
          selectedRate={selectedRate}
          setSelectedRate={setSelectedRate}
          isLoadingRates={isLoadingRates}
          ratesErrorMessage={ratesErrorMessage}
          isServiceInherentlyNameTransfer={isServiceInherentlyNameTransfer}
          officeProfile={officeProfile}
          errors={errors}
          onClearError={clearError}
        />

        <DocumentUploadCard
          ktpFile={ktpFile}
          setKtpFile={setKtpFile}
          stnkFile={stnkFile}
          setStnkFile={setStnkFile}
        />
      </div>

      {/* Right Column - Order Summary & Proceed Button */}
      <div className="lg:col-span-1">
        <OrderSummaryCard
          checkoutData={checkoutData}
          estimasiPajakTotal={estimasiPajakTotal}
          adminFee={adminFee}
          physicalCheckFee={physicalCheckFee}
          deliveryFee={deliveryFee}
          selectedRate={selectedRate}
          selectedDeliveryMethod={selectedDeliveryMethod}
          shippingScenario={formData.shipping_scenario}
          isExpedisi={Boolean(selectedDeliveryMethod?.requires_courier)}
          totalDisplayPrice={totalDisplayPrice}
          isSubmitting={isSubmitting}
          onSubmit={handleProceedToReview}
        />
      </div>
    </div>
  );
}
