import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useServices } from "../hooks/useServices";
import ServiceCard from "./ServiceCard";

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
}

export default function ServicesModal({ onClose }: Props) {
  const { servicesprice, category, setCategory, search, setSearch } =
    useServices();

  return (
    <motion.div
      className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white w-full max-w-6xl rounded-2xl p-8 max-h-[90vh] overflow-auto"
        initial={{ y: 40 }}
        animate={{ y: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold">
              Daftar Harga Urus Kendaraan
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Layanan resmi pengurusan STNK, BPKB, SIM, Mutasi & Plat Nomor
            </p>
          </div>

          <X className="cursor-pointer hover:text-red-500" onClick={onClose} />
        </div>

        {/* Search */}
        <input
          placeholder="Cari layanan (contoh: Pajak Tahunan)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-xl w-full px-4 py-3 mt-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Categories */}
        <div className="flex gap-3 mt-5 flex-wrap">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-4 py-2 rounded-full border text-sm transition cursor-pointer ${
                category === c
                  ? "bg-blue-600 text-white"
                  : "text-blue-600 border-blue-600 hover:bg-blue-50"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {servicesprice
            .filter((s) =>
              category === "Semua" ? true : s.category === category,
            )
            .filter((s) =>
              search
                ? s.title.toLowerCase().includes(search.toLowerCase()) ||
                  s.description?.toLowerCase().includes(search.toLowerCase())
                : true,
            )
            .map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
