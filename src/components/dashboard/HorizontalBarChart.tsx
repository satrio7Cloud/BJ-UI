import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Perpanjangan STNK", total: 55 },
  { name: "Balik Nama", total: 40 },
  { name: "Pajak Kendaraan", total: 30 },
  { name: "Mutasi Kendaraan", total: 20 },
];

export default function HorizontalBarChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical">
        <XAxis type="number" domain={[0, 60]} ticks={[0, 15, 30, 45, 60]} />
        <YAxis type="category" dataKey="name" width={140} />
        <Tooltip />
        <Bar dataKey="total" fill="#2563eb" radius={[0, 8, 8, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
