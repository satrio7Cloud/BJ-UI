import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Download,
  FileText,
  Mail,
  PhoneCall,
  RefreshCw,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

import { getPublicAppUrl } from "../../../../api/config";
import { syncInvoiceStatusApi, type InvoiceData } from "../../../../api/invoice";
import Button from "../../../../shared/components/Button";
import {
  createWhatsappLink,
  formatPaymentReceiptMessage,
} from "../../../../shared/utils/whatsapp";

interface Props {
  invoice: InvoiceData | null;
  onClose: () => void;
  onRefresh?: () => void;
}

export default function InvoiceDetailPanel({ invoice, onClose, onRefresh }: Props) {
  const [isSyncing, setIsSyncing] = useState(false);
  if (!invoice) return null;

  const mappedStatus: string =
    invoice.payment_status?.toLowerCase() === "paid" ? "lunas" : "menunggu";
  const isPending = mappedStatus === "menunggu";

  const receiptMessage = invoice
    ? formatPaymentReceiptMessage({
        customerName: invoice.customer_name || "",
        invoiceNumber: invoice.invoice_number,
        orderId: invoice.order_id,
        serviceName: invoice.service_name || "",
        plateNumber: invoice.vehicle_plate || "",
        totalCost: invoice.total_cost || 0,
        trackingUrl: `${getPublicAppUrl()}/pay/${invoice.order_id}`,
      })
    : "";

  const customerWaLink = invoice?.customer_phone
    ? createWhatsappLink(receiptMessage, invoice.customer_phone)
    : "";

  const handleSyncMidtrans = async () => {
    try {
      setIsSyncing(true);
      const res = await syncInvoiceStatusApi(invoice.order_id || invoice.invoice_id);
      if (res?.data?.payment_status?.toUpperCase() === "PAID") {
        toast.success("Status Pembayaran Terverifikasi: LUNAS!");
      } else {
        toast("Status di Midtrans masih menunggu pembayaran.", { icon: "⏳" });
      }
      if (onRefresh) onRefresh();
    } catch {
      toast.error("Gagal menyinkronkan status dengan Midtrans.");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <AnimatePresence>
      {invoice && (
        <>
          {/* BACKDROP */}
          <motion.div
            onClick={onClose}
            className="fixed inset-0 bg-black/30 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* PANEL */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full sm:w-105 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 z-50 shadow-xl flex flex-col transition-colors"
          >
            {/* HEADER */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-start transition-colors">
              <div>
                <h2 className="font-semibold text-lg">Detail Invoice</h2>
                <p className="text-sm text-slate-400 dark:text-slate-500 font-mono">
                  {invoice.invoice_number}
                </p>
              </div>

              <Button variant="ghost" size="icon" onClick={onClose}>
                <X size={20} />
              </Button>
            </div>

            {/* CONTENT */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 text-sm">
              {/* STATUS + AMOUNT */}
              <div className="flex justify-between items-center">
                <span
                  className={`px-3 py-1 rounded-full text-xs capitalize transition-colors
                ${mappedStatus === "menunggu" && "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 font-bold"}
                ${mappedStatus === "lunas" && "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-bold"}
                ${mappedStatus === "terlambat" && "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 font-bold"}
            `}
                >
                  {mappedStatus}
                </span>

                <p className="text-xl font-bold">
                  Rp {(invoice.total_cost || 0).toLocaleString("id-ID")}
                </p>
              </div>

              <hr className="border-slate-200 dark:border-slate-800" />

              {/* CUSTOMER */}
              <section className="space-y-3">
                <h3 className="font-semibold">Informasi Pelanggan</h3>

                <div className="flex gap-3">
                  <User
                    size={18}
                    className="text-slate-500 dark:text-slate-400 shrink-0"
                  />
                  <div>
                    <p className="text-slate-400 dark:text-slate-500 text-xs transition-colors">
                      Nama
                    </p>
                    <p className="font-medium">{invoice.customer_name || "-"}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Mail
                    size={18}
                    className="text-slate-500 dark:text-slate-400 shrink-0"
                  />
                  <div>
                    <p className="text-slate-400 dark:text-slate-500 text-xs transition-colors">
                      Email
                    </p>
                    <p className="font-medium">{invoice.customer_email || "-"}</p>
                  </div>
                </div>
              </section>

              <hr className="border-slate-200 dark:border-slate-800 transition-colors" />

              {/* SERVICE */}
              <section className="space-y-3">
                <h3 className="font-semibold">Detail Layanan</h3>

                <div className="flex gap-3">
                  <FileText
                    size={18}
                    className="text-slate-500 dark:text-slate-400 shrink-0"
                  />
                  <div>
                    <p className="text-slate-400 dark:text-slate-500 text-xs transition-colors">
                      Layanan
                    </p>
                    <p className="font-medium">{invoice.service_name || "-"}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Calendar
                    size={18}
                    className="text-slate-500 dark:text-slate-400 shrink-0"
                  />
                  <div>
                    <p className="text-slate-400 dark:text-slate-500 text-xs transition-colors">
                      Tanggal Invoice
                    </p>
                    <p>
                      {new Date(invoice.issue_date).toLocaleDateString(
                        "id-ID",
                        { day: "numeric", month: "short", year: "numeric" },
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Clock
                    size={18}
                    className="text-slate-500 dark:text-slate-400 shrink-0"
                  />
                  <div>
                    <p className="text-slate-400 dark:text-slate-500 text-xs transition-colors">
                      Jatuh Tempo
                    </p>
                    <p>
                      {new Date(invoice.due_date).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </section>
            </div>

            {/* FOOTER */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-3 transition-colors">
              {!isPending && customerWaLink && (
                <a
                  href={customerWaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <PhoneCall size={16} />
                  Kirim Konfirmasi Lunas ke WhatsApp Customer
                </a>
              )}

              {isPending && (
                <Button
                  variant="outline"
                  size="full"
                  isLoading={isSyncing}
                  onClick={handleSyncMidtrans}
                  className="flex items-center justify-center gap-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 font-bold"
                >
                  <RefreshCw size={16} className={isSyncing ? "animate-spin" : ""} />
                  Sinkronkan Status Midtrans
                </Button>
              )}

              <Button variant="outline" size="full">
                <Download size={16} />
                Download PDF
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
