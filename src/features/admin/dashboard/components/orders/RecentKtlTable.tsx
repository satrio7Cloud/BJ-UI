import {
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  FileText,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { API_BASE_URL } from "../../../../../api/config";
import type { OrderKTLResponse } from "../../../../../api/order";
import { getOrderKTLByID, updateKtlStatus } from "../../../../../api/order";
import Button from "../../../../../shared/components/Button";
import Modal from "../../../../../shared/components/Modal";

interface Props {
  orders: OrderKTLResponse[];
  isLoading: boolean;
  onOrderUpdate?: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  Pending: {
    label: "Pending",
    className:
      "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400",
  },
  Processing: {
    label: "Diproses",
    className:
      "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
  },
  Completed: {
    label: "Selesai",
    className:
      "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
  },
  Cancelled: {
    label: "Dibatalkan",
    className: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
  },
};

export default function RecentKtlTable({
  orders,
  isLoading,
  onOrderUpdate,
  searchQuery,
  onSearchChange,
}: Props) {
  orders = orders || [];
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrderKTLResponse | null>(
    null,
  );
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFetchingDetail, setIsFetchingDetail] = useState(false);

  const handleViewDetail = async (orderId: string) => {
    try {
      setIsFetchingDetail(true);
      const res = await getOrderKTLByID(orderId);
      setSelectedOrder(res.data);
      setIsDetailOpen(true);
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "Gagal memuat detail KTL");
    } finally {
      setIsFetchingDetail(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      setIsUpdating(orderId);
      const notes = newStatus === "Processing" ? "Sedang di proses" : "Selesai";
      await updateKtlStatus(orderId, { status: newStatus, notes });
      toast.success("Status KTL berhasil diperbarui!");
      if (onOrderUpdate) onOrderUpdate();
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "Gagal memperbarui status KTL");
    } finally {
      setIsUpdating(null);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-transparent dark:border-slate-800 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Pesanan KTL Terkini
        </h2>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 dark:text-slate-500">
            {orders.length} KTL
          </span>
          {onOrderUpdate && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onOrderUpdate}
              disabled={isLoading}
              title="Refresh Data"
            >
              <RefreshCw
                size={16}
                className={isLoading ? "animate-spin" : ""}
              />
            </Button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-slate-700 dark:text-slate-300">
          <thead className="text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="text-left py-3 pr-4">Pelanggan</th>
              <th className="text-left py-3 pr-4">Kontak</th>
              <th className="text-left py-3 pr-4">Kendaraan</th>
              <th className="text-left py-3 pr-4">Wilayah</th>
              <th className="text-left py-3 pr-4">Biaya</th>
              <th className="text-left py-3 pr-4">Status</th>
              <th className="text-right py-3">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="py-12 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                  </div>
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center">
                  <div className="flex flex-col items-center gap-2 text-slate-400 dark:text-slate-500">
                    {searchQuery ? (
                      <>
                        <Search
                          size={32}
                          className="text-slate-300 dark:text-slate-600"
                        />
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                          Tidak ada pesanan KTL yang cocok dengan &quot;
                          {searchQuery}&quot;
                        </p>
                        {onSearchChange && (
                          <button
                            onClick={() => onSearchChange("")}
                            className="mt-1 text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold cursor-pointer"
                          >
                            Reset Pencarian
                          </button>
                        )}
                      </>
                    ) : (
                      <>
                        <AlertCircle size={32} />
                        <p className="text-sm">Belum ada pesanan KTL</p>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const date = new Date(order.order_date).toLocaleDateString(
                  "id-ID",
                  {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  },
                );
                const status = statusConfig[order.status] ?? {
                  label: order.status,
                  className: "bg-slate-100 text-slate-600",
                };

                return (
                  <tr
                    key={order.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="py-3.5 pr-4">
                      <p className="font-medium text-slate-900 dark:text-white">
                        {order.customer_name}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">
                        {date}
                      </p>
                    </td>
                    <td className="py-3.5 pr-4 font-mono text-xs">
                      {order.phone_number || "-"}
                    </td>
                    <td className="py-3.5 pr-4">
                      <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs font-medium">
                        {order.vehicle_type}
                      </span>
                    </td>
                    <td className="py-3.5 pr-4">{order.region}</td>
                    <td className="py-3.5 pr-4 font-medium text-slate-900 dark:text-white">
                      Rp {order.fee.toLocaleString("id-ID")}
                    </td>
                    <td className="py-3.5 pr-4">
                      <div className="flex flex-col gap-1 items-start">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${status.className}`}
                        >
                          {order.status === "Pending" && <Clock size={12} />}
                          {order.status === "Completed" && (
                            <CheckCircle size={12} />
                          )}
                          {status.label}
                        </span>
                        {order.status === "Processing" &&
                        Date.now() - new Date(order.order_date).getTime() >=
                          3 * 24 * 60 * 60 * 1000 ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300">
                            <Clock size={10} />
                            Stuck &ge; 3 Hari
                          </span>
                        ) : null}
                      </div>
                    </td>
                    <td className="py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {order.status === "Pending" && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() =>
                              handleUpdateStatus(order.id, "Processing")
                            }
                            disabled={isUpdating === order.id}
                          >
                            {isUpdating === order.id
                              ? "Memproses..."
                              : "Proses"}
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewDetail(order.id)}
                          disabled={isFetchingDetail}
                          title="Lihat Detail"
                        >
                          <Eye size={16} />
                        </Button>

                        {order.status === "Processing" && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() =>
                              handleUpdateStatus(order.id, "Completed")
                            }
                            disabled={isUpdating === order.id}
                          >
                            {isUpdating === order.id
                              ? "Memproses..."
                              : "Selesaikan"}
                          </Button>
                        )}
                        {order.status === "Completed" && (
                          <span className="text-xs text-slate-400 dark:text-slate-500 italic px-2">
                            Selesai
                          </span>
                        )}
                        {order.status === "Cancelled" && (
                          <span className="text-xs text-red-400 dark:text-red-500 italic px-2">
                            Dibatalkan
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <Modal open={isDetailOpen} onClose={() => setIsDetailOpen(false)}>
        {selectedOrder && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-125 overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
            {/* Header with gradient and subtle background */}
            <div className="relative px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight">
                      Detail Pesanan KTL
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                      {selectedOrder.id.split("-")[0].toUpperCase()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsDetailOpen(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Info Section */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
                  Informasi Pelanggan
                </h4>
                <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800/60">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                      Nama Lengkap
                    </p>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      {selectedOrder.customer_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                      No. WhatsApp
                    </p>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      {selectedOrder.phone_number}
                    </p>
                  </div>
                  <div className="col-span-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                      Wilayah / Samsat
                    </p>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      {selectedOrder.region}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Info Section */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
                  Rincian Layanan
                </h4>
                <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800/60">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                      Jenis Kendaraan
                    </p>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      {selectedOrder.vehicle_type}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                      Merchant Pembayaran
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">
                        {selectedOrder.merchant_ref}
                      </p>
                    </div>
                  </div>

                  <div className="col-span-2 pt-3 mt-1 border-t border-slate-200 dark:border-slate-700 flex justify-between items-end">
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1.5">
                        Status Pesanan
                      </p>
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full ${statusConfig[selectedOrder.status]?.className || "bg-slate-100 text-slate-600"}`}
                      >
                        {selectedOrder.status === "Pending" && (
                          <Clock size={14} />
                        )}
                        {selectedOrder.status === "Completed" && (
                          <CheckCircle size={14} />
                        )}
                        {statusConfig[selectedOrder.status]?.label ||
                          selectedOrder.status}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                        Total Biaya
                      </p>
                      <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                        Rp {selectedOrder.fee.toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Attachments Section */}
              {(selectedOrder.bukti_ktl_path ||
                selectedOrder.bukti_pembayaran_path) && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
                    Dokumen Lampiran
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedOrder.bukti_ktl_path && (
                      <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800/60 flex flex-col">
                        <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800/60 bg-white dark:bg-slate-800/60">
                          <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                            Bukti KTL
                          </p>
                        </div>
                        <div className="p-2 flex-1 flex items-center justify-center">
                          <a
                            href={`${API_BASE_URL.replace("/api/v1", "")}/${selectedOrder.bukti_ktl_path}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <img
                              src={`${API_BASE_URL.replace("/api/v1", "")}/${selectedOrder.bukti_ktl_path}`}
                              alt="Bukti KTL"
                              className="max-h-32 object-contain rounded-lg hover:opacity-80 transition-opacity"
                            />
                          </a>
                        </div>
                      </div>
                    )}
                    {selectedOrder.bukti_pembayaran_path && (
                      <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800/60 flex flex-col">
                        <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800/60 bg-white dark:bg-slate-800/60">
                          <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                            Bukti Pembayaran
                          </p>
                        </div>
                        <div className="p-2 flex-1 flex items-center justify-center">
                          <a
                            href={`${API_BASE_URL.replace("/api/v1", "")}/${selectedOrder.bukti_pembayaran_path}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <img
                              src={`${API_BASE_URL.replace("/api/v1", "")}/${selectedOrder.bukti_pembayaran_path}`}
                              alt="Bukti Pembayaran"
                              className="max-h-32 object-contain rounded-lg hover:opacity-80 transition-opacity"
                            />
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
