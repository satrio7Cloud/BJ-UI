import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { PieChart as PieChartIcon } from "lucide-react";

interface TopService {
    service_name: string;
    order_count: number;
}

interface Props {
    data?: TopService[];
}

const COLORS = [
    "#3b82f6", // Blue
    "#10b981", // Emerald
    "#f59e0b", // Amber
    "#8b5cf6", // Purple
    "#94a3b8", // Slate (untuk Layanan Lainnya)
];

export default function DoughnutChart({ data }: Props) {
    if (!data || data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[300px] text-slate-400 dark:text-slate-500">
                <PieChartIcon size={36} className="mb-2 opacity-50" />
                <p className="text-sm font-medium">Tidak ada data layanan terpopuler</p>
            </div>
        );
    }

    // Urutkan dari pesanan tertinggi
    const sortedData = [...data].sort((a, b) => (b.order_count || 0) - (a.order_count || 0));
    const totalOrders = sortedData.reduce((sum, item) => sum + (item.order_count || 0), 0);

    // Ambil Top 4, jika lebih gabungkan sisanya ke "Lainnya" agar tampilan selalu pas
    let formattedData: { name: string; value: number }[] = [];
    if (sortedData.length <= 5) {
        formattedData = sortedData.map((s) => ({
            name: s.service_name || "Layanan",
            value: s.order_count || 0,
        }));
    } else {
        const top4 = sortedData.slice(0, 4);
        const othersCount = sortedData.slice(4).reduce((sum, s) => sum + (s.order_count || 0), 0);
        formattedData = top4.map((s) => ({
            name: s.service_name || "Layanan",
            value: s.order_count || 0,
        }));
        if (othersCount > 0) {
            formattedData.push({
                name: "Layanan Lainnya",
                value: othersCount,
            });
        }
    }

    const chartData = formattedData.map((item, index) => {
        const percentage = totalOrders > 0 ? Math.round((item.value / totalOrders) * 100) : 0;
        return {
            name: item.name,
            value: item.value,
            percentage,
            color: COLORS[index % COLORS.length],
        };
    });

    const renderCustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const item = payload[0].payload;
            return (
                <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 text-xs max-w-xs z-50">
                    <div className="flex items-center gap-2 mb-1.5">
                        <span
                            className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
                            style={{ backgroundColor: item.color }}
                        />
                        <p className="font-bold text-slate-800 dark:text-white leading-tight break-words">
                            {item.name}
                        </p>
                    </div>
                    <div className="flex items-center justify-between gap-4 text-slate-600 dark:text-slate-300 font-medium pt-1 border-t border-slate-100 dark:border-slate-700/60">
                        <span>Jumlah Pesanan:</span>
                        <span className="font-extrabold text-blue-600 dark:text-blue-400">
                            {item.value} ({item.percentage}%)
                        </span>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 h-[300px] px-1">
            {/* Visual Doughnut Chart (Kiri) */}
            <div className="relative w-[170px] h-[170px] shrink-0 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={52}
                            outerRadius={78}
                            paddingAngle={3}
                            dataKey="value"
                            stroke="none"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip content={renderCustomTooltip} />
                    </PieChart>
                </ResponsiveContainer>

                {/* Counter di Tengah Donat */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                        Total
                    </span>
                    <span className="text-xl font-black text-slate-800 dark:text-white leading-tight">
                        {totalOrders}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
                        Pesanan
                    </span>
                </div>
            </div>

            {/* List Keterangan Berdampingan Rapi & Simetris (Kanan) */}
            <div className="flex-1 min-w-0 w-full flex flex-col justify-center space-y-2">
                {chartData.map((item, index) => (
                    <div
                        key={`legend-${index}`}
                        className="group flex flex-col gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-default"
                        title={`${item.name} (${item.value} pesanan - ${item.percentage}%)`}
                    >
                        <div className="flex items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                                <span
                                    className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                                    style={{ backgroundColor: item.color }}
                                />
                                <span className="truncate font-semibold text-slate-700 dark:text-slate-200 text-xs">
                                    {item.name}
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                                <span className="font-extrabold text-slate-800 dark:text-white text-xs">
                                    {item.value}
                                </span>
                                <span className="text-[11px] font-semibold text-slate-400">
                                    ({item.percentage}%)
                                </span>
                            </div>
                        </div>

                        {/* Progress Bar Simetris (Tanpa Margin Keluar) */}
                        <div className="w-full bg-slate-100 dark:bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                    width: `${item.percentage}%`,
                                    backgroundColor: item.color,
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
