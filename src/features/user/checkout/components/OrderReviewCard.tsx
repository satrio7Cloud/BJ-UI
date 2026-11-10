import {
  Building2,
  Calendar,
  Car,
  CheckCircle2,
  ChevronLeft,
  Clock,
  CreditCard,
  FileText,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Truck,
  User,
  UserCheck,
} from "lucide-react";
import { type CompanyProfile } from "../../../../api/companyProfile";
import { type ShippingRate } from "../../../../api/shipping";
import { type VehicleModel } from "../../../../api/vehicle";
import Button from "../../../../shared/components/Button";
import { useDeliveryMethods } from "../../../../shared/hooks/useDeliveryMethods";
import { type CheckoutData, type CheckoutFormData } from "../types";

interface OrderReviewCardProps {
  checkoutData: CheckoutData;
  formData: CheckoutFormData;
  selectedRate: ShippingRate | null;
  models: VehicleModel[];
  ktpFile: File | null;
  stnkFile: File | null;
  estimasiPajakTotal: number;
  adminFee: number;
  physicalCheckFee: number;
  deliveryFee: number;
  totalDisplayPrice: number;
  isSubmitting: boolean;
  officeProfile?: CompanyProfile;
  onBackToEdit: () => void;
  onConfirmOrder: () => void;
}

