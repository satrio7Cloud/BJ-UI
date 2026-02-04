import { Search, Filter } from "lucide-react";

type Props = {
  search: string;
  status: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
};

export default function InvoiceFilter({
  search,
  status,
  onSearchChange,
  onStatusChange,
}: Props) {
  return (
    <div className="bg-white p-4 rounded-xl shadow flex flex-col lg:flex-row gap-4">
      {/* SEARCH */}
      <div className="relative flex-1">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari invoice, layanan, atau nama pelanggan..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* STATUS FILTER */}
      <div className="flex items-center gap-2 px-4 py-2 border rounded-lg">
        <Filter size={16} className="text-gray-500" />
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="bg-transparent outline-none text-sm cursor-pointer"
        >
          <option value="all">Semua Status</option>
          <option value="lunas">Sudah Dibayar</option>
          <option value="menunggu">Menunggu</option>
          <option value="terlambat">Terlambat</option>
        </select>
      </div>
    </div>
  );
}
