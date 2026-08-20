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
    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm dark:shadow-none border border-transparent dark:border-slate-800 flex flex-col lg:flex-row gap-4 transition-colors">
      {/* SEARCH */}
      <div className="relative flex-1">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari invoice, layanan, atau nama pelanggan..."
          className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent text-slate-900 dark:text-white transition-colors"
        />
      </div>

      {/* STATUS FILTER */}
      <div className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors">
        <Filter size={16} className="text-slate-500 dark:text-slate-400" />
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="bg-transparent outline-none text-sm cursor-pointer text-slate-900 dark:text-white"
        >
          <option value="all" className="dark:bg-slate-900">Semua Status</option>
          <option value="lunas" className="dark:bg-slate-900">Sudah Dibayar</option>
          <option value="menunggu" className="dark:bg-slate-900">Menunggu</option>
          <option value="terlambat" className="dark:bg-slate-900">Terlambat</option>
        </select>
      </div>
    </div>
  );
}
