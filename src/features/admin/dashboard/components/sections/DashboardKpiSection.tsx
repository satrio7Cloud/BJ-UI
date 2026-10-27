import { AlertTriangle, CheckCircle, Clock, TrendingUp } from "lucide-react";
import type { DashboardSummary } from "../../../../../api/dashboard";
import ModernStatCard from "../kpi/ModernStatCard";

interface DashboardKpiSectionProps {
    summary: DashboardSummary | null;
    isLoading: boolean;
    filterStatus: string | null;
    onFilterChange: (status: string | null) => void;
}

const StatSkeleton = () => (
    <div className="rounded-xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 animate-pulse bg-slate-50 dark:bg-slate-800/50 h-24" />
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
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {/* 1. Pendapatan Total */}
            <ModernStatCard
                title="Total Pendapatan"
                value={`Rp ${totalRevenue.toLocaleString("id-ID")}`}
                variant="info"
                icon={TrendingUp}
                breakdowns={[
                    {
                        label: "Biro Jasa",
                        value: `Rp ${(summary?.total_revenue ?? 0).toLocaleString("id-ID")}`,
                    },
                    {
                        label: "Cetak KTL",
                        value: `Rp ${(summary?.total_revenue_ktls ?? 0).toLocaleString("id-ID")}`,
                    },
                ]}
            />

            {/* 2. Menunggu Diproses */}
            <ModernStatCard
                title="Menunggu Diproses"
                value={totalPending}
                variant="warning"
                icon={Clock}
                breakdowns={[
                    {
                        label: "Order Jasa",
                        value: summary?.total_pending_orders ?? 0,
                    },
                    {
                        label: "Cetak KTL",
                        value: summary?.total_pending_ktls ?? 0,
                    },
                ]}
                onClick={() => handleCardClick("Pending")}
            />

            {/* 3. Selesai */}
            <ModernStatCard
                title="Order Selesai"
                value={totalCompleted}
                variant="success"
                icon={CheckCircle}
                breakdowns={[
                    {
                        label: "Order Jasa",
                        value: summary?.total_completed_orders ?? 0,
                    },
                    {
                        label: "Cetak KTL",
                        value: summary?.total_completed_ktls ?? 0,
                    },
                ]}
                onClick={() => handleCardClick("Completed")}
            />

            {/* 4. Butuh Perhatian Segera */}
            {summary && (
                <ModernStatCard
                    title="Butuh Perhatian Segera"
                    value={totalAttention}
                    variant="danger"
                    icon={AlertTriangle}
                    breakdowns={[
                        {
                            label: "Belum Verif",
                            value: summary.pending_actions?.unverified_documents || 0,
                            valueClass:
                                (summary.pending_actions?.unverified_documents || 0) > 0
                                    ? "text-red-500 font-bold"
                                    : "",
                        },
                        {
                            label: "Order Stuck",
                            value: summary.pending_actions?.stuck_orders || 0,
                            valueClass:
                                (summary.pending_actions?.stuck_orders || 0) > 0
                                    ? "text-red-500 font-bold"
                                    : "",
                        },
                        {
                            label: "KTL Stuck",
                            value: summary.pending_actions?.stuck_ktls || 0,
                            valueClass:
                                (summary.pending_actions?.stuck_ktls || 0) > 0
                                    ? "text-red-500 font-bold"
                                    : "",
                        },
                    ]}
                    onClick={() => handleCardClick("Attention")}
                />
            )}
        </div>
    );
}
