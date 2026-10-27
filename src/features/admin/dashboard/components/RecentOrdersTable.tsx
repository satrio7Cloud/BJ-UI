import { AlertCircle, ChevronDown, ChevronUp, Clock, RefreshCw, Search, X, Zap } from 'lucide-react';
import { useState } from 'react';
import { type DashboardOrder } from '../../../../api/dashboard';
import Button from "../../../../shared/components/Button";
import OrderActivityLog from './OrderActivityLog';

interface Props {
    orders: DashboardOrder[];
    isLoading: boolean;
    onOrderUpdate?: () => void;
    meta?: {
        page: number;
        limit: number;
        total_records: number;
    };
    onPageChange?: (page: number) => void;
    searchQuery?: string;
    onSearchChange?: (query: string) => void;
}

const statusConfig: Record<string, { label: string; className: string }> = {
    Pending: { label: 'Pending', className: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' },
    Processing: { label: 'Diproses', className: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' },
    Ready: { label: 'Siap', className: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' },
    Completed: { label: 'Selesai', className: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400' },
    Cancelled: { label: 'Dibatalkan', className: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' },
};

export default function RecentOrdersTable({
    orders,
    isLoading,
    onOrderUpdate,
    meta,
    onPageChange,
    searchQuery,
    onSearchChange,
}: Props) {
    orders = orders || [];
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

    const totalPages = meta ? Math.ceil(meta.total_records / meta.limit) : 1;

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-transparent dark:border-slate-800 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2.5">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Pesanan Terkini</h2>
                    <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2.5 py-0.5 rounded-full font-medium">
                        {orders.length} pesanan
                    </span>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                    {onSearchChange && (
                        <div className="relative flex-1 sm:w-72">
                            <Search
                                size={15}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                            />
                            <input
                                type="text"
                                value={searchQuery || ""}
                                onChange={(e) => onSearchChange(e.target.value)}
                                placeholder="Cari nama, plat, order ID, no HP..."
                                className="w-full pl-9 pr-8 py-1.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => onSearchChange("")}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded cursor-pointer"
                                    title="Hapus pencarian"
                                >
                                    <X size={13} />
                                </button>
                            )}
                        </div>
                    )}

                    {onOrderUpdate && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onOrderUpdate}
                            disabled={isLoading}
                            title="Refresh Data"
                            className="shrink-0"
                        >
                            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
                        </Button>
                    )}
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-slate-700 dark:text-slate-300">
                    <thead className="text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                        <tr>
                            <th className="text-left py-3 pr-4">Pelanggan</th>
                            <th className="text-left py-3 pr-4">Layanan</th>
                            <th className="text-left py-3 pr-4">No. Plat</th>
                            <th className="text-left py-3 pr-4">Level</th>
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
                                                <Search size={32} className="text-slate-300 dark:text-slate-600" />
                                                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                                                    Tidak ada pesanan yang cocok dengan &quot;{searchQuery}&quot;
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
                                                <p className="text-sm">Belum ada pesanan</p>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            orders.map((order) => {
                                const date = new Date(order.order_date).toLocaleDateString('id-ID', {
                                    day: 'numeric', month: 'short', year: 'numeric',
                                });
                                const status = statusConfig[order.status] ?? { label: order.status, className: 'bg-slate-100 text-slate-600' };
                                const isExpress = order.service_level === 'EXPRESS';

                                return (
                                    <>
                                        <tr key={order.order_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="py-3.5 pr-4">
                                                <p className="font-medium text-slate-900 dark:text-white">{order.customer_name}</p>
                                                <p className="text-xs text-slate-400 dark:text-slate-500">{date}</p>
                                            </td>
                                            <td className="py-3.5 pr-4  max-w-40 truncate" title={order.service_name}>
                                                {order.service_name}
                                            </td>
                                            <td className="py-3.5 pr-4">
                                                <span className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                                                    {order.plate_number}
                                                </span>
                                            </td>
                                            <td className="py-3.5 pr-4">
                                                <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${isExpress ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                                                    {isExpress ? <Zap size={11} /> : <Clock size={11} />}
                                                    {order.service_level}
                                                </span>
                                            </td>
                                            <td className="py-3.5 pr-4 font-semibold text-slate-900 dark:text-white">
                                                Rp {(order.total_cost || 0).toLocaleString('id-ID')}
                                            </td>
                                            <td className="py-3.5 pr-4">
                                                <div className="flex flex-col gap-1 items-start">
                                                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${status.className}`}>
                                                        {status.label}
                                                    </span>
                                                    {order.unverified_docs && order.unverified_docs > 0 ? (
                                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300">
                                                            <AlertCircle size={10} />
                                                            {order.unverified_docs} Dokumen Belum Verif
                                                        </span>
                                                    ) : null}
                                                    {order.status === 'Processing' && (Date.now() - new Date(order.order_date).getTime()) >= 3 * 24 * 60 * 60 * 1000 ? (
                                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300">
                                                            <Clock size={10} />
                                                            Stuck &ge; 3 Hari
                                                        </span>
                                                    ) : null}
                                                </div>
                                            </td>
                                            <td className="py-3.5 text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => setExpandedOrderId(expandedOrderId === order.order_id ? null : order.order_id)}
                                                    className={expandedOrderId === order.order_id
                                                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                                                        : ''}
                                                    title="Update Status"
                                                >
                                                    {expandedOrderId === order.order_id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                </Button>
                                            </td>
                                        </tr>
                                        {expandedOrderId === order.order_id && (
                                            <tr className="bg-slate-50/50 dark:bg-slate-800/20">
                                                <td colSpan={7} className="p-4 border-t border-slate-100 dark:border-slate-800">
                                                    <OrderActivityLog orderId={order.order_id} onStatusChange={onOrderUpdate} />
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {meta && onPageChange && totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 px-2">
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                        Menampilkan {((meta.page - 1) * meta.limit) + 1} - {Math.min(meta.page * meta.limit, meta.total_records)} dari {meta.total_records} pesanan
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onPageChange(meta.page - 1)}
                            disabled={meta.page <= 1 || isLoading}
                        >
                            Sebelumnya
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onPageChange(meta.page + 1)}
                            disabled={meta.page >= totalPages || isLoading}
                        >
                            Selanjutnya
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
