function StatusBadge({ status }: { status: string }) {
  const map: any = {
    lunas: "bg-green-100 text-green-700",
    menunggu: "bg-yellow-100 text-yellow-700",
    terlambat: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`px-3 py-1 text-xs rounded-full font-medium ${map[status]}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export default StatusBadge;
