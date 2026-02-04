import { FileSearch } from "lucide-react";
import ProgressTimeline from "./ProgressTimeline";

export default function DocumentDetail({ doc }: any) {
  if (!doc) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-center text-gray-400">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
          <FileSearch className="h-6 w-6" />
        </div>

        <p className="text-sm font-medium text-gray-600">
          Belum ada dokumen dipilih
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Pilih dokumen di sebelah kiri untuk melihat detail
        </p>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-xl font-bold">{doc.title}</h2>
      <p className="text-sm text-gray-500 mb-4">ID: {doc.id}</p>

      <div className="mb-6">
        <p className="text-sm font-medium mb-2">
          {Math.round(doc.progress / 20)}/5 Tahap selesai
        </p>
        <div className="h-2 bg-gray-200 rounded-full">
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
