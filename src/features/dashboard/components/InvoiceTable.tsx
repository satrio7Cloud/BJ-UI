import InvoiceStatusBadge from "./InvoiceStatusBadge";
import Pagination from "../../../shared/components/Pagination";
import Button from "../../../shared/components/Button";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { invoices } from "../../../data/invoices";

const formatRupiah = (value: number) => "Rp " + value.toLocaleString("id-ID");
const ITEMS_PER_PAGE = 5;

export default function InvoiceTable() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(invoices.length / ITEMS_PER_PAGE);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Riwayat Invoice</h2>
        <Button
          onClick={() => navigate("/invoice")}
          className="px-4 py-2 border border-blue-500 text-blue-600 rounded-lg text-sm hover:bg-blue-50 cursor-pointer"
        >
          Lihat Semua
        </Button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-gray-500 border-b">
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

          <tbody className="divide-y">
            {invoices
              .slice(
                (currentPage - 1) * ITEMS_PER_PAGE,
                currentPage * ITEMS_PER_PAGE,
              )
              .map((inv, index) => (
                <tr key={inv.id} className="hover:bg-gray-50">
                  <td className="py-4 font-medium">
                    {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                  </td>
                  <td className="py-4 font-medium">{inv.id}</td>
                  <td>{inv.date}</td>
                  <td>{inv.service}</td>
                  <td className="font-semibold">{formatRupiah(inv.amount)}</td>
                  <td>
                    <InvoiceStatusBadge status={inv.status as any} />
                  </td>
                  <td className="text-right">
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={invoices.length}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
