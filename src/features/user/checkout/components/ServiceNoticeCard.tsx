import { AlertCircle, FileText, ShieldAlert } from "lucide-react";

interface ServiceNoticeCardProps {
  serviceName: string;
  category?: string;
  isNameTransferRequired?: boolean;
}

export default function ServiceNoticeCard({
  serviceName,
  category = "",
  isNameTransferRequired = false,
}: ServiceNoticeCardProps) {
  const nameLower = serviceName.toLowerCase();
  const categoryLower = category.toLowerCase();

  const is5Years =
    nameLower.includes("5 tahun") ||
    nameLower.includes("ganti plat") ||
    nameLower.includes("cek fisik");

  const isStnkHilang =
    nameLower.includes("hilang") ||
    nameLower.includes("duplikat") ||
    categoryLower.includes("hilang");

  const isTransferOrMutasi =
    isNameTransferRequired ||
    categoryLower === "mutasi kendaraan" ||
    categoryLower === "balik nama" ||
    nameLower.includes("balik nama") ||
    nameLower.includes("mutasi");

  // Jika tidak ada ketentuan khusus, tidak perlu render banner
  if (!is5Years && !isStnkHilang && !isTransferOrMutasi) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* 1. Ketentuan Cek Fisik Pajak 5 Tahunan */}
      {is5Years && (
        <div className="bg-amber-50/90 border border-amber-200/90 rounded-3xl p-6 space-y-3.5 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <ShieldAlert className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-950">
                Ketentuan Khusus Pajak 5 Tahunan (Ganti Plat & Cek Fisik)
              </h3>
              <p className="text-xs text-amber-800">
                Wajib melakukan cek fisik gesek nomor rangka & nomor mesin pada unit kendaraan
              </p>
            </div>
          </div>

          <div className="bg-white/90 border border-amber-200 rounded-2xl p-4 text-xs text-amber-950 space-y-2 leading-relaxed">
            <div className="flex items-start gap-2">
              <span className="font-bold text-amber-800 shrink-0">📍 Wilayah Depok:</span>
              <span>
                Tim kami dapat mendatangi lokasi Anda langsung untuk melakukan proses gesek nomor rangka & mesin pada unit kendaraan.
              </span>
            </div>
            <div className="flex items-start gap-2 pt-2 border-t border-amber-100">
              <span className="font-bold text-amber-800 shrink-0">📍 Luar Wilayah Depok:</span>
              <span>
                Pelanggan dan unit kendaraan dapat <b>bertemu langsung dengan tim kami di Samsat Pusat (Samsat Induk)</b> sesuai jadwal yang disepakati untuk proses gesek fisik.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-amber-900 font-medium pl-1">
            <FileText className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span>Dokumen fisik wajib: <b>STNK Asli, BPKB Asli, dan KTP Asli Pemilik</b> (sesuai data STNK).</span>
          </div>
        </div>
      )}

      {/* 2. Ketentuan STNK Hilang */}
      {isStnkHilang && (
        <div className="bg-red-50/90 border border-red-200/90 rounded-3xl p-6 space-y-3.5 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <AlertCircle className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-red-950">
                Ketentuan Khusus Pengurusan STNK Hilang
              </h3>
              <p className="text-xs text-red-800">
                Wajib hadir langsung ke Samsat Pusat bersama unit kendaraan
              </p>
            </div>
          </div>

          <div className="bg-white/90 border border-red-200 rounded-2xl p-4 text-xs text-red-950 space-y-2 leading-relaxed">
            <p>
              Sesuai regulasi kepolisian, penerbitan duplikat STNK hilang mewajibkan legalisir <b>cek fisik (gesek nomor rangka & mesin) resmi langsung di Samsat Pusat (Samsat Induk)</b>.
            </p>
            <div className="flex items-start gap-2 pt-2 border-t border-red-100">
              <span className="font-bold text-red-800 shrink-0">Kehadiran Fisik:</span>
              <span>
                Pemilik dan unit kendaraan <b>wajib hadir langsung ke Samsat Pusat</b> untuk proses cek fisik kendaraan, dan akan didampingi langsung oleh tim biro jasa kami hingga tuntas.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-red-900 font-medium pl-1">
            <FileText className="w-3.5 h-3.5 text-red-700 shrink-0" />
            <span>Dokumen wajib: <b>BPKB Asli, KTP Asli Pemilik, dan Surat Kehilangan dari Kepolisian (Polsek/Polres)</b>.</span>
          </div>
        </div>
      )}

      {/* 3. Ketentuan Balik Nama & Mutasi */}
      {isTransferOrMutasi && !is5Years && (
        <div className="bg-emerald-50/90 border border-emerald-200/90 rounded-3xl p-6 space-y-3.5 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-xs">
              <FileText className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-emerald-950">
                Informasi & Syarat Layanan Balik Nama / Mutasi
              </h3>
              <p className="text-xs text-emerald-800">
                Pengalihan kepemilikan dan/atau perpindahan domisili Samsat kendaraan
              </p>
            </div>
          </div>

          <div className="bg-white/90 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-950 space-y-2 leading-relaxed">
            <p>
              Proses Balik Nama / Mutasi memindahkan data kepemilikan surat kendaraan (STNK & BPKB) ke pemilik baru. Pastikan dokumen fisik kendaraan lengkap untuk diserahkan ke tim kami.
            </p>
            <div className="pt-2 border-t border-emerald-100 space-y-1">
              <span className="font-bold text-emerald-800">Syarat Dokumen Fisik:</span>
              <ul className="list-disc list-inside space-y-0.5 text-emerald-900 pl-1">
                <li>STNK Asli beserta fotokopi</li>
                <li>BPKB Asli beserta fotokopi</li>
                <li>KTP Asli Pemilik Baru (sesuai alamat domisili tujuan)</li>
                <li>Kuitansi Jual Beli bermeterai asli</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
