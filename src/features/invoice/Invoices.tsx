import {
    AlertCircle,
    ArrowLeft,
    CheckCircle,
    Clock,
    Download,
    Eye,
    FileX,
    MoreHorizontal,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getInvoices, type InvoiceData } from "../../api/invoice";
import InvoiceDetailPanel from "../dashboard/components/InvoiceDetailPanel";
import InvoiceFilter from "../dashboard/components/InvoiceFilter";
import InvoiceStatusBadge from "../dashboard/components/InvoiceStatusBadge";
import StatCard from "../dashboard/components/StatCard";

export default function Invoices() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [openAction, setOpenAction] = useState<string | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceData | null>(null);

  const fetchInvoices = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await getInvoices(1, 100);
      if (res?.data) {
        setInvoices(res.data);
      }
    } catch (err: any) {
      console.error("Failed to load invoices", err);
      setError(err.message || "Gagal memuat data tagihan.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const actionRef = useRef<HTMLTableCellElement>(null);

  const totalAmount = invoices.reduce((sum, inv) => sum + (inv.total_cost || 0), 0);
  const paidAmount = invoices
    .filter((inv) => inv.payment_status?.toLowerCase() === "paid")
    .reduce((sum, inv) => sum + (inv.total_cost || 0), 0);
  const pendingAmount = invoices
    .filter((inv) => inv.payment_status?.toLowerCase() === "unpaid")
    .reduce((sum, inv) => sum + (inv.total_cost || 0), 0);
  const overdueAmount = invoices
    .filter((inv) => inv.payment_status?.toLowerCase() === "overdue")
    .reduce((sum, inv) => sum + (inv.total_cost || 0), 0);

  const filteredInvoices = invoices.filter((invoice) => {
    const matchSearch =
      (invoice.invoice_number || "").toLowerCase().includes(search.toLowerCase()) ||
      (invoice.customer_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (invoice.service_name || "").toLowerCase().includes(search.toLowerCase());

    let mappedStatus = invoice.payment_status?.toLowerCase() === "paid" ? "lunas" : "menunggu";
    const matchStatus = status === "all" ? true : mappedStatus === status;

    return matchSearch && matchStatus;
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        actionRef.current &&
        !actionRef.current.contains(event.target as Node)
      ) {
        setOpenAction(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* HEADER */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors">Semua Invoice</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {filteredInvoices.length} dari {invoices.length} invoice
            </p>
          </div>
        </div>

        {/* SUMMARY */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Invoice" value={`Rp ${totalAmount.toLocaleString("id-ID")}`} />
          <StatCard
            title="Sudah Dibayar"
            value={`Rp ${paidAmount.toLocaleString("id-ID")}`}
            variant="success"
            icon={CheckCircle}
          />
          <StatCard
            title="Menunggu"
            value={`Rp ${pendingAmount.toLocaleString("id-ID")}`}
            variant="warning"
            icon={Clock}
          />
          <StatCard
            title="Terlambat"
            value={`Rp ${overdueAmount.toLocaleString("id-ID")}`}
            variant="danger"
            icon={AlertCircle}
          />
        </div>

        {/* FILTER */}
        <InvoiceFilter
          search={search}
          status={status}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
        />

        {/* TABLE */}
        {error ? (
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-red-100 dark:border-red-900/30 p-12 flex flex-col items-center text-red-500 dark:text-red-400 transition-colors">
            <AlertCircle size={48} />
            <p className="mt-4 text-sm font-semibold">Gagal memuat data</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">{error}</p>
            <button
              onClick={fetchInvoices}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 cursor-pointer transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        ) : isLoading ? (
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 p-12 flex justify-center text-slate-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 p-12 flex flex-col items-center text-slate-400 dark:text-slate-500 transition-colors">
            <FileX size={48} />
            <p className="mt-4 text-sm font-medium">
              Data invoice tidak ditemukan
            </p>
            <p className="text-xs mt-1">
              Coba ubah kata pencarian atau filter status
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-x-auto transition-colors">
            <h2 className="text-lg font-semibold p-4 border-b border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white transition-colors">
              Daftar Invoice
            </h2>

            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 transition-colors">
                <tr>
                  <th className="p-3 text-left">No. Invoice</th>
                  <th className="p-3 text-left">Tanggal</th>
                  <th className="p-3 text-left">Pelanggan</th>
                  <th className="p-3 text-left">Layanan</th>
                  <th className="p-3 text-left">Jumlah</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-right">Aksi</th>
                </tr>
              </thead>

              <tbody className="text-slate-700 dark:text-slate-300 transition-colors">
                {filteredInvoices.map((inv) => {
                  const displayDate = new Date(inv.issue_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
                  const mappedStatus = inv.payment_status?.toLowerCase() === "paid" ? "lunas" : "menunggu";

                  return (
                  <tr
                    key={inv.invoice_id}
                    onClick={() => setSelectedInvoice(inv)}
                    className="border-t border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    <td className="p-3 font-medium text-slate-900 dark:text-white">{inv.invoice_number}</td>

                    <td className="p-3">{displayDate}</td>

                    <td className="p-3">
                      <p className="font-medium text-slate-900 dark:text-white">{inv.customer_name || "-"}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">{inv.customer_email || "-"}</p>
                    </td>

                    <td className="p-3">{inv.service_name || "-"}</td>

                    <td className="p-3 font-semibold text-slate-900 dark:text-white">
                      Rp {(inv.total_cost || 0).toLocaleString("id-ID")}
                    </td>

                    <td className="p-3">
                      <InvoiceStatusBadge status={mappedStatus as any} />
                    </td>

                    <td ref={actionRef} className="p-3 text-right relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenAction(openAction === inv.invoice_id ? null : inv.invoice_id);
                        }}
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-pointer transition-colors"
                      >
                        <MoreHorizontal size={18} />
                      </button>

                      {/* ACTION DROPDOWN */}
                      {openAction === inv.invoice_id && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="absolute right-0 bottom-full mb-2 w-44 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-lg z-20 overflow-hidden transition-colors"
                        >
                          <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors">
                            <Eye size={16} />
                            Lihat Detail
                          </button>

                          <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors">
                            <Download size={16} />
                            Download PDF
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      {/* DETAIL DIALOG */}
      {selectedInvoice && (
        <InvoiceDetailPanel
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
}
