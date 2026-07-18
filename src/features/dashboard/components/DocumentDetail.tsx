import { FileSearch } from "lucide-react";
import ProgressTimeline from "./ProgressTimeline";

export default function DocumentDetail({ doc }: any) {
  if (!doc) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-center text-slate-400 dark:text-slate-500 transition-colors">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 transition-colors">
          <FileSearch className="h-6 w-6" />
        </div>

        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 transition-colors">
          Belum ada dokumen dipilih
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 transition-colors">
          Pilih dokumen di sebelah kiri untuk melihat detail
        </p>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white transition-colors">{doc.title}</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 transition-colors">ID: {doc.id}</p>

      <div className="mb-6">
        <p className="text-sm font-medium mb-2 text-slate-800 dark:text-white transition-colors">
          {Math.round(doc.progress / 20)}/5 Tahap selesai
        </p>
        <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full transition-colors">
          <div
            className="h-2 bg-green-600 rounded-full"
            style={{ width: `${doc.progress}%` }}
          />
        </div>
      </div>

      <ProgressTimeline steps={doc.steps} />
    </>
  );
}
