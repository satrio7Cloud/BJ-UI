import { User } from "lucide-react";
import { type CheckoutFormData } from "../types";

interface CustomerDataCardProps {
  formData: CheckoutFormData;
  setFormData: React.Dispatch<React.SetStateAction<CheckoutFormData>>;
  prefillNik?: string;
}

export default function CustomerDataCard({
  formData,
  setFormData,
  prefillNik,
}: CustomerDataCardProps) {
  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
      <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <User className="w-5 h-5 text-emerald-600" />
        Masukan Data Diri Anda
      </h2>
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Nama Lengkap
          </label>
          <input
            type="text"
            placeholder="Sesuai KTP"
            value={formData.fullname}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, fullname: e.target.value }))
            }
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-slate-50 focus:bg-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Nomor WhatsApp
          </label>
          <input
            type="number"
            placeholder="Contoh: 08123456789"
            value={formData.phone_number}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, phone_number: e.target.value }))
            }
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-slate-50 focus:bg-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Nomor Induk Kependudukan (NIK)
          </label>
          <input
            type="text"
            placeholder="16 Digit NIK KTP"
            value={formData.nik}
            disabled={!!prefillNik}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 16);
              setFormData((prev) => ({
                ...prev,
                nik: value,
              }));
            }}
            maxLength={16}
            inputMode="numeric"
            pattern="[0-9]*"
            className={`w-full px-4 py-3 rounded-xl border border-slate-200 outline-none transition-all ${
              prefillNik
                ? "bg-slate-100 text-slate-500 cursor-not-allowed"
                : "bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            }`}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Email
          </label>
          <input
            type="email"
            placeholder="Contoh: budi@email.com"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-slate-50 focus:bg-white"
          />
        </div>
        <div className="sm:col-span-2 grid sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Alamat Lengkap
            </label>
            <textarea
              placeholder="Sesuai KTP / Domisili saat ini"
              rows={2}
              value={formData.address}
              onChange={(e) => {
                const newAddr = e.target.value;
                setFormData((prev) => ({
                  ...prev,
                  address: newAddr,
                  pickup_address: prev.pickup_address || newAddr,
                }));
              }}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-slate-50 focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Kode Pos Tujuan *
            </label>
            <input
              type="text"
              maxLength={5}
              placeholder="Contoh: 12440"
              value={formData.postal_code}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 5);
                setFormData((prev) => ({ ...prev, postal_code: val }));
              }}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-slate-50 focus:bg-white font-mono text-center text-lg font-bold tracking-widest"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
