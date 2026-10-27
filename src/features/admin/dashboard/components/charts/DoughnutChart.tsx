import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { PieChart as PieChartIcon } from "lucide-react";

interface TopService {
    service_name: string;
    order_count: number;
}

interface Props {
    data?: TopService[];
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export default function DoughnutChart({ data }: Props) {
    if (!data || data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-75 text-slate-400 dark:text-slate-500">
                <PieChartIcon size={36} className="mb-2" />
                <p className="text-sm">Tidak ada data layanan terpopuler</p>
            </div>
        );
    }

    const chartData = data.map((s) => ({
        name: s.service_name,
        value: s.order_count,
    }));

    const renderCustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-100 dark:border-slate-700">
                    <p className="font-semibold text-slate-800 dark:text-white text-sm mb-1">{payload[0].name}</p>
                    <p className="text-blue-600 dark:text-blue-400 font-bold">{payload[0].value} pesanan</p>
                </div>
            );
        }
        return null;
    };

    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={chartData}
                    cx="50%"
                    cy="45%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                >
                    {chartData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip content={renderCustomTooltip} />
                <Legend
                    verticalAlign="bottom"
                    height={36}
                    content={(props) => {
                        const { payload } = props;
                        return (
                            <ul className="flex flex-wrap justify-center gap-3 mt-4">
                                {payload?.map((entry, index) => (
                                    <li key={`item-${index}`} className="flex items-center text-xs text-slate-600 dark:text-slate-300">
                                        <span
                                            className="w-3 h-3 rounded-full mr-2 inline-block shadow-sm"
                                            style={{ backgroundColor: entry.color }}
                                        />
                                        <span className="truncate bg-linear-to-br" title={entry.value}>{entry.value}</span>
                                    </li>
                                ))}
                            </ul>
                        );
                    }}
                />
            </PieChart>
        </ResponsiveContainer>
    );
}
