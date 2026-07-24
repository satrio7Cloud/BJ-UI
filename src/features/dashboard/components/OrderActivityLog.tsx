import { AlertCircle, CheckCircle2, Clock, ExternalLink, Image as ImageIcon, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getOrderActivity, getOrderDocuments, updateOrderStatus, type OrderActivity, type OrderDocument } from "../../../api/order";

interface Props {
  orderId: string;
  onStatusChange?: () => void;
}

export default function OrderActivityLog({ orderId, onStatusChange }: Props) {
  const [activity, setActivity] = useState<OrderActivity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [status, setStatus] = useState("Pending");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [documents, setDocuments] = useState<OrderDocument[]>([]);
  const [isDocLoading, setIsDocLoading] = useState(false);

  const fetchActivity = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await getOrderActivity(orderId);
      if (res?.data) {
        setActivity(res.data);
        setStatus(res.data.status || "Pending");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Gagal memuat log aktivitas");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchActivity();
      
      setIsDocLoading(true);
      getOrderDocuments(orderId)
        .then(docs => {
          setDocuments(docs || []);
        })
        .catch(err => console.error("Failed to fetch documents", err))
        .finally(() => setIsDocLoading(false));
    }
  }, [orderId]);

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!status) return toast.error("Status harus dipilih!");
    
    try {
      setIsUpdating(true);
      await updateOrderStatus(orderId, { status, notes });
      toast.success("Status pesanan berhasil diperbarui!");
      setNotes("");
      fetchActivity(); // Refresh log
      if (onStatusChange) onStatusChange(); // Notify parent table to refresh
    } catch (err: any) {
      toast.error(err.message || "Gagal memperbarui status");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <RefreshCw className="animate-spin text-blue-500" />
      </div>
    );
  }

  if (error || !activity) {
    return (
      <div className="p-6 text-center text-red-500 bg-red-50 dark:bg-red-900/20 rounded-xl">
        <AlertCircle className="mx-auto mb-2" />
        <p>{error || "Data aktivitas tidak ditemukan"}</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Detail & Log Aktivitas Pesanan</h3>

      {/* CUSTOMER DOCUMENTS */}
      <div className="mb-8">
        <h4 className="font-semibold text-slate-800 dark:text-white mb-3">Dokumen Pelanggan</h4>
        {isDocLoading ? (
          <p className="text-xs text-slate-400 flex items-center gap-2"><RefreshCw className="w-3 h-3 animate-spin" /> Memuat dokumen...</p>
        ) : documents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map((doc) => (
              <div key={doc.id} className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden relative group bg-slate-50 dark:bg-slate-900/50">
                <div className="flex justify-between items-center px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">{doc.document_type}</span>
                  {doc.is_verified ? (
                    <span className="flex items-center gap-1 text-[10px] text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full"><CheckCircle2 className="w-3 h-3" /> Verified</span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-0.5 rounded-full"><Clock className="w-3 h-3" /> Pending</span>
                  )}
                </div>
                {doc.url ? (
                  <div className="relative">
                    <img src={doc.url} alt={doc.document_type} className="w-full h-32 object-cover" />
                    <a 
                      href={doc.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-medium gap-2"
                    >
                      <ExternalLink size={16} /> Lihat
                    </a>
                  </div>
                ) : (
                  <div className="h-32 flex items-center justify-center text-slate-400 bg-slate-100 dark:bg-slate-800">
                    <span className="text-xs">URL tidak tersedia</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-2 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 text-slate-400 max-w-sm">
            <ImageIcon size={20} />
            <span className="text-xs">Tidak ada dokumen terlampir</span>
          </div>
        )}
      </div>

      <hr className="border-slate-200 dark:border-slate-800 mb-8" />

      {/* Form Update Status */}
      <form onSubmit={handleUpdateStatus} className="mb-8 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-4 border border-slate-100 dark:border-slate-700">
        <h4 className="font-semibold text-slate-800 dark:text-white">Perbarui Status</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            >
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Ready">Ready</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Catatan (Opsional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Tambahkan catatan..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={isUpdating}
          className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
        >
          {isUpdating ? <RefreshCw className="animate-spin w-4 h-4" /> : "Perbarui"}
        </button>
      </form>

      {/* Activity Timeline */}
      <div className="relative border-l-2 border-slate-200 dark:border-slate-700 ml-3 space-y-6">
        {activity.history && activity.history.length > 0 ? (
          activity.history.map((hist, idx) => (
            <div key={idx} className="relative pl-6">
              {/* Timeline Dot */}
              <div className={`absolute -left-2.25 top-1.5 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center ${
                idx === 0 ? "bg-blue-500" : "bg-slate-400"
              }`} />
              
              <div className="mb-1">
                <span className={`font-bold text-sm ${idx === 0 ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400"}`}>
                  {hist.status}
                </span>
                <span className="text-xs text-slate-400 ml-3">
                  {new Date(hist.created_at).toLocaleString("id-ID", {
                    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
                  })}
                </span>
              </div>
              
              {hist.notes && (
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {hist.notes}
                </p>
              )}
            </div>
          ))
        ) : (
          <p className="pl-6 text-sm text-slate-500">Belum ada aktivitas tercatat.</p>
        )}
      </div>
    </div>
  );
}
