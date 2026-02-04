import { FileText, Clock, CheckCircle, AlertTriangle } from "lucide-react";

type Props = {
  data: any;
  active: boolean;
  onClick: () => void;
};

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "Diproses":
      return (
        <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-600">
          <Clock size={12} /> Diproses
        </span>
      );
    case "Selesai":
      return (
        <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-green-100 text-green-600">
          <CheckCircle size={12} /> Selesai
        </span>
      );
    case "Menunggu":
      return (
        <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-600">
          Menunggu
        </span>
      );
    case "Perlu Perhatian":
      return (
        <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-red-100 text-red-600">
          <AlertTriangle size={12} /> Perhatian
        </span>
      );
    default:
      return null;
  }
}

export default function DocumentItem({ data, active, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className={`
        cursor-pointer rounded-xl border p-4 transition
        ${active ? "border-blue-500 bg-blue-50" : "bg-white hover:bg-gray-50"}
      `}
    >
      <div className="flex items-start gap-3">
        <div
          className={`
            flex h-10 w-10 items-center justify-center rounded-lg
            ${active ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500"}
          `}
        >
          <FileText size={18} />
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold leading-tight">{data.title}</h3>
            <StatusBadge status={data.status} />
          </div>

          <p className="text-sm text-gray-500">{data.category}</p>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-2 bg-blue-600 rounded-full"
              style={{ width: `${data.progress}%` }}
            />
          </div>
          <span className="text-xs text-gray-500">{data.progress}%</span>
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-2">Update: {data.updatedAt}</p>
    </div>
  );
}
