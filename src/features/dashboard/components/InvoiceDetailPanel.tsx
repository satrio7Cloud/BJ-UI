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

type Invoice = {
  id: string;
  date: string;
  customer: string;
  email: string;
  service: string;
  amount: number;
  status: string;
};

interface Props {
  invoice: Invoice | null;
  onClose: () => void;
}

export default function InvoiceDetailPanel({ invoice, onClose }: Props) {
  if (!invoice) return null;

  const isPending = invoice.status === "menunggu";

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
            className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-50 shadow-xl flex flex-col"
          >
            {/* HEADER */}
            <div className="p-4 border-b flex justify-between items-start">
              <div>
                <h2 className="font-semibold text-lg">Detail Invoice</h2>
                <p className="text-sm text-gray-400">{invoice.id}</p>
              </div>

              <button onClick={onClose}>
                <X size={20} />
              </button>
            </div>

            {/* CONTENT */}
            {/* CONTENT */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 text-sm">
              {/* STATUS + AMOUNT */}
              <div className="flex justify-between items-center">
                <span
                  className={`px-3 py-1 rounded-full text-xs capitalize
                ${invoice.status === "menunggu" && "Menunggu" && "bg-yellow-100 text-yellow-700"}
                ${invoice.status === "lunas" && "Lunas" && "bg-green-100 text-green-700"}
                ${invoice.status === "terlambat" && "Terlambat" && "bg-red-100 text-red-700"}
            `}
                >
                  {invoice.status}
                </span>

                <p className="text-xl font-bold">
                  Rp {invoice.amount.toLocaleString("id-ID")}
                </p>
              </div>

              <hr />

              {/* CUSTOMER */}
              <section className="space-y-3">
                <h3 className="font-semibold">Informasi Pelanggan</h3>

                <div className="flex gap-3">
                  <User size={18} />
                  <div>
                    <p className="text-gray-400 text-xs">Nama</p>
                    <p>{invoice.customer}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Mail size={18} />
                  <div>
                    <p className="text-gray-400 text-xs">Email</p>
                    <p>{invoice.email}</p>
                  </div>
                </div>
              </section>

              <hr />

              {/* SERVICE */}
              <section className="space-y-3">
                <h3 className="font-semibold">Detail Layanan</h3>

                <div className="flex gap-3">
                  <FileText size={18} />
                  <div>
                    <p className="text-gray-400 text-xs">Layanan</p>
                    <p>{invoice.service}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Calendar size={18} />
                  <div>
                    <p className="text-gray-400 text-xs">Tanggal Invoice</p>
                    <p>{invoice.date}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Clock size={18} />
                  <div>
                    <p className="text-gray-400 text-xs">Jatuh Tempo</p>
                    <p>15 Feb 2024</p>
                  </div>
                </div>
              </section>
            </div>

            {/* FOOTER */}
            <div className="p-4 border-t space-y-3">
              <button className="w-full border rounded-lg py-2 flex items-center justify-center gap-2">
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
