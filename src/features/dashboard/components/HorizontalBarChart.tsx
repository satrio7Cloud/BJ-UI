import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { BarChart3 } from "lucide-react";

interface TopService {
  service_name: string;
  order_count: number;
}

interface Props {
  data?: TopService[];
}

export default function HorizontalBarChart({ data }: Props) {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-75 text-slate-400 dark:text-slate-500">
        <BarChart3 size={36} className="mb-2" />
        <p className="text-sm">Tidak ada data layanan terpopuler</p>
      </div>
    );
  }

  const chartData = data.map((s) => ({
    name: s.service_name,
    total: s.order_count,
  }));

  const maxVal = Math.max(...chartData.map((d) => d.total), 10);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} layout="vertical">
        <XAxis type="number" domain={[0, maxVal]} />
        <YAxis type="category" dataKey="name" width={180} tick={{ fontSize: 12 }} />
        <Tooltip formatter={(val) => [`${val} pesanan`, "Jumlah"]} />
        <Bar dataKey="total" fill="#2563eb" radius={[0, 8, 8, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
