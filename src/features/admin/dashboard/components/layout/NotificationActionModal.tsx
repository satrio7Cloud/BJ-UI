import {
  AlertCircle,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  Info,
  Package,
  Phone,
  RefreshCw,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { API_BASE_URL } from "../../../../../api/config";
import type { NotificationItem } from "../../../../../api/notification";
import {
  getOrderKTLByID,
  updateKtlStatus,
  type OrderKTLResponse,
} from "../../../../../api/order";
import Button from "../../../../../shared/components/Button";
import Modal from "../../../../../shared/components/Modal";
import OrderActivityLog from "../orders/OrderActivityLog";

interface NotificationActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  notification: NotificationItem | null;
  onOrderUpdate?: () => void;
}

export default function NotificationActionModal({
  isOpen,
  onClose,
  notification,
  onOrderUpdate,
}: NotificationActionModalProps) {
  const [ktlData, setKtlData] = useState<OrderKTLResponse | null>(null);
  const [isLoadingKtl, setIsLoadingKtl] = useState(false);
  const [isUpdatingKtl, setIsUpdatingKtl] = useState(false);
  const [errorKtl, setErrorKtl] = useState<string | null>(null);

  // Identify if the notification pertains to KTL, Regular Order, or Generic
  const isKtl =
    notification?.title.toLowerCase().includes("ktl") ||
    notification?.message.toLowerCase().includes("ktl");

  const referenceId = notification?.reference_id;
  const isRegular = !isKtl && !!referenceId;

  useEffect(() => {
    if (isOpen && isKtl && referenceId) {
      fetchKtlDetail(referenceId);
    } else {
      setKtlData(null);
      setErrorKtl(null);
    }
  }, [isOpen, isKtl, referenceId]);

  const fetchKtlDetail = async (id: string) => {
    try {
      setIsLoadingKtl(true);
      setErrorKtl(null);
      const res = await getOrderKTLByID(id);
      if (res?.data) {
        setKtlData(res.data);
      } else {
        setErrorKtl("Data pesanan KTL tidak ditemukan");
      }
    } catch (err: unknown) {
      const error = err as Error;
      setErrorKtl(error.message || "Gagal memuat detail pesanan KTL");
    } finally {
      setIsLoadingKtl(false);
    }
  };

  const handleUpdateKtl = async (newStatus: "Processing" | "Completed") => {
    if (!referenceId) return;
    try {
      setIsUpdatingKtl(true);
      const notes =
        newStatus === "Processing" ? "Diproses oleh admin" : "Selesai diproses";
      await updateKtlStatus(referenceId, { status: newStatus, notes });
      toast.success(
        newStatus === "Processing"
          ? "Status KTL diubah menjadi Diproses!"
          : "Pesanan KTL berhasil diselesaikan!",
      );
      // Refresh local KTL data
      await fetchKtlDetail(referenceId);

      // Dispatch global event for dashboard & table updates
      window.dispatchEvent(new Event("orderUpdated"));
      if (onOrderUpdate) onOrderUpdate();
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "Gagal memperbarui status KTL");
    } finally {
      setIsUpdatingKtl(false);
    }
  };

  const handleRegularOrderChange = () => {
    window.dispatchEvent(new Event("orderUpdated"));
    if (onOrderUpdate) onOrderUpdate();
  };

  const formatWaNumber = (phone?: string) => {
    if (!phone) return "";
    let clean = phone.replace(/[^0-9]/g, "");
    if (clean.startsWith("0")) clean = "62" + clean.slice(1);
    return clean;
  };

  if (!notification) return null;

  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl max-h-[88vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-900 dark:text-white">
        {/* Modal Header */}
        <div className="px-6 py-4.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-xl text-white shadow-md ${
                isKtl
                  ? "bg-linear-to-br from-indigo-500 to-indigo-700 shadow-indigo-500/20"
                  : isRegular
                    ? "bg-linear-to-br from-blue-500 to-blue-700 shadow-blue-500/20"
                    : "bg-linear-to-br from-amber-500 to-amber-700 shadow-amber-500/20"
              }`}
            >
              {isKtl ? (
                <FileText size={20} />
              ) : isRegular ? (
                <Package size={20} />
              ) : (
                <Info size={20} />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg">
                  {isKtl
                    ? "Tindak Lanjuti Pesanan KTL"
                    : isRegular
                      ? "Tindak Lanjuti Pesanan Reguler"
                      : "Pemberitahuan Notifikasi"}
                </h3>
                {referenceId && (
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    #{referenceId.slice(0, 8)}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                {notification.title} &bull; {notification.message}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            title="Tutup Modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          {/* CASE 1: KTL ORDER */}
          {isKtl && (
            <div>
              {isLoadingKtl ? (
                <div className="flex flex-col items-center justify-center p-12 space-y-3">
                  <RefreshCw className="w-8 h-8 animate-spin text-indigo-500" />
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Memuat data pesanan KTL...
                  </p>
                </div>
              ) : errorKtl || !ktlData ? (
                <div className="p-6 text-center text-red-500 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                  <AlertCircle className="mx-auto mb-2 w-8 h-8" />
                  <p className="font-medium">
                    {errorKtl || "Data KTL tidak dapat ditemukan"}
                  </p>
                  {referenceId && (
                    <button
                      onClick={() => fetchKtlDetail(referenceId)}
                      className="mt-3 px-3 py-1.5 text-xs bg-red-100 hover:bg-red-200 dark:bg-red-900/40 text-red-700 dark:text-red-300 rounded-lg transition-colors"
                    >
                      Coba Lagi
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Customer Info Card */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
                      Informasi Pemohon KTL
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800/60">
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                          Nama Lengkap
                        </p>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">
                          {ktlData.customer_name}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                          Kontak WhatsApp
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold font-mono text-slate-900 dark:text-slate-100 text-sm">
                            {ktlData.phone_number || "-"}
                          </span>
                          {ktlData.phone_number && (
                            <a
                              href={`https://wa.me/${formatWaNumber(
                                ktlData.phone_number,
                              )}?text=${encodeURIComponent(
                                `Halo ${ktlData.customer_name}, perihal pesanan KTL (${ktlData.vehicle_type} - ${ktlData.region}) di DTerazz Biro Jasa...`,
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md hover:bg-emerald-100 transition-colors"
                              title="Buka Chat WhatsApp"
                            >
                              <Phone size={11} /> WA
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="col-span-1 sm:col-span-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                          Wilayah / Samsat Tujuan
                        </p>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">
                          {ktlData.region}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Service Details Card */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
                      Rincian Layanan & Pembayaran
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800/60">
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                          Jenis Kendaraan
                        </p>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">
                          {ktlData.vehicle_type}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                          Referensi Merchant
                        </p>
                        <p className="font-semibold text-slate-900 dark:text-slate-100 font-mono text-xs">
                          {ktlData.merchant_ref || "-"}
                        </p>
                      </div>

                      <div className="col-span-1 sm:col-span-2 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                        <div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                            Status Saat Ini
                          </p>
                          <span
                            className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${
                              ktlData.status === "Pending"
                                ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                : ktlData.status === "Processing"
                                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                  : ktlData.status === "Completed"
                                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                    : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {ktlData.status === "Pending" && (
                              <Clock size={13} />
                            )}
                            {ktlData.status === "Completed" && (
                              <CheckCircle2 size={13} />
                            )}
                            {ktlData.status}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                            Total Biaya
                          </p>
                          <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                            Rp {ktlData.fee?.toLocaleString("id-ID")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Document Attachments */}
                  {(ktlData.bukti_ktl_path ||
                    ktlData.bukti_pembayaran_path) && (
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
                        Lampiran Dokumen
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {ktlData.bukti_ktl_path && (
                          <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800/60 flex flex-col">
                            <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800/60 bg-white dark:bg-slate-800/60 flex items-center justify-between">
                              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Bukti KTL
                              </p>
                              <a
                                href={`${API_BASE_URL.replace(
                                  "/api/v1",
                                  "",
                                )}/${ktlData.bukti_ktl_path}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[11px] text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline"
                              >
                                <ExternalLink size={11} /> Buka Penuh
                              </a>
                            </div>
                            <div className="p-3 flex items-center justify-center bg-slate-100 dark:bg-slate-900/60">
                              <img
                                src={`${API_BASE_URL.replace(
                                  "/api/v1",
                                  "",
                                )}/${ktlData.bukti_ktl_path}`}
                                alt="Bukti KTL"
                                className="max-h-36 object-contain rounded-lg shadow-sm"
                              />
                            </div>
                          </div>
                        )}

                        {ktlData.bukti_pembayaran_path && (
                          <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800/60 flex flex-col">
                            <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800/60 bg-white dark:bg-slate-800/60 flex items-center justify-between">
                              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Bukti Pembayaran
                              </p>
                              <a
                                href={`${API_BASE_URL.replace(
                                  "/api/v1",
                                  "",
                                )}/${ktlData.bukti_pembayaran_path}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[11px] text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline"
                              >
                                <ExternalLink size={11} /> Buka Penuh
                              </a>
                            </div>
                            <div className="p-3 flex items-center justify-center bg-slate-100 dark:bg-slate-900/60">
                              <img
                                src={`${API_BASE_URL.replace(
                                  "/api/v1",
                                  "",
                                )}/${ktlData.bukti_pembayaran_path}`}
                                alt="Bukti Pembayaran"
                                className="max-h-36 object-contain rounded-lg shadow-sm"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Quick Status Action Controls */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs text-slate-400">
                      Status saat ini:{" "}
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        {ktlData.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {ktlData.status === "Pending" && (
                        <Button
                          variant="primary"
                          size="sm"
                          isLoading={isUpdatingKtl}
                          onClick={() => handleUpdateKtl("Processing")}
                        >
                          Mulai Proses KTL
                        </Button>
                      )}
                      {ktlData.status === "Processing" && (
                        <Button
                          variant="primary"
                          size="sm"
                          isLoading={isUpdatingKtl}
                          onClick={() => handleUpdateKtl("Completed")}
                        >
                          <CheckCircle2 size={16} /> Selesaikan Pesanan KTL
                        </Button>
                      )}
                      {ktlData.status === "Completed" && (
                        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-lg">
                          <CheckCircle2 size={14} /> Pesanan KTL Telah Selesai
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* CASE 2: REGULAR ORDER */}
          {isRegular && referenceId && (
            <div>
              <OrderActivityLog
                orderId={referenceId}
                onStatusChange={handleRegularOrderChange}
              />
            </div>
          )}

          {/* CASE 3: GENERIC / NO REFERENCE ID */}
          {!isKtl && !isRegular && (
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  <Info size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1">
                    {notification.title}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {notification.message}
                  </p>
                  <span className="inline-block mt-3 text-xs text-slate-400">
                    Diterima pada:{" "}
                    {new Date(notification.created_at).toLocaleString("id-ID", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex justify-end">
                <Button variant="secondary" size="sm" onClick={onClose}>
                  Tutup
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
