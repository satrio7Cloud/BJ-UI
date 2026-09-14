import { AlertCircle, Clock, RefreshCw, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import type { OrderKTLResponse } from '../../../../api/order';
import { updateKtlStatus } from '../../../../api/order';
import Button from "../../../../shared/components/Button";
import toast from 'react-hot-toast';

interface Props {
    orders: OrderKTLResponse[];
    isLoading: boolean;
    onOrderUpdate?: () => void;
}

const statusConfig: Record<string, { label: string; className: string }> = {
    Pending: { label: 'Pending', className: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' },
    Processing: { label: 'Diproses', className: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' },
    Completed: { label: 'Selesai', className: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' },
    Cancelled: { label: 'Dibatalkan', className: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' },
};

export default function RecentKtlTable({ orders, isLoading, onOrderUpdate }: Props) {
    orders = orders || [];
    const [isUpdating, setIsUpdating] = useState<string | null>(null);

    const handleUpdateStatus = async (orderId: string, newStatus: string) => {
        try {
            setIsUpdating(orderId);
            const notes = newStatus === 'Processing' ? 'Sedang di proses' : 'Selesai';
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
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Pesanan KTL Terkini</h2>
                <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 dark:text-slate-500">{orders.length} KTL</span>
                    {onOrderUpdate && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onOrderUpdate}
                            disabled={isLoading}
                            title="Refresh Data"
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
                                        <AlertCircle size={32} />
                                        <p className="text-sm">Belum ada pesanan KTL</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            orders.map((order) => {
                                const date = new Date(order.order_date).toLocaleDateString('id-ID', {
                                    day: 'numeric', month: 'short', year: 'numeric',
                                });
                                const status = statusConfig[order.status] ?? { label: order.status, className: 'bg-slate-100 text-slate-600' };

                                return (
                                    <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="py-3.5 pr-4">
                                            <p className="font-medium text-slate-900 dark:text-white">{order.customer_name}</p>
                                            <p className="text-xs text-slate-400 dark:text-slate-500">{date}</p>
                                        </td>
                                        <td className="py-3.5 pr-4 font-mono text-xs">
                                            {order.phone_number || '-'}
                                        </td>
                                        <td className="py-3.5 pr-4">
                                            <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs font-medium">
                                                {order.vehicle_type}
                                            </span>
                                        </td>
                                        <td className="py-3.5 pr-4">
                                            {order.region}
                                        </td>
                                        <td className="py-3.5 pr-4 font-medium text-slate-900 dark:text-white">
                                            Rp {order.fee.toLocaleString('id-ID')}
                                        </td>
                                        <td className="py-3.5 pr-4">
                                            <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${status.className}`}>
                                                {order.status === 'Pending' && <Clock size={12} />}
                                                {order.status === 'Completed' && <CheckCircle size={12} />}
                                                {status.label}
                                            </span>
                                        </td>
                                        <td className="py-3.5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {order.status === 'Pending' && (
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        onClick={() => handleUpdateStatus(order.id, 'Processing')}
                                                        disabled={isUpdating === order.id}
                                                    >
                                                        {isUpdating === order.id ? 'Memproses...' : 'Proses'}
                                                    </Button>
                                                )}
                                                {order.status === 'Processing' && (
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        onClick={() => handleUpdateStatus(order.id, 'Completed')}
                                                        disabled={isUpdating === order.id}
                                                    >
                                                        {isUpdating === order.id ? 'Memproses...' : 'Selesaikan'}
                                                    </Button>
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
        </div>
    );
}
