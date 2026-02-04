import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import StatCard from "../features/dashboard/components/StatCard";
import InvoiceFilter from "../features/dashboard/components/InvoiceFilter";
import { invoices } from "../data/invoices";
import InvoiceStatusBadge from "../features/dashboard/components/InvoiceStatusBadge";
import InvoiceDetailPanel from "../features/dashboard/components/InvoiceDetailPanel";

export default function Invoices() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [openAction, setOpenAction] = useState<string | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);

  const actionRef = useRef<HTMLTableCellElement>(null);

  const filteredInvoices = invoices.filter((invoice) => {
    const matchSearch =
      invoice.id.toLowerCase().includes(search.toLowerCase()) ||
      invoice.customer.toLowerCase().includes(search.toLowerCase()) ||
      invoice.service.toLowerCase().includes(search.toLowerCase());

    const matchStatus = status === "all" ? true : invoice.status === status;

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
    <div className="bg-gray-50 min-h-screen overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* HEADER */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <h1 className="text-2xl font-bold">Semua Invoice</h1>
            <p className="text-sm text-gray-500">
              {filteredInvoices.length} dari {invoices.length} invoice
            </p>
          </div>
        </div>

        {/* SUMMARY */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Invoice" value="Rp 9.850.000" />
          <StatCard
            title="Sudah Dibayar"
            value="Rp 4.800.000"
            variant="success"
            icon={CheckCircle}
          />
          <StatCard
            title="Menunggu"
            value="Rp 4.300.000"
            variant="warning"
            icon={Clock}
          />
          <StatCard
            title="Terlambat"
            value="Rp 750.000"
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
        {filteredInvoices.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-12 flex flex-col items-center text-gray-400">
            <FileX size={48} />
            <p className="mt-4 text-sm font-medium">
              Data invoice tidak ditemukan
            </p>
            <p className="text-xs mt-1">
              Coba ubah kata pencarian atau filter status
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-x-auto">
            <h2 className="text-lg font-semibold p-4 border-b">
              Daftar Invoice
            </h2>

            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500">
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

              <tbody>
                {filteredInvoices.map((inv) => (
                  <tr
                    key={inv.id}
                    onClick={() => setSelectedInvoice(inv)}
                    className="border-t hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="p-3 font-medium">{inv.id}</td>

                    <td className="p-3">{inv.date}</td>

                    <td className="p-3">
                      <p className="font-medium">{inv.customer}</p>
                      <p className="text-xs text-gray-400">{inv.email}</p>
                    </td>

                    <td className="p-3">{inv.service}</td>

                    <td className="p-3 font-semibold">
                      Rp {inv.amount.toLocaleString("id-ID")}
                    </td>

                    <td className="p-3">
                      <InvoiceStatusBadge status={inv.status} />
                    </td>

                    <td ref={actionRef} className="p-3 text-right relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenAction(openAction === inv.id ? null : inv.id);
                        }}
                        className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
                      >
                        <MoreHorizontal size={18} />
                      </button>

                      {/* ACTION DROPDOWN */}
                      {openAction === inv.id && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="absolute right-0 bottom-full mb-2 w-44 bg-white border rounded-xl shadow-lg z-20 overflow-hidden"
                        >
                          <button className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-50 cursor-pointer">
                            <Eye size={16} />
                            Lihat Detail
                          </button>

                          <button className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-50 cursor-pointer">
                            <Download size={16} />
                            Download PDF
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
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
    </div>
  );
}