export default function OrderReviewCard({
  checkoutData,
  formData,
  selectedRate,
  models,
  ktpFile,
  stnkFile,
  estimasiPajakTotal,
  adminFee,
  physicalCheckFee,
  deliveryFee,
  totalDisplayPrice,
  isSubmitting,
  officeProfile,
  onBackToEdit,
  onConfirmOrder,
}: OrderReviewCardProps) {
  const { pickupMethods, returnDeliveryMethods, deliveryMethods } =
    useDeliveryMethods();

  // Temukan metode terpilih
  const selectedMethod =
    deliveryMethods.find(
      (m) =>
        m.method_code === formData.pickup_method ||
        m.method_code === formData.return_method,
    ) ||
    pickupMethods.find((m) => m.method_code === formData.pickup_method) ||
    returnDeliveryMethods.find((m) => m.method_code === formData.return_method);

  // Temukan nama model kendaraan yang dipilih
  const selectedVehicleModel = models.find((m) => m.id === formData.model_id);
  const vehicleFullName = selectedVehicleModel
    ? `${selectedVehicleModel.brand_name ? selectedVehicleModel.brand_name + " " : ""}${selectedVehicleModel.model_name}`
    : "Kendaraan";

  const activePickup =
    selectedMethod ||
    pickupMethods.find((m) => m.method_code === formData.pickup_method);

  const pickupTitle =
    selectedMethod?.method_name ||
    activePickup?.method_name ||
    "Antar Berkas ke Kantor";
  const pickupDesc =
    selectedMethod?.description ||
    activePickup?.description ||
    "Penyerahan berkas fisik kendaraan.";

  const ScenarioIcon =
    selectedMethod?.provider_type === "INTERNAL"
      ? UserCheck
      : selectedMethod?.provider_type === "SELF"
        ? Building2
        : Truck;

  const returnAddressDisplay =
    formData.return_address?.trim() ||
    formData.pickup_address?.trim() ||
    formData.address;

  return (
    <div className="space-y-6">
      {/* Banner Konfirmasi */}
      <div className="bg-linear-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600/10 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Langkah 2: Tinjau Rincian Pesanan
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Periksa Kembali Rincian Anda
            </h2>
            <p className="text-slate-600 text-sm">
              Pastikan data pemesan, data kendaraan, dan metode pengiriman sudah
              sesuai sebelum melanjutkan.
            </p>
          </div>
          <button
            type="button"
            onClick={onBackToEdit}
            disabled={isSubmitting}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-emerald-700 bg-white px-4 py-2.5 rounded-xl border border-slate-200 hover:border-emerald-300 shadow-xs transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            Ubah Data
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Kolom Kiri: Rincian Lengkap */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Layanan yang Dipilih */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 pb-3 border-b border-slate-100">
              <FileText className="w-4 h-4 text-emerald-600" />
              1. Layanan & Paket yang Dipilih
            </h3>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-100/60 px-2.5 py-0.5 rounded-md">
                  {checkoutData.service.category || "Layanan Biro Jasa"}
                </span>
                <h4 className="text-lg font-extrabold text-slate-900 mt-1">
                  {checkoutData.service.service_name}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  {checkoutData.service.description ||
                    "Pengurusan dokumen kendaraan cepat, aman, dan resmi."}
                </p>
              </div>

              <div className="text-right sm:text-right shrink-0">
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                    checkoutData.pkg === "express"
                      ? "bg-amber-100 text-amber-800 border border-amber-200"
                      : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Paket {checkoutData.pkg}
                </span>
                <p className="text-base font-black text-slate-900 mt-1.5">
                  Rp{" "}
                  {(checkoutData.pkg === "reguler"
                    ? checkoutData.service.service_fee
                    : checkoutData.service.express_fee
                  ).toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          </div>

          {/* 2. Data Pemesan & Kontak */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 pb-3 border-b border-slate-100">
              <User className="w-4 h-4 text-emerald-600" />
              2. Data Diri Pemesan
            </h3>

            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <p className="text-xs text-slate-400 font-medium">
                  Nama Lengkap (Sesuai KTP)
                </p>
                <p className="font-bold text-slate-900 text-base mt-0.5">
                  {formData.fullname}
                </p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <p className="text-xs text-slate-400 font-medium flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  Nomor WhatsApp
                </p>
                <p className="font-bold text-slate-900 text-base mt-0.5">
                  {formData.phone_number}
                </p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <p className="text-xs text-slate-400 font-medium">
                  NIK KTP (16 Digit)
                </p>
                <p className="font-mono font-bold text-slate-900 text-base mt-0.5">
                  {formData.nik}
                </p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <p className="text-xs text-slate-400 font-medium flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-emerald-600" />
                  Email
                </p>
                <p className="font-semibold text-slate-900 mt-0.5 truncate">
                  {formData.email}
                </p>
              </div>

              <div className="sm:col-span-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <p className="text-xs text-slate-400 font-medium flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  Alamat Domisili / KTP
                </p>
                <p className="font-medium text-slate-800 text-sm mt-0.5 leading-relaxed">
                  {formData.address}
                </p>
                <span className="inline-block mt-2 font-mono text-xs font-bold text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                  Kode Pos: {formData.postal_code}
                </span>
              </div>
            </div>
          </div>

          {/* 3. Data Kendaraan */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 pb-3 border-b border-slate-100">
              <Car className="w-4 h-4 text-emerald-600" />
              3. Data Kendaraan
            </h3>

            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              <div className="sm:col-span-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-xs text-slate-400 font-medium">
                  Model Kendaraan
                </p>
                <p className="font-extrabold text-slate-900 text-lg mt-0.5">
                  {vehicleFullName}
                </p>
                {selectedVehicleModel?.vehicle_type && (
                  <span className="inline-block text-[11px] font-mono uppercase bg-slate-200/80 text-slate-700 px-2 py-0.5 rounded-md mt-1">
                    Jenis: {selectedVehicleModel.vehicle_type}
                  </span>
                )}
              </div>

              <div className="bg-slate-900 p-4 rounded-2xl text-white flex flex-col justify-center items-center text-center shadow-xs">
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
                  Nomor Polisi (Plat)
                </p>
                <span className="font-mono text-lg font-black tracking-widest text-emerald-400">
                  {formData.plate_number}
                </span>
                <span className="text-xs text-slate-300 mt-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  Tahun {formData.year}
                </span>
              </div>

              {formData.notes && (
                <div className="sm:col-span-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <p className="text-xs text-slate-400 font-medium">Catatan:</p>
                  <p className="text-xs text-slate-700 mt-1 font-mono">
                    {formData.notes}
                  </p>
                </div>
              )}

              {/* Samsat Info jika ada */}
              {(formData.samsat_origin || formData.samsat_destination) && (
                <div className="sm:col-span-3 grid sm:grid-cols-2 gap-3 bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200 text-xs">
                  <div>
                    <span className="text-amber-800 font-bold block">
                      Samsat Asal:
                    </span>
                    <span className="text-slate-800 font-medium">
                      {formData.samsat_origin || "-"}
                    </span>
                  </div>
                  <div>
                    <span className="text-amber-800 font-bold block">
                      Samsat Tujuan:
                    </span>
                    <span className="text-slate-800 font-medium">
                      {formData.samsat_destination || "-"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 4. Metode Pengiriman & Kurir Berkas */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-600" />
                4. Metode Pengiriman & Serah Terima Berkas
              </h3>
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                  selectedMethod?.provider_type === "INTERNAL"
                    ? "bg-blue-50 text-blue-700 border-blue-200"
                    : selectedMethod?.provider_type === "COURIER"
                      ? "bg-amber-50 text-amber-700 border-amber-200"
                      : "bg-emerald-50 text-emerald-700 border-emerald-200"
                }`}
              >
                {selectedMethod?.provider_type === "INTERNAL"
                  ? "Armada Internal Staf"
                  : selectedMethod?.provider_type === "COURIER"
                    ? "Ekspedisi Mitra Resmi"
                    : "Mandiri di Kantor"}
              </span>
            </div>

            {/* Container Rincian Metode */}
            <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 space-y-4">
              {/* Header Box Metode */}
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <ScenarioIcon className="w-5 h-5" />
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-extrabold text-slate-900 text-base leading-snug">
                      {pickupTitle}
                    </h4>
                    {selectedMethod?.direction === "BOTH" && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
                        Bolak-Balik (2 Arah)
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {pickupDesc}
                  </p>
                </div>
              </div>

              {/* Rincian Kurir Ekspedisi Terpilih */}
              {selectedRate && selectedMethod?.requires_courier && (
                <div className="bg-white p-4 rounded-xl border border-emerald-200/80 shadow-2xs space-y-2.5">
                  <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                    <div>
                      <span className="text-slate-400 font-medium block text-[11px]">
                        Mitra Ekspedisi & Layanan:
                      </span>
                      <span className="font-extrabold text-slate-900 text-sm">
                        {selectedRate.courier_name} —{" "}
                        {selectedRate.courier_service_name}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 font-medium block text-[11px]">
                        Biaya Ongkos Kirim:
                      </span>
                      <span className="font-black text-emerald-700 text-sm">
                        Rp {deliveryFee.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
                    {(selectedRate.duration_range ||
                      selectedRate.duration_unit) && (
                      <span className="flex items-center gap-1.5 font-medium text-slate-700">
                        <Clock className="w-3.5 h-3.5 text-emerald-600" />
                        Estimasi Waktu:{" "}
                        <b>
                          {selectedRate.duration_range}{" "}
                          {selectedRate.duration_unit === "days"
                            ? "hari"
                            : selectedRate.duration_unit || "hari"}
                        </b>
                      </span>
                    )}
                    {selectedMethod?.direction === "BOTH" && (
                      <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        Sudah termasuk jemput berkas & antar dokumen jadi
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Rincian Non-Kurir: Internal Staff (Khusus Depok) */}
              {selectedMethod?.method_code === "PICKUP_INTERNAL" && (
                <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-200/80 text-xs space-y-1.5 text-blue-900">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="font-extrabold flex items-center gap-1.5 text-blue-800">
                      <UserCheck className="w-4 h-4 text-blue-600" />
                      Penjemputan Armada Staf Kantor (Khusus Area Depok)
                    </span>
                    <span className="font-black text-blue-700 bg-white px-2.5 py-0.5 rounded-lg border border-blue-200">
                      Biaya: Rp {deliveryFee.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <p className="text-[11px] text-blue-700 leading-relaxed">
                    Staf operasional biro jasa akan datang langsung ke alamat
                    Anda untuk mengambil berkas persyaratan dan menyerahkan
                    tanda terima resmi di tempat.
                  </p>
                </div>
              )}

              {/* Rincian Non-Kurir: Mandiri Walk-in ke Kantor */}
              {selectedMethod?.provider_type === "SELF" && (
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2 text-xs">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-emerald-600" />
                      {officeProfile?.office_name || "Kantor Pusat Biro Jasa"}
                    </span>
                    <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                      Bebas Ongkir (Rp 0)
                    </span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    {officeProfile?.full_address || "Depok, Jawa Barat"}
                  </p>
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-4 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      Jam Buka:{" "}
                      <b>
                        {officeProfile?.operational_hours ||
                          "Senin – Sabtu (08:00 – 17:00 WIB)"}
                      </b>
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      CS: <b>{officeProfile?.phone_number || "085156419062"}</b>
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 italic pt-1">
                    * Harap bawa berkas fisik asli kendaraan (STNK / BPKB / KTP)
                    saat berkunjung ke kantor kami.
                  </p>
                </div>
              )}

              {/* Rincian Alamat Pengantaran / Penjemputan jika butuh alamat */}
              {selectedMethod?.requires_address && (
                <div className="pt-3 border-t border-slate-200/70 grid sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-700 mb-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      Alamat Penjemputan Berkas:
                    </span>
                    <p className="text-slate-600 leading-relaxed">
                      {formData.pickup_address || formData.address}
                    </p>
                    {formData.postal_code && (
                      <span className="inline-block mt-2 font-mono text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        Kode Pos: {formData.postal_code}
                      </span>
                    )}
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-700 mb-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      Alamat Pengembalian Dokumen Resmi:
                    </span>
                    <p className="text-slate-600 leading-relaxed">
                      {returnAddressDisplay}
                    </p>
                    {formData.postal_code && (
                      <span className="inline-block mt-2 font-mono text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        Kode Pos: {formData.postal_code}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 5. Dokumen yang Terlampir */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 pb-3 border-b border-slate-100">
              <FileText className="w-4 h-4 text-emerald-600" />
              5. Dokumen Terlampir
            </h3>

            <div className="grid sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                    ktpFile
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  KTP
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">
                    Foto E-KTP Asli
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {ktpFile
                      ? `${ktpFile.name} (${(ktpFile.size / 1024).toFixed(0)} KB)`
                      : "Belum diunggah (bisa menyusul)"}
                  </p>
                </div>
                {ktpFile && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                )}
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                    stnkFile
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  STNK
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">
                    Foto STNK Asli
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {stnkFile
                      ? `${stnkFile.name} (${(stnkFile.size / 1024).toFixed(0)} KB)`
                      : "Belum diunggah (bisa menyusul)"}
                  </p>
                </div>
                {stnkFile && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Rincian Harga & Konfirmasi Final */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900 rounded-3xl p-6 sm:p-7 shadow-xl sticky top-24 text-white space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-emerald-400 text-xs font-bold tracking-widest uppercase">
                Ringkasan Pembayaran
              </span>
              <h3 className="text-xl font-black mt-1">Rincian Biaya Resmi</h3>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Biaya Layanan Jasa</span>
                <span className="font-semibold">
                  Rp{" "}
                  {(checkoutData.pkg === "reguler"
                    ? checkoutData.service.service_fee
                    : checkoutData.service.express_fee
                  ).toLocaleString("id-ID")}
                </span>
              </div>

              {estimasiPajakTotal > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">
                    Estimasi Pajak (PKB + SWD)
                  </span>
                  <span className="font-semibold">
                    Rp {estimasiPajakTotal.toLocaleString("id-ID")}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-slate-400">Biaya Administrasi</span>
                <span className="font-semibold">
                  Rp {adminFee.toLocaleString("id-ID")}
                </span>
              </div>

              {physicalCheckFee > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Biaya Cek Fisik Resmi</span>
                  <span className="font-semibold text-emerald-400">
                    Rp {physicalCheckFee.toLocaleString("id-ID")}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-slate-400">
                    Biaya Pengiriman / Ongkir
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {deliveryFee === 0
                      ? "Mandiri (Bebas Biaya)"
                      : selectedRate
                        ? `${selectedRate.courier_name} (${selectedRate.courier_service_name})`
                        : "Kurir / Armada"}
                  </span>
                </div>
                <span
                  className={`font-semibold ${
                    deliveryFee === 0 ? "text-emerald-400" : "text-white"
                  }`}
                >
                  {deliveryFee === 0
                    ? "Bebas Ongkir (Rp 0)"
                    : `Rp ${deliveryFee.toLocaleString("id-ID")}`}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">
                Total Biaya Keseluruhan
              </p>
              <p className="text-3xl font-black text-emerald-400 tracking-tight">
                Rp {totalDisplayPrice.toLocaleString("id-ID")}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                *Termasuk seluruh rincian jasa dan pengiriman yang Anda pilih.
              </p>
            </div>

            {/* Proteksi Idempotency & Garansi */}
            {/* <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/80 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <Lock className="w-4 h-4 shrink-0" />
                <span>Transaksi Terproteksi Idempotency</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Sistem kami mengunci transaksi ganda secara otomatis. Pesanan tidak akan terduplikasi meski tombol ditekan berulang kali.
              </p>
            </div> */}

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <Button
                size="full"
                variant="primary"
                onClick={onConfirmOrder}
                isLoading={isSubmitting}
                className="py-4 text-base font-bold shadow-lg shadow-emerald-900/40 cursor-pointer flex items-center justify-center gap-2"
              >
                <CreditCard className="w-5 h-5" />
                <span>Konfirmasi & Lanjut Pembayaran</span>
              </Button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Pembayaran Resmi & Aman</span>
              </div>

              <button
                type="button"
                onClick={onBackToEdit}
                disabled={isSubmitting}
                className="w-full py-2.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer text-center"
              >
                ← Kembali dan Periksa Formulir
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
