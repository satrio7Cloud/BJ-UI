import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Bell, Check, FileText, Info, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  getUnreadNotifications,
  markNotificationAsRead,
  type NotificationItem,
} from "../../../../api/notification";
import NotificationActionModal from "./NotificationActionModal";

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onReadCountUpdate: (count: number) => void;
}

export default function NotificationDrawer({
  isOpen,
  onClose,
  onReadCountUpdate,
}: NotificationDrawerProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedNotification, setSelectedNotification] =
    useState<NotificationItem | null>(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const data = await getUnreadNotifications();
      setNotifications(data);
      onReadCountUpdate(data.length);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      toast.error("Gagal memuat notifikasi");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProcessNotification = async (notif: NotificationItem) => {
    try {
      await markNotificationAsRead(notif.id);
      setNotifications((prev) => prev.filter((n) => n.id !== notif.id));
      onReadCountUpdate(Math.max(0, notifications.length - 1));
      window.dispatchEvent(new Event("orderUpdated"));
    } catch (error) {
      console.error("Gagal menandai telah dibaca:", error);
    }

    setSelectedNotification(notif);
    setIsActionModalOpen(true);
    onClose(); // Smoothly close drawer to bring focus to the action modal
  };

  const handleDismissNotification = async (
    e: React.MouseEvent,
    notif: NotificationItem,
  ) => {
    e.stopPropagation();
    try {
      await markNotificationAsRead(notif.id);
      setNotifications((prev) => prev.filter((n) => n.id !== notif.id));
      onReadCountUpdate(Math.max(0, notifications.length - 1));
      toast.success("Notifikasi ditandai dibaca");
      window.dispatchEvent(new Event("orderUpdated"));
    } catch {
      toast.error("Gagal menandai telah dibaca");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await Promise.all(notifications.map((n) => markNotificationAsRead(n.id)));
      setNotifications([]);
      onReadCountUpdate(0);
      toast.success("Semua notifikasi ditandai dibaca");
      window.dispatchEvent(new Event("orderUpdated"));
    } catch {
      toast.error("Sebagian notifikasi gagal ditandai");
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-sm bg-white dark:bg-slate-900 shadow-2xl z-50 flex flex-col border-l border-slate-200 dark:border-slate-800"
            >
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-linear-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-800 rounded-xl text-white shadow-lg shadow-blue-500/30 dark:shadow-blue-900/20">
                    <Bell size={20} />
                  </div>
                  <h2 className="font-bold text-slate-900 dark:text-white text-lg">
                    Notifikasi
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  {notifications.length > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors px-2 py-1 cursor-pointer"
                    >
                      Tandai Semua Dibaca
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50 dark:bg-slate-950/50">
                {isLoading ? (
                  <div className="flex justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center p-8 h-full opacity-70">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 shadow-inner">
                      <Bell className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">
                      Hore! Tidak ada notifikasi baru
                    </p>
                    <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                      Anda sudah mengecek semuanya.
                    </p>
                  </div>
                ) : (
                  notifications.map((notif) => {
                    const type = notif.type.toLowerCase();

                    return (
                      <motion.div
                        key={notif.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        onClick={() => handleProcessNotification(notif)}
                        className="group relative p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 hover:border-blue-300 dark:hover:border-blue-700/60 transition-all duration-300 overflow-hidden cursor-pointer"
                      >
                        {/* Top Accent Gradient Line */}
                        <div
                          className={`absolute top-0 left-0 right-0 h-1 bg-linear-to-br ${
                            type === "warning"
                              ? "from-orange-400 to-orange-500"
                              : type === "danger"
                                ? "from-red-400 to-red-500"
                                : "from-blue-400 to-blue-500"
                          } opacity-80`}
                        />

                        <div className="flex items-start gap-4 relative z-10">
                          {/* Icon Container */}
                          <div
                            className={`shrink-0 mt-0.5 p-2.5 rounded-xl border ${
                              type === "warning"
                                ? "bg-orange-50 border-orange-100 text-orange-600 dark:bg-orange-500/10 dark:border-orange-500/20 dark:text-orange-400"
                                : type === "danger"
                                  ? "bg-red-50 border-red-100 text-red-600 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400"
                                  : "bg-blue-50 border-blue-100 text-blue-600 dark:bg-blue-500/10 dark:border-blue-500/20 dark:text-blue-400"
                            }`}
                          >
                            {type === "warning" ? (
                              <FileText size={18} />
                            ) : type === "danger" ? (
                              <AlertTriangle size={18} />
                            ) : (
                              <Info size={18} />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {notif.title}
                            </h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4 line-clamp-2">
                              {notif.message}
                            </p>

                            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                              <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 flex items-center gap-1.5 uppercase tracking-wider">
                                <div
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    type === "warning"
                                      ? "bg-orange-500"
                                      : type === "danger"
                                        ? "bg-red-500"
                                        : "bg-blue-500"
                                  } animate-pulse`}
                                />
                                {new Date(notif.created_at).toLocaleTimeString(
                                  "id-ID",
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  },
                                )}{" "}
                                &bull;{" "}
                                {new Date(notif.created_at).toLocaleDateString(
                                  "id-ID",
                                  {
                                    day: "numeric",
                                    month: "short",
                                  },
                                )}
                              </span>

                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={(e) =>
                                    handleDismissNotification(e, notif)
                                  }
                                  title="Tandai Sudah Dibaca"
                                  className="p-1.5 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-lg transition-colors cursor-pointer"
                                >
                                  <Check size={16} />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleProcessNotification(notif);
                                  }}
                                  className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 hover:bg-blue-600 hover:text-white dark:bg-blue-500/10 dark:hover:bg-blue-600 dark:hover:text-white transition-all duration-300 px-3 py-1.5 rounded-lg shadow-sm hover:shadow-blue-500/25 group/btn cursor-pointer"
                                >
                                  Proses Sekarang
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Smart Action Modal - Stays active even when drawer slides away */}
      <NotificationActionModal
        isOpen={isActionModalOpen}
        onClose={() => {
          setIsActionModalOpen(false);
          setSelectedNotification(null);
        }}
        notification={selectedNotification}
      />
    </>
  );
}
