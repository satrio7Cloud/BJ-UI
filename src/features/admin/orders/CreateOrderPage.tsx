import {
  AlertCircle,
  Car,
  Check,
  Clock,
  DollarSign,
  FilePlus,
  Loader2,
  Package,
  Search,
  Truck,
  User,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  createCustomer,
  getCustomers,
  type Customer,
} from "../../../api/customer";
import {
  createCustomerVehicle,
  getCustomerVehicles,
  type CustomerVehicle,
} from "../../../api/customerVehicle";
import { generateInvoiceApi } from "../../../api/invoice";
import { createOrderAdminApi } from "../../../api/order";
import { getServices, type ApiService } from "../../../api/services";
import { getShippingRates, type ShippingRate } from "../../../api/shipping";
import { getModels, type VehicleModel } from "../../../api/vehicle";
import Button from "../../../shared/components/Button";
import { useDeliveryMethods } from "../../../shared/hooks/useDeliveryMethods";

export default function CreateOrderPage() {
  const navigate = useNavigate();

  // State Master Data
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vehicles, setVehicles] = useState<CustomerVehicle[]>([]);
  const [services, setServices] = useState<ApiService[]>([]);
  const [models, setModels] = useState<VehicleModel[]>([]);
  const { deliveryMethods } = useDeliveryMethods();

  // Loading States
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mode Customer & Vehicle (Existing vs New)
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [isNewVehicle, setIsNewVehicle] = useState(false);

  // Customer Form State
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [customerSearchQuery, setCustomerSearchQuery] = useState("");
  const [newCustomerData, setNewCustomerData] = useState({
    fullname: "",
    phone_number: "",
    nik: "",
    email: "",
    address: "",
  });

  // Vehicle Form State
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [newVehicleData, setNewVehicleData] = useState({
    plate_number: "",
    model_id: "",
    year: new Date().getFullYear().toString(),
  });

  // Bagian Plat Nomor Terpisah (seperti di form kalkulator customer)
  const [plateParts, setPlateParts] = useState({
    p1: "", // 1-2 Huruf Wilayah (contoh: B, D, AB)
    p2: "", // 1-4 Digit Nomor (contoh: 1234)
    p3: "", // 1-3 Huruf Seri Belakang (contoh: ABC)
  });

  // Ref untuk auto-focus antar kotak plat nomor
  const plateP1Ref = useRef<HTMLInputElement>(null);
  const plateP2Ref = useRef<HTMLInputElement>(null);
  const plateP3Ref = useRef<HTMLInputElement>(null);

  const currentYear = new Date().getFullYear();
  const availableYears = useMemo(() => {
    const years: number[] = [];
    for (let y = currentYear + 1; y >= 1970; y--) {
      years.push(y);
    }
    return years;
  }, [currentYear]);

  // Validasi real-time kelengkapan plat nomor
  const isPlateComplete = useMemo(() => {
    if (!plateParts.p1 && !plateParts.p2 && !plateParts.p3) return null;
    return (
      plateParts.p1.trim().length >= 1 &&
      plateParts.p2.trim().length >= 1 &&
      plateParts.p3.trim().length >= 1
    );
  }, [plateParts]);

  // Handler update bagian plat nomor satu per satu dengan auto-focus
  const handlePlatePartChange = (part: "p1" | "p2" | "p3", value: string) => {
    let cleanVal = "";
    if (part === "p1") {
      cleanVal = value
        .replace(/[^A-Za-z]/g, "")
        .toUpperCase()
        .slice(0, 2);
    } else if (part === "p2") {
      cleanVal = value.replace(/[^0-9]/g, "").slice(0, 4);
    } else {
      cleanVal = value
        .replace(/[^A-Za-z]/g, "")
        .toUpperCase()
        .slice(0, 3);
    }

    const newParts = { ...plateParts, [part]: cleanVal };
    setPlateParts(newParts);

    // Gabungkan menjadi format standar "B 1234 ABC"
    const combined = [newParts.p1, newParts.p2, newParts.p3]
      .filter(Boolean)
      .join(" ");

    setNewVehicleData((prev) => ({
      ...prev,
      plate_number: combined,
    }));

    // Auto-focus ke kotak berikutnya jika karakter maksimal tercapai
    if (part === "p1" && cleanVal.length === 2) {
      plateP2Ref.current?.focus();
    } else if (part === "p2" && cleanVal.length === 4) {
      plateP3Ref.current?.focus();
    }
  };

  // Navigasi keyboard pada kotak plat nomor (Backspace & Space)
  const handlePlateKeyDown = (
    part: "p1" | "p2" | "p3",
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace") {
      if (part === "p3" && !plateParts.p3) {
        plateP2Ref.current?.focus();
      } else if (part === "p2" && !plateParts.p2) {
        plateP1Ref.current?.focus();
      }
    } else if (e.key === " ") {
      // Tekan spasi untuk langsung pindah ke kotak berikutnya
      e.preventDefault();
      if (part === "p1" && plateParts.p1) {
        plateP2Ref.current?.focus();
      } else if (part === "p2" && plateParts.p2) {
        plateP3Ref.current?.focus();
      }
    }
  };

  // Service & Order Parameters State
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [serviceLevel, setServiceLevel] = useState<"REGULER" | "EXPRESS">(
    "REGULER",
  );
  const [pickupMethod, setPickupMethod] = useState("WALK_IN");
  const [returnMethod, setReturnMethod] = useState("WALK_IN");
  const [pickupAddress, setPickupAddress] = useState("");
  const [notes, setNotes] = useState("");

  // Shipping & Rates State (Biteship Integration)
  const [postalCode, setPostalCode] = useState("");
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
  const [selectedRate, setSelectedRate] = useState<ShippingRate | null>(null);
  const [isLoadingRates, setIsLoadingRates] = useState(false);
  const [ratesErrorMessage, setRatesErrorMessage] = useState<string | null>(
    null,
  );

  // Balik Nama & Samsat
  const [isNameTransferRequired, setIsNameTransferRequired] = useState(false);
  const [samsatOrigin, setSamsatOrigin] = useState("");
  const [samsatDestination, setSamsatDestination] = useState("");

  // Fees State (Editable by Admin)
  const [taxAmount, setTaxAmount] = useState<number>(0);
  const [serviceFee, setServiceFee] = useState<number>(0);
  const [adminFee, setAdminFee] = useState<number>(0);
  const [physicalCheckFee, setPhysicalCheckFee] = useState<number>(0);
  const [deliveryFee, setDeliveryFee] = useState<number>(0);
  const [expressFee, setExpressFee] = useState<number>(0);

  // Muat Data Master saat halaman dibuka
  useEffect(() => {
    const loadData = async () => {
      setIsLoadingInitial(true);
      try {
        const [custRes, srvRes, mdlRes] = await Promise.all([
          getCustomers().catch(() => ({ data: [] })),
          getServices().catch(() => ({ data: [] })),
          getModels().catch(() => ({ data: [] })),
        ]);

        if (custRes?.data) setCustomers(custRes.data);
        if (srvRes?.data) setServices(srvRes.data);
        if (mdlRes?.data) setModels(mdlRes.data);
      } catch (err) {
        console.error("Gagal memuat master data admin order:", err);
      } finally {
        setIsLoadingInitial(false);
      }
    };

    loadData();
  }, []);

  // Muat Kendaraan & Autofill Alamat saat Customer Terpilih Berubah
  useEffect(() => {
    if (!selectedCustomerId || isNewCustomer) {
      setVehicles([]);
      setSelectedVehicleId("");
      return;
    }

    const chosenCust = customers.find((c) => c.id === selectedCustomerId);
    if (chosenCust?.address) {
      setPickupAddress((prev) => prev || chosenCust.address || "");
      const matchedPostal = chosenCust.address.match(/\b\d{5}\b/);
      if (matchedPostal) {
        setPostalCode((prev) => prev || matchedPostal[0]);
      }
    }

    const loadVehicles = async () => {
      setIsLoadingVehicles(true);
      try {
        const res = await getCustomerVehicles(selectedCustomerId);
        const list = res?.data || [];
        setVehicles(list);
        if (list.length > 0) {
          setSelectedVehicleId(list[0].id);
          setIsNewVehicle(false);
        } else {
          setIsNewVehicle(true);
          setSelectedVehicleId("");
        }
      } catch (err) {
        console.error("Gagal memuat kendaraan customer:", err);
        setVehicles([]);
        setIsNewVehicle(true);
      } finally {
        setIsLoadingVehicles(false);
      }
    };

    loadVehicles();
  }, [selectedCustomerId, isNewCustomer, customers]);

  // Update Biaya Otomatis saat Layanan Terpilih Berubah
  const selectedService = services.find((s) => s.id === selectedServiceId);

  useEffect(() => {
    if (!selectedService) {
      setServiceFee(0);
      setAdminFee(0);
      setPhysicalCheckFee(0);
      setExpressFee(0);
      return;
    }

    setServiceFee(selectedService.service_fee || 0);
    setAdminFee(selectedService.admin_fee || 0);

    const sNameLower = selectedService.service_name.toLowerCase();
    const catLower = selectedService.category.toLowerCase();
    const isMutasiOrBalikNama =
      catLower.includes("mutasi") ||
      catLower.includes("balik nama") ||
      sNameLower.includes("balik nama");

    if (isMutasiOrBalikNama) {
      setIsNameTransferRequired(true);
    }

    const checkFee =
      selectedService.physical_check_fee ||
      (isMutasiOrBalikNama || sNameLower.includes("5 tahun") ? 30000 : 0);
    setPhysicalCheckFee(checkFee);

    if (serviceLevel === "EXPRESS") {
      setExpressFee(selectedService.express_fee || 50000);
    } else {
      setExpressFee(0);
    }
  }, [selectedService, serviceLevel]);

  // Metode Pengiriman Terpilih & Deteksi Kebutuhan Kurir Ekspedisi
  const selectedDeliveryMethod = deliveryMethods.find(
    (m) => m.method_code === pickupMethod,
  );
  const requiresCourier = Boolean(selectedDeliveryMethod?.requires_courier);

  // Auto-fetch Ongkir Resmi saat Kode Pos 5 Digit & Metode Memerlukan Kurir Ekspedisi
  useEffect(() => {
    if (!requiresCourier) {
      setShippingRates([]);
      setSelectedRate(null);
      setRatesErrorMessage(null);
      if (selectedDeliveryMethod && selectedDeliveryMethod.flat_fee) {
        setDeliveryFee(selectedDeliveryMethod.flat_fee);
      } else {
        setDeliveryFee(0);
      }
      return;
    }

    const cleanPostal = postalCode.trim();
    if (cleanPostal.length === 5) {
      const fetchRates = async () => {
        setIsLoadingRates(true);
        setRatesErrorMessage(null);
        try {
          const res = await getShippingRates(cleanPostal, pickupMethod);
          const rawRates = res?.data?.rates || [];
          if (rawRates.length > 0) {
            setShippingRates(rawRates);
            const defaultRate = rawRates[0];
            setSelectedRate(defaultRate);
            setDeliveryFee(defaultRate.final_price ?? defaultRate.price ?? 0);
            toast.success("Tarif ongkir ekspedisi berhasil dihitung!");
          } else {
            setShippingRates([]);
            setSelectedRate(null);
            setRatesErrorMessage(
              "Tidak ada kurir ekspedisi yang tersedia untuk kode pos ini.",
            );
            toast.error("Tidak ada kurir yang tersedia untuk kode pos ini.");
          }
        } catch (err: any) {
          console.error("Gagal menghitung ongkos kirim:", err);
          setShippingRates([]);
          setSelectedRate(null);
          const errMsg =
            err.message ||
            "Gagal memuat tarif ongkir. Pastikan kode pos 5 digit benar.";
          setRatesErrorMessage(errMsg);
          toast.error(errMsg);
        } finally {
          setIsLoadingRates(false);
        }
      };

      fetchRates();
    } else {
      setShippingRates([]);
      setSelectedRate(null);
    }
  }, [postalCode, requiresCourier, pickupMethod, selectedDeliveryMethod]);

  // Total Biaya
  const totalCost =
    taxAmount +
    serviceFee +
    adminFee +
    physicalCheckFee +
    deliveryFee +
    expressFee;

  // Filter Pelanggan
  const filteredCustomers = useMemo(() => {
    const q = customerSearchQuery.toLowerCase().trim();
    if (!q) return customers;
    return customers.filter(
      (c) =>
        c.fullname?.toLowerCase().includes(q) ||
        c.phone_number?.toLowerCase().includes(q) ||
        c.nik?.toLowerCase().includes(q),
    );
  }, [customers, customerSearchQuery]);

  // Handler Submit Buat Pesanan
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedServiceId) {
      toast.error("Silakan pilih jenis layanan.");
      return;
    }

    setIsSubmitting(true);

    try {
      let finalCustomerId = selectedCustomerId;

      // 1. Buat Customer Baru jika dipilih
      if (isNewCustomer) {
        if (!newCustomerData.fullname.trim()) {
          throw new Error("Nama lengkap pelanggan wajib diisi.");
        }
        if (!newCustomerData.phone_number.trim()) {
          throw new Error("Nomor WhatsApp pelanggan wajib diisi.");
        }

        const createdCust = await createCustomer({
          fullname: newCustomerData.fullname.trim(),
          phone_number: newCustomerData.phone_number.trim(),
          nik: newCustomerData.nik.trim() || undefined,
          email: newCustomerData.email.trim() || undefined,
          address: newCustomerData.address.trim() || undefined,
        });

        finalCustomerId = createdCust.data?.id || "";
        if (!finalCustomerId) {
          throw new Error("Gagal mendaftarkan data pelanggan baru.");
        }
      }

      if (!finalCustomerId) {
        throw new Error("Silakan pilih atau daftarkan pelanggan.");
      }

      // 2. Buat Kendaraan Baru jika dipilih
      let finalVehicleId = selectedVehicleId;
      if (isNewVehicle) {
        if (
          !plateParts.p1.trim() ||
          !plateParts.p2.trim() ||
          !plateParts.p3.trim()
        ) {
          throw new Error(
            "Harap lengkapi semua kotak nomor plat kendaraan (Kode Wilayah, Angka, dan Seri Belakang). Contoh: B 1234 ABC.",
          );
        }
        const cleanPlate =
          `${plateParts.p1.trim()} ${plateParts.p2.trim()} ${plateParts.p3.trim()}`.toUpperCase();
        if (!/^[A-Z]{1,2}\s[0-9]{1,4}\s[A-Z]{1,3}$/.test(cleanPlate)) {
          throw new Error("Format plat nomor tidak valid. Contoh: B 1234 ABC.");
        }
        if (!newVehicleData.model_id) {
          throw new Error("Model kendaraan wajib dipilih.");
        }

        const yearInt = parseInt(newVehicleData.year, 10);
        const maxYear = currentYear + 1;
        if (!newVehicleData.year || isNaN(yearInt)) {
          throw new Error("Tahun pembuatan kendaraan wajib dipilih.");
        }
        if (yearInt < 1970 || yearInt > maxYear) {
          throw new Error(
            `Tahun pembuatan harus berada di antara tahun 1970 dan ${maxYear}.`,
          );
        }

        const createdVeh = await createCustomerVehicle({
          customer_id: finalCustomerId,
          model_id: newVehicleData.model_id,
          plate_number: cleanPlate,
          year: yearInt,
        });

        finalVehicleId = createdVeh.data?.id || "";
        if (!finalVehicleId) {
          throw new Error("Gagal mendaftarkan data kendaraan baru.");
        }
      }

      if (!finalVehicleId) {
        throw new Error("Silakan pilih atau daftarkan kendaraan.");
      }

      // 3. Panggil API Create Order Admin
      let finalNotes = notes.trim();
      if (requiresCourier && selectedRate) {
        const courierNote = `[Ekspedisi: ${selectedRate.courier_name} (${selectedRate.courier_service_name}) - Kodepos: ${postalCode.trim()}]`;
        finalNotes = finalNotes ? `${finalNotes} ${courierNote}` : courierNote;
      }

      const formattedPickupAddress =
        pickupMethod === "WALK_IN"
          ? "DATANG_LANGSUNG_KE_KANTOR"
          : pickupAddress.trim()
            ? postalCode.trim()
              ? `${pickupAddress.trim()}, Kodepos: ${postalCode.trim()}`
              : pickupAddress.trim()
            : postalCode.trim()
              ? `Kodepos: ${postalCode.trim()}`
              : undefined;

      const createdOrderRes = await createOrderAdminApi({
        customer_id: finalCustomerId,
        vehicle_id: finalVehicleId,
        service_id: selectedServiceId,
        service_level: serviceLevel,
        pickup_method: pickupMethod,
        return_method: returnMethod,
        pickup_address: formattedPickupAddress,
        tax_amount: taxAmount,
        service_fee: serviceFee,
        admin_fee: adminFee,
        physical_check_fee: physicalCheckFee,
        delivery_fee: deliveryFee,
        express_fee: expressFee,
        is_name_transfer_required: isNameTransferRequired,
        samsat_origin: isNameTransferRequired
          ? samsatOrigin.trim() || undefined
          : undefined,
        samsat_destination: isNameTransferRequired
          ? samsatDestination.trim() || undefined
          : undefined,
        notes:
          finalNotes ||
          (pickupMethod === "WALK_IN"
            ? "[Metode: Datang Langsung ke Kantor]"
            : `[Metode: ${selectedDeliveryMethod?.method_name || pickupMethod}]`),
      });

      const newOrderId = createdOrderRes?.data?.id;
      if (newOrderId) {
        try {
          await generateInvoiceApi(newOrderId);
        } catch (invErr) {
          console.warn("Gagal auto-generate invoice saat admin order:", invErr);
        }
      }

      toast.success("Pesanan berhasil dibuat oleh Admin!");
      window.dispatchEvent(new CustomEvent("orderUpdated"));
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Gagal membuat pesanan admin:", err);
      toast.error(err.message || "Terjadi kesalahan saat membuat pesanan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
              <FilePlus className="w-6 h-6 stroke-2" />
            </span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Buat Pesanan Baru
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Input pesanan manual untuk pelanggan walk-in, via WhatsApp, atau
                telepon kantor.
              </p>
            </div>
          </div>
        </div>
      </div>

      {isLoadingInitial ? (
        <div className="py-24 flex flex-col items-center justify-center gap-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-xs text-slate-500 font-medium">
            Menyiapkan data master pelanggan, kendaraan, dan layanan...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Kolom Kiri: Form Input Lengkap (2 Kolom) */}
            <div className="lg:col-span-2 space-y-6">
              {/* CARD 1: DATA PELANGGAN */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
                <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                      1. Data Pelanggan
                    </h2>
                  </div>

                  <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-0.5 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setIsNewCustomer(false)}
                      className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                        !isNewCustomer
                          ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs"
                          : "text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      Pelanggan Terdaftar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsNewCustomer(true);
                        setIsNewVehicle(true);
                      }}
                      className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                        isNewCustomer
                          ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs"
                          : "text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      + Pelanggan Baru
                    </button>
                  </div>
                </div>

                {!isNewCustomer ? (
                  <div className="space-y-3">
                    <div className="relative">
                      <Search
                        size={15}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        type="text"
                        placeholder="Cari pelanggan berdasarkan Nama / No. HP / NIK..."
                        value={customerSearchQuery}
                        onChange={(e) => setCustomerSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                      />
                    </div>
                    <select
                      value={selectedCustomerId}
                      onChange={(e) => setSelectedCustomerId(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                      required
                    >
                      <option value="">-- Pilih Pelanggan Terdaftar --</option>
                      {filteredCustomers.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.fullname} ({c.phone_number || "Tanpa No HP"}{" "}
                          {c.nik ? `- NIK: ${c.nik}` : ""})
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Nama Lengkap <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Budi Santoso"
                        value={newCustomerData.fullname}
                        onChange={(e) =>
                          setNewCustomerData((prev) => ({
                            ...prev,
                            fullname: e.target.value,
                          }))
                        }
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                        required={isNewCustomer}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Nomor WhatsApp <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        placeholder="Contoh: 08123456789"
                        value={newCustomerData.phone_number}
                        onChange={(e) =>
                          setNewCustomerData((prev) => ({
                            ...prev,
                            phone_number: e.target.value.replace(/\D/g, ""),
                          }))
                        }
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                        required={isNewCustomer}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        NIK (KTP 16 Digit)
                      </label>
                      <input
                        type="text"
                        maxLength={16}
                        placeholder="Contoh: 3201234567890001"
                        value={newCustomerData.nik}
                        onChange={(e) =>
                          setNewCustomerData((prev) => ({
                            ...prev,
                            nik: e.target.value.replace(/\D/g, ""),
                          }))
                        }
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Email
                      </label>
                      <input
                        type="email"
                        placeholder="pelanggan@example.com"
                        value={newCustomerData.email}
                        onChange={(e) =>
                          setNewCustomerData((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Alamat Domisili
                      </label>
                      <input
                        type="text"
                        placeholder="Jalan, RT/RW, Kelurahan, Kecamatan, Kota"
                        value={newCustomerData.address}
                        onChange={(e) =>
                          setNewCustomerData((prev) => ({
                            ...prev,
                            address: e.target.value,
                          }))
                        }
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* CARD 2: DATA KENDARAAN */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
                <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Car className="w-5 h-5 text-emerald-600" />
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                      2. Data Kendaraan
                    </h2>
                  </div>

                  {!isNewCustomer && vehicles.length > 0 && (
                    <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-0.5 text-xs font-semibold">
                      <button
                        type="button"
                        onClick={() => setIsNewVehicle(false)}
                        className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                          !isNewVehicle
                            ? "bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs"
                            : "text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        Garasi Pelanggan ({vehicles.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsNewVehicle(true)}
                        className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                          isNewVehicle
                            ? "bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs"
                            : "text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        + Kendaraan Baru
                      </button>
                    </div>
                  )}
                </div>

                {isLoadingVehicles ? (
                  <div className="py-6 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                    <span>Memuat garasi kendaraan pelanggan...</span>
                  </div>
                ) : !isNewVehicle && vehicles.length > 0 ? (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Pilih Kendaraan <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={selectedVehicleId}
                      onChange={(e) => setSelectedVehicleId(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                      required
                    >
                      <option value="">-- Pilih Kendaraan Terdaftar --</option>
                      {vehicles.map((v) => {
                        const modelInfo = models.find(
                          (m) => m.id === v.model_id,
                        );
                        const modelLabel =
                          v.brand_name && v.model_name
                            ? `${v.brand_name} ${v.model_name}`
                            : modelInfo
                              ? `${modelInfo.brand_name ? modelInfo.brand_name + " " : ""}${modelInfo.model_name}`
                              : "Kendaraan";

                        return (
                          <option key={v.id} value={v.id}>
                            {v.plate_number} - {modelLabel} ({v.year})
                          </option>
                        );
                      })}
                    </select>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Baris 1: Input Plat Nomor Terpisah (Sendiri di satu baris agar tidak bertabrakan) */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Nomor Polisi (Plat){" "}
                        <span className="text-rose-500">*</span>
                      </label>
                      <div className="flex items-center gap-2 max-w-sm">
                        <input
                          ref={plateP1Ref}
                          type="text"
                          placeholder="B"
                          value={plateParts.p1}
                          maxLength={2}
                          onChange={(e) =>
                            handlePlatePartChange("p1", e.target.value)
                          }
                          onKeyDown={(e) => handlePlateKeyDown("p1", e)}
                          className="w-16 px-2 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-800 outline-none text-slate-900 dark:text-white font-mono font-bold uppercase text-center text-xs sm:text-sm shrink-0"
                          required={isNewVehicle}
                        />
                        <span className="text-slate-400 dark:text-slate-600 font-bold text-sm shrink-0">
                          -
                        </span>
                        <input
                          ref={plateP2Ref}
                          type="text"
                          placeholder="1234"
                          value={plateParts.p2}
                          maxLength={4}
                          onChange={(e) =>
                            handlePlatePartChange("p2", e.target.value)
                          }
                          onKeyDown={(e) => handlePlateKeyDown("p2", e)}
                          className="flex-1 px-3 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-800 outline-none text-slate-900 dark:text-white font-mono font-bold uppercase text-center text-xs sm:text-sm tracking-widest"
                          required={isNewVehicle}
                        />
                        <span className="text-slate-400 dark:text-slate-600 font-bold text-sm shrink-0">
                          -
                        </span>
                        <input
                          ref={plateP3Ref}
                          type="text"
                          placeholder="XYZ"
                          value={plateParts.p3}
                          maxLength={3}
                          onChange={(e) =>
                            handlePlatePartChange("p3", e.target.value)
                          }
                          onKeyDown={(e) => handlePlateKeyDown("p3", e)}
                          className="w-20 px-2.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-800 outline-none text-slate-900 dark:text-white font-mono font-bold uppercase text-center text-xs sm:text-sm shrink-0"
                          required={isNewVehicle}
                        />
                      </div>
                      {isPlateComplete === true ? (
                        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1.5 flex items-center gap-1 font-medium">
                          <Check className="w-3.5 h-3.5 shrink-0" />
                          Plat nomor:{" "}
                          <span className="font-mono font-bold">
                            {newVehicleData.plate_number}
                          </span>
                        </p>
                      ) : isPlateComplete === false ? (
                        <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1.5 flex items-center gap-1 font-medium">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          Lengkapi [Wilayah] - [Nomor] - [Seri]
                        </p>
                      ) : (
                        <p className="text-[11px] text-slate-400 mt-1">
                          Contoh: B - 1234 - XYZ
                        </p>
                      )}
                    </div>

                    {/* Baris 2: Model Kendaraan (2/3) & Tahun Pembuatan (1/3) */}
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          Model Kendaraan{" "}
                          <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={newVehicleData.model_id}
                          onChange={(e) =>
                            setNewVehicleData((prev) => ({
                              ...prev,
                              model_id: e.target.value,
                            }))
                          }
                          className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                          required={isNewVehicle}
                        >
                          <option value="">
                            -- Pilih Merk & Model Kendaraan --
                          </option>
                          {models.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.brand_name} - {m.model_name} ({m.vehicle_type})
                            </option>
                          ))}
                        </select>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Pilih merk, model, dan tipe kendaraan yang sesuai
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          Tahun Pembuatan{" "}
                          <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={newVehicleData.year}
                          onChange={(e) =>
                            setNewVehicleData((prev) => ({
                              ...prev,
                              year: e.target.value,
                            }))
                          }
                          className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none cursor-pointer"
                          required={isNewVehicle}
                        >
                          <option value="">-- Pilih Tahun --</option>
                          {availableYears.map((yr) => (
                            <option key={yr} value={yr}>
                              {yr}
                            </option>
                          ))}
                        </select>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Rentang: 1970 - {currentYear + 1}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* CARD 3: LAYANAN & TARIF */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <DollarSign className="w-5 h-5 text-purple-600" />
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    3. Pilihan Layanan & Tingkat Kecepatan
                  </h2>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Jenis Layanan Biro Jasa{" "}
                      <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={selectedServiceId}
                      onChange={(e) => setSelectedServiceId(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none"
                      required
                    >
                      <option value="">-- Pilih Layanan --</option>
                      {services.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.service_name} (Rp{" "}
                          {s.service_fee.toLocaleString("id-ID")})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Tingkat Kecepatan (Service Level)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setServiceLevel("REGULER")}
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                          serviceLevel === "REGULER"
                            ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 shadow-sm"
                            : "bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                        }`}
                      >
                        <Clock size={13} />
                        REGULER
                      </button>
                      <button
                        type="button"
                        onClick={() => setServiceLevel("EXPRESS")}
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                          serviceLevel === "EXPRESS"
                            ? "bg-orange-500 text-white border-orange-500 shadow-sm"
                            : "bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                        }`}
                      >
                        <Zap size={13} />
                        EXPRESS
                      </button>
                    </div>
                  </div>
                </div>

                {/* Balik Nama & Samsat Fields */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="nameTransferCheckboxPage"
                      checked={isNameTransferRequired}
                      onChange={(e) =>
                        setIsNameTransferRequired(e.target.checked)
                      }
                      className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                    />
                    <label
                      htmlFor="nameTransferCheckboxPage"
                      className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
                    >
                      Termasuk Proses Balik Nama / Mutasi Wilayah
                    </label>
                  </div>

                  {isNameTransferRequired && (
                    <div className="grid sm:grid-cols-2 gap-3 p-3.5 bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-2xl">
                      <div>
                        <label className="block text-[11px] font-semibold text-amber-900 dark:text-amber-300 mb-1">
                          Samsat Asal
                        </label>
                        <input
                          type="text"
                          placeholder="Contoh: Samsat Jakarta Barat"
                          value={samsatOrigin}
                          onChange={(e) => setSamsatOrigin(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-amber-900 dark:text-amber-300 mb-1">
                          Samsat Tujuan
                        </label>
                        <input
                          type="text"
                          placeholder="Contoh: Samsat Depok"
                          value={samsatDestination}
                          onChange={(e) => setSamsatDestination(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* CARD 4: LOGISTIK & PENGIRIMAN */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-blue-600" />
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                      4. Logistik & Pengiriman
                    </h2>
                  </div>
                  {requiresCourier && (
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 flex items-center gap-1">
                      <Package className="w-3.5 h-3.5" />
                      Kurir Ekspedisi Aktif
                    </span>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Metode Penyerahan Dokumen */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Metode Penyerahan Dokumen
                    </label>
                    <select
                      value={pickupMethod}
                      onChange={(e) => {
                        setPickupMethod(e.target.value);
                        setReturnMethod(e.target.value);
                      }}
                      className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                    >
                      {deliveryMethods.map((m) => (
                        <option key={m.id} value={m.method_code}>
                          {m.method_name}{" "}
                          {m.requires_courier ? "(Perlu Kurir Ekspedisi)" : ""}
                        </option>
                      ))}
                    </select>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {selectedDeliveryMethod?.description ||
                        "Pilih skenario penyerahan berkas fisik"}
                    </p>
                  </div>

                  {/* Kode Pos Tujuan */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Kode Pos Tujuan{" "}
                      {requiresCourier && (
                        <span className="text-rose-500">*</span>
                      )}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Contoh: 12345"
                        maxLength={5}
                        value={postalCode}
                        onChange={(e) =>
                          setPostalCode(
                            e.target.value.replace(/[^0-9]/g, "").slice(0, 5),
                          )
                        }
                        disabled={!requiresCourier}
                        className={`w-full px-3.5 py-2.5 text-xs sm:text-sm font-mono font-bold tracking-wider rounded-xl border outline-none ${
                          !requiresCourier
                            ? "bg-slate-100 dark:bg-slate-800/60 cursor-not-allowed text-slate-400 border-slate-200 dark:border-slate-700"
                            : "bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        }`}
                      />
                      {isLoadingRates && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-xs text-blue-600 font-medium">
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Cek tarif...</span>
                        </div>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {requiresCourier
                        ? "Ketik 5 digit angka kode pos untuk hitung ongkir otomatis"
                        : "Hanya aktif jika metode memerlukan kurir ekspedisi"}
                    </p>
                  </div>

                  {/* Alamat Penjemputan / Pengantaran */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Alamat Penjemputan / Pengantaran
                    </label>
                    <input
                      type="text"
                      placeholder={
                        pickupMethod === "WALK_IN"
                          ? "Datang Langsung ke Kantor"
                          : "Contoh: Jl. Sudirman No. 45, RT 01/RW 02, Menteng, Jakarta Pusat"
                      }
                      disabled={pickupMethod === "WALK_IN"}
                      value={pickupAddress}
                      onChange={(e) => setPickupAddress(e.target.value)}
                      className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none ${
                        pickupMethod === "WALK_IN"
                          ? "bg-slate-100 dark:bg-slate-800/60 cursor-not-allowed text-slate-400"
                          : "bg-slate-50 dark:bg-slate-800/80 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      }`}
                    />
                  </div>

                  {/* Box Pilihan Kurir & Tarif Layanan Ekspedisi (Biteship) */}
                  {requiresCourier && (
                    <div className="sm:col-span-2 p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                          <Package className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          Pilihan Kurir & Tarif Layanan Ekspedisi (Biteship)
                        </label>
                        {selectedRate && (
                          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                            Rp{" "}
                            {(
                              selectedRate.final_price ??
                              selectedRate.price ??
                              0
                            ).toLocaleString("id-ID")}
                          </span>
                        )}
                      </div>

                      {postalCode.length !== 5 ? (
                        <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                          Silakan masukkan 5 digit Kode Pos Tujuan di atas untuk
                          memuat pilihan kurir dan tarif ongkir resmi.
                        </p>
                      ) : isLoadingRates ? (
                        <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 py-2 font-medium">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>
                            Menghubungi layanan ekspedisi untuk mengecek tarif
                            ongkir...
                          </span>
                        </div>
                      ) : ratesErrorMessage ? (
                        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-700 dark:text-amber-300">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{ratesErrorMessage}</span>
                        </div>
                      ) : shippingRates.length > 0 ? (
                        <div className="space-y-2">
                          <select
                            value={
                              selectedRate
                                ? `${selectedRate.courier_code}-${selectedRate.courier_service_code}`
                                : ""
                            }
                            onChange={(e) => {
                              const found = shippingRates.find(
                                (r) =>
                                  `${r.courier_code}-${r.courier_service_code}` ===
                                  e.target.value,
                              );
                              if (found) {
                                setSelectedRate(found);
                                setDeliveryFee(
                                  found.final_price ?? found.price ?? 0,
                                );
                              }
                            }}
                            className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20"
                          >
                            {shippingRates.map((r) => {
                              const price = r.final_price ?? r.price ?? 0;
                              return (
                                <option
                                  key={`${r.courier_code}-${r.courier_service_code}`}
                                  value={`${r.courier_code}-${r.courier_service_code}`}
                                >
                                  {r.courier_name} - {r.courier_service_name}{" "}
                                  (Rp {price.toLocaleString("id-ID")}) |
                                  Estimasi: {r.duration_range} {r.duration_unit}
                                </option>
                              );
                            })}
                          </select>
                          {selectedRate && (
                            <p className="text-[11px] text-blue-600 dark:text-blue-400 flex items-center gap-1 font-medium">
                              <Check className="w-3.5 h-3.5" />
                              Tarif terpilih otomatis diterapkan ke rincian
                              pembayaran:{" "}
                              <b>
                                Rp{" "}
                                {(
                                  selectedRate.final_price ??
                                  selectedRate.price ??
                                  0
                                ).toLocaleString("id-ID")}
                              </b>
                            </p>
                          )}
                        </div>
                      ) : null}
                    </div>
                  )}

                  {/* Catatan Khusus */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Catatan Khusus Petugas (Notes)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Contoh: Berkas asli dititipkan ke resepsionis / Pelanggan minta diprioritaskan selesai hari ini"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Kolom Kanan: Rincian Biaya Sticky (1 Kolom) */}
            <div className="lg:col-span-1 sticky top-8 space-y-6">
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
                <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    Rincian Pembayaran
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                    Biaya & Tagihan Resmi
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Admin dapat menyesuaikan nominal di bawah ini jika
                    diperlukan.
                  </p>
                </div>

                <div className="space-y-3.5 text-xs sm:text-sm">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-slate-500 dark:text-slate-400">
                        Biaya Jasa:
                      </span>
                      <span className="font-mono font-semibold">
                        Rp {serviceFee.toLocaleString("id-ID")}
                      </span>
                    </div>
                    <input
                      type="number"
                      value={serviceFee}
                      onChange={(e) => setServiceFee(Number(e.target.value))}
                      className="w-full px-2.5 py-1 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-right"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-slate-500 dark:text-slate-400">
                        Biaya Admin Kantor:
                      </span>
                      <span className="font-mono font-semibold">
                        Rp {adminFee.toLocaleString("id-ID")}
                      </span>
                    </div>
                    <input
                      type="number"
                      value={adminFee}
                      onChange={(e) => setAdminFee(Number(e.target.value))}
                      className="w-full px-2.5 py-1 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-right"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-slate-500 dark:text-slate-400">
                        Pajak Kendaraan (PKB):
                      </span>
                      <span className="font-mono font-semibold">
                        Rp {taxAmount.toLocaleString("id-ID")}
                      </span>
                    </div>
                    <input
                      type="number"
                      placeholder="0"
                      value={taxAmount}
                      onChange={(e) => setTaxAmount(Number(e.target.value))}
                      className="w-full px-2.5 py-1 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-right"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-slate-500 dark:text-slate-400">
                        Cek Fisik Kendaraan:
                      </span>
                      <span className="font-mono font-semibold">
                        Rp {physicalCheckFee.toLocaleString("id-ID")}
                      </span>
                    </div>
                    <input
                      type="number"
                      value={physicalCheckFee}
                      onChange={(e) =>
                        setPhysicalCheckFee(Number(e.target.value))
                      }
                      className="w-full px-2.5 py-1 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-right"
                    />
                  </div>

                  {serviceLevel === "EXPRESS" && (
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-orange-600 font-semibold flex items-center gap-1">
                          <Zap size={11} /> Biaya Express:
                        </span>
                        <span className="font-mono font-semibold text-orange-600">
                          Rp {expressFee.toLocaleString("id-ID")}
                        </span>
                      </div>
                      <input
                        type="number"
                        value={expressFee}
                        onChange={(e) => setExpressFee(Number(e.target.value))}
                        className="w-full px-2.5 py-1 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-right"
                      />
                    </div>
                  )}

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-slate-500 dark:text-slate-400">
                        Biaya Antar/Jemput:
                      </span>
                      <span className="font-mono font-semibold">
                        Rp {deliveryFee.toLocaleString("id-ID")}
                      </span>
                    </div>
                    <input
                      type="number"
                      value={deliveryFee}
                      onChange={(e) => setDeliveryFee(Number(e.target.value))}
                      className="w-full px-2.5 py-1 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-right"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Total Biaya Keseluruhan
                  </span>
                  <div className="text-2xl font-black text-blue-600 dark:text-blue-400 font-mono">
                    Rp {totalCost.toLocaleString("id-ID")}
                  </div>
                </div>

                <div className="space-y-2.5 pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting || isLoadingInitial}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Memproses Pesanan...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 stroke-[2.5]" />
                        <span>Buat Pesanan Sekarang</span>
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => navigate("/dashboard")}
                    disabled={isSubmitting}
                    className="w-full text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  >
                    Batal
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
