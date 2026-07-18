import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  Download,
  User,
  Mail,
  FileText,
  Calendar,
  Clock,
} from "lucide-react";

import { type InvoiceData } from "../../../api/invoice";

interface Props {
  invoice: InvoiceData | null;
  onClose: () => void;
}

export default function InvoiceDetailPanel({ invoice, onClose }: Props) {
  if (!invoice) return null;

  const mappedStatus: string = invoice.payment_status?.toLowerCase() === "paid" ? "lunas" : "menunggu";
  const isPending = mappedStatus === "menunggu";

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
            className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 z-50 shadow-xl flex flex-col transition-colors"
          >
            {/* HEADER */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-start transition-colors">
              <div>
                <h2 className="font-semibold text-lg">Detail Invoice</h2>
                <p className="text-sm text-slate-400 dark:text-slate-500">{invoice.invoice_number}</p>
              </div>

              <button onClick={onClose} className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* CONTENT */}
            {/* CONTENT */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 text-sm">
              {/* STATUS + AMOUNT */}
              <div className="flex justify-between items-center">
                <span
                  className={`px-3 py-1 rounded-full text-xs capitalize transition-colors
                ${mappedStatus === "menunggu" && "Menunggu" && "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"}
                ${mappedStatus === "lunas" && "Lunas" && "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"}
                ${mappedStatus === "terlambat" && "Terlambat" && "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"}
            `}
                >
                  {mappedStatus}
                </span>

                <p className="text-xl font-bold">
                  Rp {(invoice.total_cost || 0).toLocaleString("id-ID")}
                </p>
              </div>

              <hr />

              {/* CUSTOMER */}
              <section className="space-y-3">
                <h3 className="font-semibold">Informasi Pelanggan</h3>

                <div className="flex gap-3">
                  <User size={18} className="text-slate-500 dark:text-slate-400" />
                  <div>
                    <p className="text-slate-400 dark:text-slate-500 text-xs transition-colors">Nama</p>
                    <p>{invoice.customer_name || "-"}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Mail size={18} className="text-slate-500 dark:text-slate-400" />
                  <div>
                    <p className="text-slate-400 dark:text-slate-500 text-xs transition-colors">Email</p>
                    <p>{invoice.customer_email || "-"}</p>
                  </div>
                </div>
              </section>

              <hr className="border-slate-200 dark:border-slate-800 transition-colors" />

              {/* SERVICE */}
              <section className="space-y-3">
                <h3 className="font-semibold">Detail Layanan</h3>

                <div className="flex gap-3">
                  <FileText size={18} className="text-slate-500 dark:text-slate-400" />
                  <div>
                    <p className="text-slate-400 dark:text-slate-500 text-xs transition-colors">Layanan</p>
                    <p>{invoice.service_name || "-"}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Calendar size={18} className="text-slate-500 dark:text-slate-400" />
                  <div>
                    <p className="text-slate-400 dark:text-slate-500 text-xs transition-colors">Tanggal Invoice</p>
                    <p>{new Date(invoice.issue_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Clock size={18} className="text-slate-500 dark:text-slate-400" />
                  <div>
                    <p className="text-slate-400 dark:text-slate-500 text-xs transition-colors">Jatuh Tempo</p>
                    <p>{new Date(invoice.due_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                </div>
              </section>
            </div>

            {/* FOOTER */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-3 transition-colors">
              <button className="w-full border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg py-2 flex items-center justify-center gap-2 transition-colors">
                <Download size={16} />
                Download PDF
              </button>

              {isPending && (
                <button className="w-full bg-blue-600 text-white rounded-lg py-2">
                  Bayar Sekarang
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
