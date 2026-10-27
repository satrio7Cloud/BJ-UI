import { AlertTriangle } from "lucide-react";
import type { DashboardErrorState } from "../../hooks/useDashboard";

interface DashboardErrorAlertsProps {
    errors: DashboardErrorState;
}

export default function DashboardErrorAlerts({ errors }: DashboardErrorAlertsProps) {
    const { summary, orders, ktlOrders, chart } = errors;
    const hasError = Boolean(summary || orders || ktlOrders || chart);

    if (!hasError) return null;

    return (
        <div className="space-y-3">
            {summary && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <AlertTriangle size={18} className="text-red-600 dark:text-red-400 shrink-0" />
                    <p className="text-sm text-red-700 dark:text-red-300">
                        Gagal memuat ringkasan KPI: {summary}
                    </p>
                </div>
            )}
            {orders && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <AlertTriangle size={18} className="text-red-600 dark:text-red-400 shrink-0" />
                    <p className="text-sm text-red-700 dark:text-red-300">
                        Gagal memuat daftar pesanan: {orders}
                    </p>
                </div>
            )}
            {ktlOrders && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <AlertTriangle size={18} className="text-red-600 dark:text-red-400 shrink-0" />
                    <p className="text-sm text-red-700 dark:text-red-300">
                        Gagal memuat daftar pesanan KTL: {ktlOrders}
                    </p>
                </div>
            )}
            {chart && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <AlertTriangle size={18} className="text-red-600 dark:text-red-400 shrink-0" />
                    <p className="text-sm text-red-700 dark:text-red-300">
                        Gagal memuat data grafik: {chart}
                    </p>
                </div>
            )}
        </div>
    );
}
