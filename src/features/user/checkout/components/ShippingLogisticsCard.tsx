import {
  AlertCircle,
  Building2,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Info,
  Loader2,
  MapPin,
  Package,
  Phone,
  Truck,
  UserCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  DEFAULT_OFFICE_PROFILE,
  type CompanyProfile,
} from "../../../../api/companyProfile";
import { type ShippingRate } from "../../../../api/shipping";
import { useCompanyProfile } from "../../../../shared/hooks/useCompanyProfile";
import { useDeliveryMethods } from "../../../../shared/hooks/useDeliveryMethods";
import type { DeliveryMethod } from "../../../../types/deliveryMethod";
import { type CheckoutFormData, type FormErrors } from "../types";

interface ShippingLogisticsCardProps {
  formData: CheckoutFormData;
  setFormData: React.Dispatch<React.SetStateAction<CheckoutFormData>>;
  shippingRates: ShippingRate[];
  selectedCourierCompany: string;
  setSelectedCourierCompany: (company: string) => void;
  selectedRate: ShippingRate | null;
  setSelectedRate: (rate: ShippingRate | null) => void;
  isLoadingRates: boolean;
  ratesErrorMessage?: string | null;
  isServiceInherentlyNameTransfer?: boolean;
  officeProfile?: CompanyProfile;
  errors?: FormErrors;
  onClearError?: (field: keyof FormErrors) => void;
}

