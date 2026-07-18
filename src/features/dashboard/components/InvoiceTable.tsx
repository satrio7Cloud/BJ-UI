import InvoiceStatusBadge from "./InvoiceStatusBadge";
import Pagination from "../../../shared/components/Pagination";
import Button from "../../../shared/components/Button";
import { MoreHorizontal } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getInvoices, type InvoiceData } from "../../../api/invoice";

const formatRupiah = (value: number) => "Rp " + value.toLocaleString("id-ID");
const ITEMS_PER_PAGE = 5;

export default function InvoiceTable() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const fetchInvoices = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await getInvoices(currentPage, ITEMS_PER_PAGE);
      if (res?.data) {
        setInvoices(res.data);
        setTotalItems(res.meta.total);
      }
    } catch (err: any) {
      console.error("Failed to fetch invoices", err);
      setError(err.message || "Gagal memuat invoice");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [currentPage]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-transparent dark:border-slate-800 transition-colors">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white transition-colors">Riwayat Invoice</h2>
        <Button
          onClick={() => navigate("/invoice")}
          className="px-4 py-2 border border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-400 rounded-lg text-sm hover:bg-blue-50 dark:hover:bg-blue-900/30 cursor-pointer transition-colors"
        >
          Lihat Semua
        </Button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-slate-700 dark:text-slate-300 transition-colors">
          <thead className="text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 transition-colors">
            <tr>
              <th className="text-left">No.</th>
              <th className="text-left py-3">No Invoice</th>
              <th className="text-left">Tanggal</th>
              <th className="text-left">Layanan</th>
              <th className="text-left">Jumlah</th>
              <th className="text-left">Status</th>
              <th className="text-right">Aksi</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 dark:divide-slate-800 transition-colors">
            {error ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-red-500 dark:text-red-400">
                  <p className="text-sm font-semibold">Gagal memuat data: {error}</p>
                  <button
                    onClick={fetchInvoices}
                    className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700 cursor-pointer"
                  >
                    Coba Lagi
                  </button>
                </td>
              </tr>
            ) : isLoading ? (
              <tr>
                <td colSpan={7} className="py-12 text-center">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                </td>
              </tr>
            ) : invoices.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400 dark:text-slate-500">
                  <p className="text-sm">Belum ada invoice</p>
                </td>
              </tr>
            ) : invoices.map((inv, index) => {
              const displayDate = new Date(inv.issue_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
              const mappedStatus = inv.payment_status?.toLowerCase() === "paid" ? "lunas" : "menunggu";
              
              return (
                <tr key={inv.invoice_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-4 font-medium text-slate-900 dark:text-white transition-colors">
                    {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                  </td>
                  <td className="py-4 font-medium text-slate-900 dark:text-white transition-colors">{inv.invoice_number}</td>
                  <td>{displayDate}</td>
                  <td>{inv.service_name || "-"}</td>
                  <td className="font-semibold text-slate-900 dark:text-white transition-colors">{formatRupiah(inv.total_cost || 0)}</td>
                  <td>
                    <InvoiceStatusBadge status={mappedStatus as any} />
                  </td>
                  <td className="text-right">
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 transition-colors cursor-pointer">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
