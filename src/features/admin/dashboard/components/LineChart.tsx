import {
  LineChart as Chart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import type { DashboardChartData } from "../../../api/dashboard";

import { TrendingUp } from "lucide-react";

interface Props {
  data?: DashboardChartData[];
}

const formatRupiah = (val: number) =>
  "Rp " + val.toLocaleString("id-ID");

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 shadow-lg text-sm">
      <p className="font-semibold text-slate-700 dark:text-slate-300 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p 
          key={p.dataKey} 
          className={p.dataKey === "revenue" ? "text-emerald-500" : "text-blue-600"}
        >
          {p.name}: {p.dataKey === "revenue" ? formatRupiah(p.value) : p.value}
        </p>
      ))}
    </div>
  );
};

export default function LineChart({ data }: Props) {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-75 text-slate-400 dark:text-slate-500">
        <TrendingUp size={36} className="mb-2" />
        <p className="text-sm">Tidak ada data grafik transaksi</p>
      </div>
    );
  }

  const chartData = data
    .slice()
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((d) => ({
      date: new Date(d.date).toLocaleDateString("id-ID", { day: "numeric", month: "short" }),
      order_count: d.order_count,
      revenue: d.revenue,
    }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <Chart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
        <YAxis yAxisId="orders" orientation="left" tick={{ fontSize: 12 }} allowDecimals={false} />
        <YAxis yAxisId="revenue" orientation="right" tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line
          yAxisId="orders"
          type="monotone"
          dataKey="order_count"
          name="Jumlah Order"
          stroke="#2563eb"
          strokeWidth={2}
          dot={{ r: 4, fill: "#2563eb" }}
          activeDot={{ r: 6 }}
        />
        <Line
          yAxisId="revenue"
          type="monotone"
          dataKey="revenue"
          name="Pendapatan"
          stroke="#10b981"
          strokeWidth={2}
          dot={{ r: 4, fill: "#10b981" }}
          activeDot={{ r: 6 }}
        />
      </Chart>
    </ResponsiveContainer>
  );
}
