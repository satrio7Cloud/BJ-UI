import { CheckCircle2, MapPin, PhoneCall, Info } from "lucide-react";
import type { Method } from "../../hooks/useShipping";
import Button from "../../../../shared/components/Button";

interface Props {
  shippingMethod: Method;
  onClose: () => void;
}

export default function StepSuccess({ shippingMethod, onClose }: Props) {
  return (
    <div className="flex flex-col w-full bg-white text-center justify-center items-center p-6 sm:p-12 min-h-[60vh]">
      
      {/* SUCCESS ANIMATED ICON */}
      <div className="relative mb-6">
        <div className="absolute inset-0 rounded-full bg-green-100 animate-ping opacity-75"></div>
        <CheckCircle2 className="relative text-green-500 w-16 h-16 sm:w-20 sm:h-20" />
      </div>

      {/* HEADER */}
      <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Pemesanan Terkirim!</h3>
      <p className="text-sm text-gray-500 mt-2 max-w-md">
        Detail pemesanan Anda telah dialihkan ke WhatsApp Admin Birosaja untuk verifikasi dokumen.
      </p>

      {/* INSTRUCTIONS CARD */}
      <div className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-5 mt-6 text-left space-y-3">
        {shippingMethod === "kurir" && (
          <>
            <h4 className="font-bold text-gray-900 flex items-center gap-1.5 text-sm sm:text-base">
              🚚 Penjemputan Kurir
            </h4>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Kurir kami akan memproses penjemputan berkas fisik Anda. Mohon tunggu konfirmasi titik penjemputan dan jam kedatangan kurir yang akan diinfokan admin kami lewat WhatsApp.
            </p>
            <div className="bg-blue-50 text-blue-800 text-xs p-3 rounded-lg flex items-start gap-2">
              <Info size={14} className="mt-0.5 shrink-0" />
              <span>Harap persiapkan dokumen fisik (seperti KTP, STNK asli, dsb) di dalam satu map/amplop rapi.</span>
            </div>
          </>
        )}

        {shippingMethod === "ojol" && (
          <>
            <h4 className="font-bold text-gray-900 flex items-center gap-1.5 text-sm sm:text-base">
              🏍️ Kirim Dokumen via Ojek Online
            </h4>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Silakan kirimkan dokumen Anda menggunakan layanan instan (Gojek / Grab / Maxim) ke alamat kantor kami:
            </p>
            <div className="bg-white border border-gray-300 p-3 rounded-lg text-xs flex items-start gap-2">
              <MapPin size={16} className="text-red-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-gray-900">Kantor Birosaja</p>
                <p className="text-gray-600 mt-0.5">
                  Jl. Hasan Saban, Depok RT.03/09 No. 04, Pancoran Mas, Depok (dekat mushala Al-Ikhwan)
                </p>
              </div>
            </div>
            <div className="bg-orange-50 text-orange-800 text-xs p-3 rounded-lg flex items-start gap-2">
              <Info size={14} className="mt-0.5 shrink-0" />
              <span>Tuliskan nama Anda dan nomor WhatsApp di bagian luar paket berkas sebelum dikirimkan ke driver.</span>
            </div>
          </>
        )}

        {shippingMethod === "datang" && (
          <>
            <h4 className="font-bold text-gray-900 flex items-center gap-1.5 text-sm sm:text-base">
              📍 Datang Langsung ke Kantor
            </h4>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Silakan serahkan langsung dokumen Anda ke kantor kami pada jam operasional kerja:
            </p>
            <div className="bg-white border border-gray-300 p-3 rounded-lg text-xs space-y-2">
              <div className="flex items-start gap-2">
                <MapPin size={16} className="text-red-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Alamat Kantor</p>
                  <p className="text-gray-600">
                    Jl. Hasan Saban, Depok RT.03/09 No. 04, Pancoran Mas, Depok (dekat mushala Al-Ikhwan)
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-1 border-t">
                <span className="font-semibold text-gray-700">Jam Buka:</span>
                <span className="text-gray-600">Senin - Sabtu (08:00 - 17:00 WIB)</span>
              </div>
            </div>
            <div className="bg-blue-50 text-blue-800 text-xs p-3 rounded-lg flex items-start gap-2">
              <PhoneCall size={14} className="mt-0.5 shrink-0" />
              <span>Mohon kabari admin kami via WhatsApp sebelum Anda berangkat ke kantor kami.</span>
            </div>
          </>
        )}
      </div>

      {/* FOOTER BUTTON */}
      <Button
        onClick={onClose}
        className="w-full bg-blue-600 text-white py-3 rounded-xl mt-6 font-semibold"
      >
        Tutup & Kembali ke Beranda
      </Button>
    </div>
  );
}