export default function ShippingLogisticsCard({
  formData,
  setFormData,
  shippingRates,
  selectedCourierCompany,
  setSelectedCourierCompany,
  selectedRate,
  setSelectedRate,
  isLoadingRates,
  ratesErrorMessage,
  officeProfile: propOfficeProfile,
  errors = {},
  onClearError,
}: ShippingLogisticsCardProps) {
  const { profile: hookOfficeProfile } = useCompanyProfile();
  const { deliveryMethods, isLoading: isLoadingMethods } = useDeliveryMethods();

  const currentOfficeProfile =
    propOfficeProfile || hookOfficeProfile || DEFAULT_OFFICE_PROFILE;

  const displayOfficeAddress = currentOfficeProfile.full_address
    ? currentOfficeProfile.post_code &&
      !currentOfficeProfile.full_address.includes(
        currentOfficeProfile.post_code,
      )
      ? `${currentOfficeProfile.full_address}, ${currentOfficeProfile.post_code}`
      : currentOfficeProfile.full_address
    : DEFAULT_OFFICE_PROFILE.full_address;

  const [copied, setCopied] = useState(false);

  // Hanya metode yang aktif dari database
  const activeMethods = deliveryMethods.filter((m) => m.is_active);

  // Cari SATU metode terpilih (Single Selection)
  const selectedMethod =
    activeMethods.find(
      (m) =>
        m.method_code === formData.pickup_method ||
        m.method_code === formData.return_method,
    ) || activeMethods[0];

  // Inisialisasi default pilihan pertama saat data dimuat
  useEffect(() => {
    if (activeMethods.length > 0 && !formData.pickup_method) {
      const first = activeMethods[0];
      setFormData((prev) => ({
        ...prev,
        pickup_method: first.method_code,
        return_method:
          first.direction === "RETURN"
            ? first.method_code
            : first.direction === "BOTH"
              ? first.method_code
              : "RETURN_SAME_METHOD",
      }));
    }
  }, [activeMethods, formData.pickup_method, setFormData]);

  const handleSelectMethod = (method: DeliveryMethod) => {
    setFormData((prev) => ({
      ...prev,
      pickup_method: method.method_code,
      return_method:
        method.direction === "RETURN"
          ? method.method_code
          : method.direction === "BOTH"
            ? method.method_code
            : prev.return_method || "RETURN_SAME_METHOD",
    }));

    // Reset kurir & bersihkan error jika beralih ke metode NON-KURIR
    if (!method.requires_courier) {
      setSelectedRate(null);
      if (onClearError) {
        onClearError("courier");
        onClearError("postal_code");
      }
    }
  };

  const handleCopyOfficeAddress = () => {
    navigator.clipboard.writeText(displayOfficeAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getProviderIcon = (method: DeliveryMethod) => {
    if (method.provider_type === "INTERNAL") return UserCheck;
    if (method.provider_type === "SELF") return Building2;
    return Truck;
  };

  const requiresCourier = selectedMethod?.requires_courier;
  const isSelfOffice = selectedMethod?.provider_type === "SELF";

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-7">
      {/* Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Truck className="w-4 h-4" />
            <span>Alur Logistik & Dokumen</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Metode Penyerahan Dokumen
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pilih satu metode penyerahan berkas fisik (STNK/BPKB/KTP) yang
            paling nyaman untuk Anda.
          </p>
        </div>
      </div>

      {isLoadingMethods ? (
        <div className="py-12 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-2.5">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
          <span>Memuat opsi penyerahan dari sistem...</span>
        </div>
      ) : activeMethods.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs text-slate-500">
          Belum ada metode penyerahan yang diaktifkan oleh admin.
        </div>
      ) : (
        <div className="space-y-6">
          {/* Pilihan Metode Tunggal (Single Choice - Hanya 1 Ceklis) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {activeMethods.map((method) => {
              const isSelected = selectedMethod?.id === method.id;
              const Icon = getProviderIcon(method);

              return (
                <div
                  key={method.id}
                  onClick={() => handleSelectMethod(method)}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between select-none ${
                    isSelected
                      ? "bg-emerald-50/40 border-emerald-600 shadow-sm ring-2 ring-emerald-500/20"
                      : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60"
                  }`}
                >
                  <div>
                    {/* Top Bar: Icon + Title + Satu Ceklis */}
                    <div className="flex items-start justify-between gap-3 mb-2.5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                            isSelected
                              ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/30"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm leading-snug">
                            {method.method_name}
                          </h4>
                        </div>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                          isSelected
                            ? "bg-emerald-600 border-emerald-600 text-white"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-3" />}
                      </div>
                    </div>

                    {/* Deskripsi */}
                    <p className="text-xs text-slate-600 leading-relaxed mb-3">
                      {method.description || "Tidak ada deskripsi tambahan."}
                    </p>
                  </div>

                  {/* Bottom Fee & Requirement Badges */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 font-bold">
                      <span className="text-slate-400 font-normal">Biaya:</span>
                      <span
                        className={
                          method.flat_fee > 0
                            ? "text-emerald-700 font-extrabold"
                            : "text-slate-700"
                        }
                      >
                        {method.flat_fee > 0
                          ? `Rp ${method.flat_fee.toLocaleString("id-ID")}`
                          : method.requires_courier
                            ? "Sesuai Tarif Ekspedisi"
                            : "Rp 0 (Bebas Biaya)"}
                      </span>
                    </div>

                    {method.requires_address && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        <MapPin className="w-3 h-3 text-emerald-600" /> Butuh
                        Alamat
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Form Alamat Penjemputan (Jika metode yang dipilih butuh alamat) */}

          {/* Titik Lokasi Kantor (Jika metode yang dipilih adalah mandiri ke kantor) */}
          {isSelfOffice && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  Titik Lokasi Kantor Penyerahan Berkas
                </span>
                <button
                  type="button"
                  onClick={handleCopyOfficeAddress}
                  className="text-xs text-emerald-600 hover:text-emerald-700 font-bold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Alamat Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin Alamat</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-2">
                <p className="font-bold text-slate-900 leading-snug">
                  {currentOfficeProfile.office_name || "Kantor Pusat Biro Jasa"}
                </p>
                <p className="text-slate-600 leading-relaxed">
                  {displayOfficeAddress}
                </p>
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-4 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Jam Operasional:{" "}
                    <b>
                      {currentOfficeProfile.operational_hours ||
                        "Senin – Sabtu (08:00 – 17:00 WIB)"}
                    </b>
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    CS:{" "}
                    <b>{currentOfficeProfile.phone_number || "085156419062"}</b>
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Kurir Ekspedisi Rates (Biteship) - Hanya jika metode aktif butuh kurir */}
          {requiresCourier && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-emerald-600" />
                  <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                    Pilihan Ekspedisi & Tarif Layanan
                  </h3>
                </div>

                {isLoadingRates && (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold animate-pulse bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl shrink-0">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Menghitung ongkir...
                  </div>
                )}
              </div>

              {/* Notifikasi Error Ramah jika Kodepos Tidak Ditemukan / Tidak Valid */}
              {(errors.postal_code || ratesErrorMessage) && (
                <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>
                    {errors.postal_code ||
                      ratesErrorMessage ||
                      "Kodepos tidak ditemukan atau tidak valid. Mohon periksa kembali."}
                  </span>
                </div>
              )}

              {!formData.postal_code ||
              formData.postal_code.trim().length !== 5 ? (
                /* Langkah: Customer Belum Memasukkan Kodepos 5 Digit di Data Diri */
                <div className="bg-white/80 border border-dashed border-slate-200 rounded-2xl p-6 text-center space-y-1.5">
                  <Package className="w-6 h-6 text-slate-400 mx-auto" />
                  <p className="text-xs font-semibold text-slate-700">
                    Lengkapi Alamat & Kode Pos pada Data Diri di Atas
                  </p>
                  <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                    Pilihan kurir ekspedisi dan tarif layanan akan otomatis
                    muncul setelah alamat & kode pos 5 digit selesai diisi.
                  </p>
                </div>
              ) : isLoadingRates ? (
                /* Langkah: Sistem Otomatis Hit POST /shipping/rates */
                <div className="bg-white border border-emerald-200 rounded-2xl p-6 text-center space-y-3">
                  <div className="flex items-center justify-center gap-2 text-emerald-700 font-bold text-sm">
                    <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
                    <span>Menghitung Ongkos Kirim Resmi...</span>
                  </div>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Sedang memeriksa tarif pengantaran dan estimasi waktu ke
                    Kode Pos <b>{formData.postal_code}</b>.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-20 bg-slate-100 rounded-xl animate-pulse"
                      />
                    ))}
                  </div>
                </div>
              ) : shippingRates.length > 0 ? (
                /* Langkah: Tampilkan Kartu Pilihan Ekspedisi Lengkap dengan Harga & Estimasi */
                <div className="space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2 pb-1 border-b border-slate-200/80 text-xs">
                    <div className="flex items-center gap-2 text-slate-700">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      {/* <span>
                        Tarif resmi untuk Kode Pos:{" "}
                        <b className="font-mono text-slate-900 font-bold">
                          {formData.postal_code}
                        </b>
                      </span> */}
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        {shippingRates.length} Layanan Tersedia
                      </span>
                    </div>

                    {selectedMethod?.direction === "BOTH" && (
                      <span className="text-[11px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200 font-semibold">
                        Sudah termasuk tarif jemput & antar balik (2 Arah)
                      </span>
                    )}
                  </div>

                  {/* Tabs Kurir */}
                  <div className="flex flex-wrap gap-2">
                    {Array.from(
                      new Set(shippingRates.map((r) => r.courier_name)),
                    ).map((company) => {
                      const isActive = selectedCourierCompany === company;
                      const count = shippingRates.filter(
                        (r) => r.courier_name === company,
                      ).length;
                      return (
                        <button
                          key={company}
                          type="button"
                          onClick={() => {
                            setSelectedCourierCompany(company);
                            const firstRate = shippingRates.find(
                              (r) => r.courier_name === company,
                            );
                            if (firstRate) {
                              setSelectedRate(firstRate);
                              if (onClearError) onClearError("courier");
                            }
                          }}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                            isActive
                              ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          <span>{company}</span>
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                              isActive
                                ? "bg-slate-800 text-slate-300"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Cards Layanan Kurir */}
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {shippingRates
                      .filter(
                        (rate) => rate.courier_name === selectedCourierCompany,
                      )
                      .map((rate, idx) => {
                        const isSelected =
                          selectedRate?.courier_name === rate.courier_name &&
                          (selectedRate?.courier_service_code ===
                            rate.courier_service_code ||
                            selectedRate?.courier_service_name ===
                              rate.courier_service_name);

                        const displayPrice =
                          rate.final_price ?? rate.price ?? 0;

                        return (
                          <div
                            key={idx}
                            onClick={() => {
                              setSelectedRate(rate);
                              if (onClearError) onClearError("courier");
                            }}
                            className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                              isSelected
                                ? "bg-emerald-600 text-white border-emerald-600 shadow-sm ring-2 ring-emerald-500/20"
                                : "bg-white text-slate-800 border-slate-200 hover:border-emerald-300"
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-extrabold text-xs uppercase">
                                  {rate.courier_service_name}
                                </span>
                                {isSelected && (
                                  <CheckCircle2 className="w-4 h-4 text-white" />
                                )}
                              </div>
                              {(rate.duration_range || rate.duration_unit) && (
                                <p
                                  className={`text-[11px] mb-2 flex items-center gap-1 ${
                                    isSelected
                                      ? "text-emerald-100"
                                      : "text-slate-500"
                                  }`}
                                >
                                  <Clock className="w-3 h-3" />
                                  <span>
                                    Estimasi {rate.duration_range}{" "}
                                    {rate.duration_unit === "days"
                                      ? "hari"
                                      : rate.duration_unit || "hari"}
                                  </span>
                                </p>
                              )}
                            </div>
                            <p className="font-bold text-sm mt-1">
                              Rp {displayPrice.toLocaleString("id-ID")}
                            </p>
                          </div>
                        );
                      })}
                  </div>

                  {/* Error jika Kurir belum dipilih */}
                  {errors.courier && (
                    <p className="text-xs text-rose-600 font-medium flex items-center gap-1.5 mt-2 bg-rose-50 border border-rose-200 p-2.5 rounded-xl">
                      <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                      {errors.courier}
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-xs text-slate-500 text-center py-4 bg-white rounded-xl border border-slate-200">
                  Tidak ada tarif kurir yang ditemukan untuk kode pos ini.
                </div>
              )}
            </div>
          )}

          {/* Catatan Cek Fisik Samsat */}
          <div className="p-4 bg-amber-50/60 border border-amber-200/80 rounded-2xl flex items-start gap-3 text-xs text-amber-950">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <b>Catatan Berkas Fisik:</b> Serah terima di atas ditujukan untuk
              dokumen fisik (STNK/BPKB/KTP). Khusus layanan yang membutuhkan
              gesek nomor rangka & mesin (Pajak 5 Tahunan & STNK Hilang), cek
              fisik dapat dilakukan langsung di kantor biro jasa atau janjian
              bertemu langsung di Samsat bersama tim kami.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
