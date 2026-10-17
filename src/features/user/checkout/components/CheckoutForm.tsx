import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { createOrderApi, uploadCustomerDocument } from "../../../../api/order";
import { getShippingRates, type ShippingRate } from "../../../../api/shipping";
import { getModels, type VehicleModel } from "../../../../api/vehicle";
import { type CheckoutData, type CheckoutFormData } from "../types";
import CheckoutSuccess from "./CheckoutSuccess";
import CustomerDataCard from "./CustomerDataCard";
import DocumentUploadCard from "./DocumentUploadCard";
import OrderSummaryCard from "./OrderSummaryCard";
import ShippingLogisticsCard from "./ShippingLogisticsCard";
import TransferNoticeCard from "./TransferNoticeCard";
import VehicleDataCard from "./VehicleDataCard";

interface CheckoutFormProps {
  checkoutData: CheckoutData;
  onBack: () => void;
}

export default function CheckoutForm({
  checkoutData,
  onBack,
}: CheckoutFormProps) {
  const location = useLocation();
  const prefill = (location.state as any)?.prefill;
  const estimasiPajakTotal = prefill?.estimasiPajakTotal || 0;

  const [formData, setFormData] = useState<CheckoutFormData>({
    // Customer Data
    fullname: "",
    email: "",
    phone_number: "",
    address: "",
    postal_code: "",
    nik: prefill?.nik || "",
    // Vehicle Data
    model_id: "",
    plate_number: prefill?.nopol || "",
    year: prefill?.tahun || new Date().getFullYear().toString(),
    // Order Logistics Data
    pickup_method: "OJOL",
    pickup_courier: "",
    pickup_address: "",
    return_method: "EKSPEDISI",
    is_name_transfer_required: false,
    notes: prefill?.noRangkaMesin
      ? `No. Rangka/Mesin: ${prefill.noRangkaMesin}`
      : "",
    samsat_origin: "",
    samsat_destination: "",
  });

  // Shipping state
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
  const [selectedCourierCompany, setSelectedCourierCompany] =
    useState<string>("");
  const [selectedRate, setSelectedRate] = useState<ShippingRate | null>(null);
  const [isLoadingRates, setIsLoadingRates] = useState(false);

  const [models, setModels] = useState<VehicleModel[]>([]);
  const [ktpFile, setKtpFile] = useState<File | null>(null);
  const [stnkFile, setStnkFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderIdRef, setOrderIdRef] = useState<string | null>(null);

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

  // Skenario A: Full Kurir (Antar-Jemput 2 Arah = 2x tarif kurir)
  const deliveryFee = selectedRate ? selectedRate.price * 2 : 0;
  const totalDisplayPrice =
    checkoutData.price + adminFee + physicalCheckFee + deliveryFee;

  // Auto fetch shipping rates saat postal_code terisi 5 digit
  useEffect(() => {
    if (
      formData.postal_code.trim().length === 5 &&
      formData.return_method === "EKSPEDISI"
    ) {
      const fetchRates = async () => {
        setIsLoadingRates(true);
        try {
          const res = await getShippingRates(formData.postal_code.trim());
          if (res.data && res.data.length > 0) {
            setShippingRates(res.data);
            const initialCompany = res.data[0].courier_name;
            setSelectedCourierCompany((prev) =>
              prev && res.data.some((r) => r.courier_name === prev)
                ? prev
                : initialCompany,
            );

            setSelectedRate((prev) => {
              if (
                prev &&
                res.data.some(
                  (r) =>
                    r.courier_name === prev.courier_name &&
                    r.courier_service_name === prev.courier_service_name,
                )
              ) {
                return prev;
              }
              return (
                res.data.find((r) => r.courier_name === initialCompany) ||
                res.data[0]
              );
            });
            toast.success("Ongkir ekspedisi berhasil diperbarui!");
          } else {
            setShippingRates([]);
            setSelectedRate(null);
            setSelectedCourierCompany("");
            toast.error("Tidak ada kurir yang menjangkau kode pos ini");
          }
        } catch (err: any) {
          console.error("Gagal memuat ongkos kirim:", err);
          setShippingRates([]);
          setSelectedRate(null);
          setSelectedCourierCompany("");
          toast.error(err.message || "Gagal memuat tarif ongkir");
        } finally {
          setIsLoadingRates(false);
        }
      };
      fetchRates();
    } else if (formData.return_method !== "EKSPEDISI") {
      setSelectedRate(null);
      setSelectedCourierCompany("");
    }
  }, [formData.postal_code, formData.return_method]);

  const handleSubmit = async () => {
    // Validasi Form Keseluruhan
    if (!formData.fullname.trim()) {
      toast.error("Nama lengkap tidak boleh kosong.");
      return;
    }
    if (!/^[0-9]{10,14}$/.test(formData.phone_number)) {
      toast.error(
        "Nomor WhatsApp tidak valid. Harus berupa 10-14 digit angka.",
      );
      return;
    }
    if (!/^\d{16}$/.test(formData.nik)) {
      toast.error("NIK harus terdiri dari 16 digit angka.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Format email tidak valid.");
      return;
    }
    if (!formData.address.trim()) {
      toast.error("Alamat lengkap tidak boleh kosong.");
      return;
    }
    if (!formData.model_id) {
      toast.error("Silakan pilih model kendaraan terlebih dahulu.");
      return;
    }
    if (
      !/^[A-Z]{1,2}\s[0-9]{1,4}\s[A-Z]{1,3}$/.test(formData.plate_number.trim())
    ) {
      toast.error(
        "Format Plat Nomor (Nopol) tidak valid. Harap gunakan format yang benar beserta spasi, contoh: B 1234 ABC",
      );
      return;
    }
    const yearInt = parseInt(formData.year, 10);
    if (
      isNaN(yearInt) ||
      yearInt < 1900 ||
      yearInt > new Date().getFullYear()
    ) {
      toast.error(
        `Tahun pembuatan tidak valid. Harap masukkan tahun antara 1900 dan ${new Date().getFullYear()}.`,
      );
      return;
    }
    if (
      formData.pickup_method !== "SENDIRI" ||
      formData.return_method !== "AMBIL_SENDIRI"
    ) {
      if (!formData.pickup_address.trim()) {
        toast.error(
          "Alamat penjemputan/pengembalian tidak boleh kosong karena Anda memilih kurir/ojol.",
        );
        return;
      }
    }

    if (formData.return_method === "EKSPEDISI") {
      if (!formData.postal_code || formData.postal_code.trim().length !== 5) {
        toast.error(
          "Harap masukkan 5 digit Kode Pos Tujuan untuk pengiriman ekspedisi.",
        );
        return;
      }
      if (!selectedRate) {
        toast.error("Harap pilih salah satu kurir ekspedisi yang tersedia.");
        return;
      }
    }

    try {
      setIsSubmitting(true);

      // 1. Create Order All-in-One (Customer & Vehicle otomatis di-resolve / dibuat di Backend)
      const orderRes = await createOrderApi({
        fullname: formData.fullname,
        email: formData.email,
        phone_number: formData.phone_number,
        address: formData.address,
        nik: formData.nik,

        model_id: formData.model_id,
        plate_number: formData.plate_number,
        year: parseInt(formData.year, 10),

        service_id: checkoutData.service.id,
        pickup_method: "KURIR_JEMPUT",
        pickup_address: formData.pickup_address || formData.address,
        return_method: selectedRate
          ? `${selectedRate.courier_name} - ${selectedRate.courier_service_name}`
          : "KURIR_KIRIM",
        tax_amount: estimasiPajakTotal,
        service_fee: checkoutData.service.service_fee,
        admin_fee: adminFee,
        physical_check_fee: physicalCheckFee,
        delivery_fee: deliveryFee,
        express_fee:
          checkoutData.pkg === "express" ? checkoutData.service.express_fee : 0,
        courier_name: selectedRate?.courier_name,
        courier_service: selectedRate?.courier_service_name,
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
        notes: formData.notes,
      });

      const orderId = orderRes.data?.id;
      if (!orderId) throw new Error("Gagal membuat pesanan");

      // Upload Documents
      if (ktpFile) {
        await uploadCustomerDocument(orderId, "KTP", ktpFile);
      }
      if (stnkFile) {
        await uploadCustomerDocument(orderId, "STNK", stnkFile);
      }

      // Show Success Screen
      setOrderIdRef(orderId);
      setIsSuccess(true);
      window.scrollTo(0, 0);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Terjadi kesalahan saat memproses pesanan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <CheckoutSuccess
        orderIdRef={orderIdRef}
        pickupMethod={formData.pickup_method}
        onBack={onBack}
        onResetSuccess={() => setIsSuccess(false)}
      />
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Left Column - Form */}
      <div className="lg:col-span-2 space-y-6">
        {isServiceInherentlyNameTransfer && (
          <TransferNoticeCard
            serviceName={checkoutData.service.service_name}
          />
        )}

        <CustomerDataCard
          formData={formData}
          setFormData={setFormData}
          prefillNik={prefill?.nik}
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
          isServiceInherentlyNameTransfer={isServiceInherentlyNameTransfer}
        />

        <DocumentUploadCard
          ktpFile={ktpFile}
          setKtpFile={setKtpFile}
          stnkFile={stnkFile}
          setStnkFile={setStnkFile}
        />
      </div>

      {/* Right Column - Order Summary */}
      <div className="lg:col-span-1">
        <OrderSummaryCard
          checkoutData={checkoutData}
          estimasiPajakTotal={estimasiPajakTotal}
          adminFee={adminFee}
          physicalCheckFee={physicalCheckFee}
          deliveryFee={deliveryFee}
          selectedRate={selectedRate}
          isExpedisi={formData.return_method === "EKSPEDISI"}
          totalDisplayPrice={totalDisplayPrice}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
