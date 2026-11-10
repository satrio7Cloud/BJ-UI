import { HelpCircle } from "lucide-react";
import type { ApiService } from "../../../../../api/services";

interface Props {
  selectedService?: ApiService;
}

export default function DocumentRequirementBox({ selectedService }: Props) {
  if (!selectedService) return null;

  const category = selectedService.category.toLowerCase();
  const isMutasiOrBalikNama =
    category.includes("mutasi") || category.includes("balik nama");
  if (!isMutasiOrBalikNama) return null;

  const isMutasi = category.includes("mutasi");

  return (
    <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4 mt-3">
      <div className="flex gap-3">
        <div className="mt-0.5 shrink-0">
          <HelpCircle className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-blue-900 mb-1">
            Dokumen yang Harus Disiapkan:
          </h4>
          <ul className="text-xs text-blue-800 space-y-1 list-disc ml-4">
            <li>KTP asli &amp; fotokopi pemilik baru.</li>
            <li>STNK asli beserta fotokopinya.</li>
            <li>BPKB asli beserta fotokopinya.</li>
            <li>
              Kwitansi pembelian/jual beli kendaraan bermaterai Rp10.000.
            </li>
          </ul>
          {isMutasi && (
            <p className="text-xs text-blue-800 mt-2 font-semibold">
              * Untuk proses Mutasi, Anda wajib melakukan proses cabut berkas di
              Samsat asal terlebih dahulu.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

