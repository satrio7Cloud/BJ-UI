type Props = {
  status: string;
};

export default function InvoiceStatusBadge({ status }: Props) {
  const map = {
    lunas: "success",
    menunggu: "warning",
    terlambat: "danger",
  } as const;

  const variant = map[status as keyof typeof map] || "info";

  const styles = {
    success: "bg-green-50 text-green-600",
    warning: "bg-yellow-50 text-yellow-600",
    danger: "bg-red-50 text-red-600",
    info: "bg-blue-50 text-blue-600",
  }[variant];

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${styles}`}
    >
      {status}
    </span>
  );
}
