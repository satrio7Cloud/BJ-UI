import { FileText, User } from "lucide-react";

interface DocumentUploadCardProps {
  ktpFile: File | null;
  setKtpFile: (file: File | null) => void;
  stnkFile: File | null;
  setStnkFile: (file: File | null) => void;
}

export default function DocumentUploadCard({
  ktpFile,
  setKtpFile,
  stnkFile,
  setStnkFile,
}: DocumentUploadCardProps) {
  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
      <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <FileText className="w-5 h-5 text-emerald-600" />
        Upload Dokumen Pendukung
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* KTP Upload */}
        <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:bg-slate-100 transition-colors">
          <input
            type="file"
            id="ktpUpload"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                setKtpFile(e.target.files[0]);
              }
            }}
          />
          <label
            htmlFor="ktpUpload"
            className="cursor-pointer flex flex-col items-center gap-3"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <User className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-700">
                {ktpFile ? ktpFile.name : "Foto KTP"}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Format JPG, PNG (Max 5MB)
              </p>
            </div>
          </label>
        </div>

        {/* STNK Upload */}
        <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:bg-slate-100 transition-colors">
          <input
            type="file"
            id="stnkUpload"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                setStnkFile(e.target.files[0]);
              }
            }}
          />
          <label
            htmlFor="stnkUpload"
            className="cursor-pointer flex flex-col items-center gap-3"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-700">
                {stnkFile ? stnkFile.name : "Foto STNK"}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Format JPG, PNG (Max 5MB)
              </p>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
