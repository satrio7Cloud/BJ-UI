import { X } from "lucide-react";
import ServiceCard from "../ServiceCard";
import { type Service } from "../../../../data/services";
import { useServices } from "../../hooks/useServices";

export type ServiceCategory =
  | "Semua"
  | "STNK"
  | "BPKB"
  | "SIM"
  | "Plat Nomor"
  | "Mutasi";

const categories: ServiceCategory[] = [
  "Semua",
  "STNK",
  "BPKB",
  "SIM",
  "Plat Nomor",
  "Mutasi",
];

interface Props {
  onClose: () => void;
  onNext: (service: Service) => void;
}

export default function StepSelectService({ onClose, onNext }: Props) {
  const { servicesprice, category, setCategory, search, setSearch } =
    useServices();

  return (
    <div className="flex flex-col h-[90vh] max-w-5xl w-full bg-white rounded-2xl">
      {/* HEADER */}
      <div className="flex justify-between p-5 border-b">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold">
            Daftar Harga Urus Kendaraan
          </h2>

          <p className="text-sm text-gray-500 mt-1 hidden sm:block">
            Layanan resmi pengurusan STNK, BPKB, SIM, Mutasi & Plat Nomor
          </p>
        </div>

        <X onClick={onClose} className="cursor-pointer" />
      </div>

      <div className="p-5 flex flex-col flex-1 overflow-hidden min-h-0">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari layanan (contoh: Pajak Tahunan)"
          className="border rounded-xl px-4 py-3"
        />

        <div className="flex flex-wrap gap-2 mt-4">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-4 py-2 rounded-full border text-sm cursor-pointer ${
                category === c
                  ? "bg-blue-600 text-white"
                  : "border-blue-600 text-blue-600"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden mt-4 min-h-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {servicesprice.map((s) => (
              <ServiceCard key={s.id} service={s} onSelect={onNext} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
