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
        <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 transition-colors">
          <Clock size={12} /> Diproses
        </span>
      );
    case "Selesai":
      return (
        <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 transition-colors">
          <CheckCircle size={12} /> Selesai
        </span>
      );
    case "Menunggu":
      return (
        <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 transition-colors">
          Menunggu
        </span>
      );
    case "Perlu Perhatian":
      return (
        <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors">
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
        cursor-pointer rounded-xl border p-4 transition-colors
        ${active ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-500" : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"}
      `}
    >
      <div className="flex items-start gap-3">
        <div
          className={`
            flex h-10 w-10 items-center justify-center rounded-lg transition-colors
            ${active ? "bg-blue-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"}
          `}
        >
          <FileText size={18} />
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold leading-tight text-slate-900 dark:text-white transition-colors">{data.title}</h3>
            <StatusBadge status={data.status} />
          </div>

          <p className="text-sm text-slate-500 dark:text-slate-400 transition-colors">{data.category}</p>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden transition-colors">
            <div
              className="h-2 bg-blue-600 rounded-full"
              style={{ width: `${data.progress}%` }}
            />
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 transition-colors">{data.progress}%</span>
        </div>
      </div>

      <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 transition-colors">Update: {data.updatedAt}</p>
    </div>
  );
}
