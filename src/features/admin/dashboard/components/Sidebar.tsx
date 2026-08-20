import { AnimatePresence, motion } from "framer-motion";
import { Bell, ChevronLeft, ChevronRight, Database, FileText, LayoutDashboard, LogOut, Settings, User } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getAdminProfile, logoutAdmin } from "../../../../api/auth";
import { getDashboardSummary } from "../../../../api/dashboard";

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const [profile, setProfile] = useState<{ email: string; role: string } | null>(null);
    const [pendingNotifs, setPendingNotifs] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getAdminProfile();
                if (res?.data) {
                    setProfile(res.data);
                }
            } catch (err) {
                console.error("Failed to load profile", err);
                localStorage.removeItem('adminToken');
                navigate('/admin', { replace: true });
                return;
            }

            try {
                const summary = await getDashboardSummary();
                if (summary?.pending_actions) {
                    const totalPending =
                        (summary.pending_actions.unverified_documents || 0) +
                        (summary.pending_actions.stuck_orders || 0);
                    setPendingNotifs(totalPending);
                }
            } catch (err) {
                console.error("Failed to fetch notifications", err);
            }
        };
        fetchData();
    }, [navigate]);

    const handleLogout = async () => {
        try {
            await logoutAdmin();
            localStorage.removeItem('adminToken');
            toast.success('Berhasil logout');
            navigate('/admin', { replace: true });
        } catch (error) {
            toast.error('Gagal logout');
        }
    };

    const navItems = [
        { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
        { name: "Data Master", path: "/vehicles", icon: Database },
        { name: "Invoices", path: "/invoice", icon: FileText },
        { name: "Settings", path: "/settings", icon: Settings },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-slate-900/40 z-20 md:hidden"
                    />
                )}
            </AnimatePresence>

            <motion.div
                initial={false}
                animate={{
                    width: isOpen ? 256 : 80,
                }}
                className={`fixed md:relative z-30 h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shadow-sm transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                {/* Toggle Button (Desktop only) */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="absolute -right-3 top-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full p-1 shadow-sm text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors hidden md:block z-40 cursor-pointer"
                >
                    {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>

                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-center md:justify-start h-20 shrink-0">
                    <div className="flex items-center space-x-3 overflow-hidden whitespace-nowrap">
                        <div className="w-8 h-8 shrink-0 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20">
                            <span className="text-white font-bold text-xl leading-none">B</span>
                        </div>
                        <motion.h2
                            animate={{ opacity: isOpen ? 1 : 0, width: isOpen ? "auto" : 0 }}
                            className="text-xl font-bold text-slate-800 dark:text-white"
                        >
                            Admin Panel
                        </motion.h2>
                    </div>
                </div>

                <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto overflow-x-hidden">
                    {navItems.map((item) => {
                        const isActive = location.pathname.startsWith(item.path);
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold shadow-sm shadow-blue-100 dark:shadow-none"
                                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200"
                                    } ${!isOpen ? "justify-center px-0" : ""}`}
                                title={!isOpen ? item.name : undefined}
                            >
                                <item.icon className={`w-6 h-6 shrink-0 ${isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500"}`} />
                                <motion.span
                                    animate={{ opacity: isOpen ? 1 : 0, width: isOpen ? "auto" : 0 }}
                                    className="whitespace-nowrap overflow-hidden"
                                >
                                    {item.name}
                                </motion.span>
                            </Link>
                        );
                    })}
                </div>

                <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-4 shrink-0">
                    <button
                        onClick={() => {
                            if (pendingNotifs > 0) {
                                toast(`Ada ${pendingNotifs} Peringatan: Dokumen belum diverifikasi / pesanan stuck!`, { icon: '⚠️' });
                            } else {
                                toast('Tidak ada notifikasi baru', { icon: '🔔' });
                            }
                        }}
                        className={`flex items-center space-x-3 px-4 py-3 w-full text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-colors font-medium ${!isOpen ? "justify-center px-0" : ""}`}
                        title={!isOpen ? "Notifikasi" : undefined}
                    >
                        <div className="relative shrink-0">
                            <Bell className="w-6 h-6" />
                            {/* Red dot indicator */}
                            {pendingNotifs > 0 && (
                                <span className="absolute top-0 right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                            )}
                        </div>
                        <motion.span
                            animate={{ opacity: isOpen ? 1 : 0, width: isOpen ? "auto" : 0 }}
                            className="whitespace-nowrap overflow-hidden"
                        >
                            Notifikasi {pendingNotifs > 0 && `(${pendingNotifs})`}
                        </motion.span>
                    </button>

                    <div className={`flex ${isOpen ? "flex-row items-center justify-between" : "flex-col items-center gap-4"}`}>
                        {profile ? (
                            <div className={`flex items-center gap-3 overflow-hidden ${!isOpen ? "justify-center" : ""}`} title={!isOpen ? profile.email : undefined}>
                                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 text-slate-500 dark:text-slate-400">
                                    <User size={20} />
                                </div>
                                <motion.div
                                    animate={{ opacity: isOpen ? 1 : 0, width: isOpen ? "auto" : 0 }}
                                    className="overflow-hidden whitespace-nowrap"
                                >
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate" title={profile.email}>{profile.email.split('@')[0]}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{profile.role}</p>
                                </motion.div>
                            </div>
                        ) : <div />}

                        <button
                            onClick={handleLogout}
                            className="p-2.5 text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 rounded-xl transition-colors shrink-0"
                            title="Logout"
                        >
                            <LogOut className="w-5 h-5 shrink-0" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </>
    );
}
