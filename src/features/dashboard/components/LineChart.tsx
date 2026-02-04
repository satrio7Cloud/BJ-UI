import {
  LineChart as Chart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { date: "Mon", total: 10 },
  { date: "Tue", total: 20 },
  { date: "Wed", total: 15 },
  { date: "Thu", total: 30 },
  { date: "Fri", total: 25 },
];

export default function LineChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <Chart data={data}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="total" stroke="#2563eb" />
      </Chart>
    </ResponsiveContainer>
  );
}
