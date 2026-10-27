import type { DashboardChartData, DashboardSummary } from "../../../../../api/dashboard";
import DoughnutChart from "../charts/DoughnutChart";
import LineChart from "../charts/LineChart";

interface DashboardChartsSectionProps {
    chartData: DashboardChartData[];
    summary: DashboardSummary | null;
    isLoadingChart: boolean;
    isLoadingSummary: boolean;
}

export default function DashboardChartsSection({
    chartData,
    summary,
    isLoadingChart,
    isLoadingSummary,
}: DashboardChartsSectionProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Line Chart */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
                <h2 className="font-semibold mb-4 text-slate-800 dark:text-white">
                    Pengajuan & Pendapatan Harian
                </h2>
                {isLoadingChart ? (
                    <div className="flex justify-center items-center h-75">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                    </div>
                ) : (
                    <LineChart data={chartData} />
                )}
            </div>

            {/* Doughnut Chart */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
                <h2 className="font-semibold mb-4 text-slate-800 dark:text-white">
                    Layanan Terpopuler
                </h2>
                {isLoadingSummary ? (
                    <div className="flex justify-center items-center h-75">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                    </div>
                ) : (
                    <DoughnutChart data={summary?.top_services} />
                )}
            </div>
        </div>
    );
}
