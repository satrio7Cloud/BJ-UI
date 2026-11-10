import { AlertTriangle, CheckCircle, Clock, TrendingUp } from "lucide-react";
import type { DashboardSummary } from "../../../../../api/dashboard";
import StatCard from "../kpi/StatCard";

interface DashboardKpiSectionProps {
    summary: DashboardSummary | null;
    isLoading: boolean;
    filterStatus: string | null;
    onFilterChange: (status: string | null) => void;
}

const StatSkeleton = () => (
    <div className="rounded-xl p-3 sm:p-4 lg:p-6 border border-slate-200 dark:border-slate-800 animate-pulse bg-slate-50 dark:bg-slate-800/50 h-24 sm:h-28" />
);

export default function DashboardKpiSection({
    summary,
    isLoading,
    filterStatus,
    onFilterChange,
}: DashboardKpiSectionProps) {
    const handleCardClick = (targetStatus: string) => {
        onFilterChange(filterStatus === targetStatus ? null : targetStatus);
        document.getElementById("recent-orders-section")?.scrollIntoView({ behavior: "smooth" });
    };

    if (isLoading) {
        return (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                <StatSkeleton />
                <StatSkeleton />
                <StatSkeleton />
                <StatSkeleton />
            </div>
        );
    }

    const totalRevenue = (summary?.total_revenue ?? 0) + (summary?.total_revenue_ktls ?? 0);
    const totalPending = (summary?.total_pending_orders ?? 0) + (summary?.total_pending_ktls ?? 0);
    const totalCompleted = (summary?.total_completed_orders ?? 0) + (summary?.total_completed_ktls ?? 0);
    const totalAttention =
        (summary?.pending_actions?.unverified_documents || 0) +
        (summary?.pending_actions?.stuck_orders || 0) +
        (summary?.pending_actions?.stuck_ktls || 0);

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {/* 1. Pendapatan Total */}
            <StatCard
                title="Total Pendapatan"
                value={`Rp ${totalRevenue.toLocaleString("id-ID")}`}
                description="Total dari semua transaksi"
                variant="info"
                icon={TrendingUp}
            />

            {/* 2. Menunggu Diproses */}
            <StatCard
                title="Menunggu Diproses"
                value={totalPending}
                description="Pesanan baru butuh proses"
                variant="warning"
                icon={Clock}
                onClick={() => handleCardClick("Pending")}
            />

            {/* 3. Selesai */}
            <StatCard
                title="Order Selesai"
                value={totalCompleted}
                description="Pesanan berhasil diselesaikan"
                variant="success"
                icon={CheckCircle}
                onClick={() => handleCardClick("Completed")}
            />

            {/* 4. Butuh Perhatian Segera */}
            <StatCard
                title="Butuh Perhatian Segera"
                value={totalAttention}
                description="Dokumen tertahan / belum verifikasi"
                variant="danger"
                icon={AlertTriangle}
                onClick={() => handleCardClick("Attention")}
            />
        </div>
    );
}
