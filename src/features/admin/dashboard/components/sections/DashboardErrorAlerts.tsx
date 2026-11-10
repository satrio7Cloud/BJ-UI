import { AlertCircle, RefreshCw } from "lucide-react";
import type { DashboardErrorState } from "../../hooks/useDashboard";

interface DashboardErrorAlertsProps {
    errors: DashboardErrorState;
    onRetry?: () => void;
}

export default function DashboardErrorAlerts({
    errors,
    onRetry,
}: DashboardErrorAlertsProps) {
    const errorMessages = Object.values(errors).filter(Boolean) as string[];

    // Jika tidak ada error, tidak perlu menampilkan apapun
    if (errorMessages.length === 0) return null;

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-amber-900 dark:text-amber-200 transition-all text-xs sm:text-sm">
            <div className="flex items-center gap-2.5 min-w-0">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                <span className="truncate font-medium">
                    Beberapa data dashboard belum dapat disinkronkan dari server: {errorMessages[0]}
                </span>
            </div>

            {onRetry && (
                <button
                    type="button"
                    onClick={onRetry}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/60 dark:hover:bg-amber-900 font-bold text-xs shrink-0 cursor-pointer transition-colors self-end sm:self-auto"
                >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Muat Ulang</span>
                </button>
            )}
        </div>
    );
}
