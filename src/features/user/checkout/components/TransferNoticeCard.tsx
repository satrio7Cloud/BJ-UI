import { FileText } from "lucide-react";

interface TransferNoticeCardProps {
  serviceName: string;
}

export default function TransferNoticeCard({
  serviceName,
}: TransferNoticeCardProps) {
  const isMutasi = serviceName.toLowerCase().includes("mutasi");

  return (
    <div className="bg-amber-50/80 border border-amber-200 rounded-3xl p-6 space-y-4">
      <h3 className="text-base font-bold text-amber-900 flex items-center gap-2">
        <FileText className="w-5 h-5 text-amber-600" />
        Informasi & Syarat Layanan
      </h3>
      <p className="text-sm text-amber-800 leading-relaxed">
        {isMutasi
          ? "Mutasi motor/kendaraan adalah proses memindahkan data surat kendaraan (STNK dan BPKB) dari satu wilayah Samsat asal ke wilayah Samsat tujuan yang baru. Syarat utamanya meliputi BPKB asli dan fotokopi, STNK asli, KTP pemilik baru, serta kuitansi jual beli bermeterai."
          : "Balik nama kendaraan adalah proses pengalihan kepemilikan kendaraan bermotor dari pemilik pertama ke pemilik kedua dan seterusnya. Syarat utamanya meliputi BPKB asli dan fotokopi, STNK asli, KTP pemilik baru, serta kuitansi jual beli bermeterai."}
      </p>
      <div className="border-t border-amber-200 pt-3">
        <p className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2">
          Syarat Dokumen Fisik:
        </p>
        <ul className="list-disc list-inside text-sm text-amber-800 space-y-1">
          <li>STNK asli beserta fotokopi</li>
          <li>BPKB asli beserta fotokopi</li>
          <li>KTP asli pemilik baru sesuai alamat tujuan</li>
        </ul>
      </div>
    </div>
  );
}
