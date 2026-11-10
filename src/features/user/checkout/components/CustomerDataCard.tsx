import { AlertCircle, User } from "lucide-react";
import { type CheckoutFormData, type FormErrors } from "../types";

interface CustomerDataCardProps {
  formData: CheckoutFormData;
  setFormData: React.Dispatch<React.SetStateAction<CheckoutFormData>>;
  prefillNik?: string;
  errors?: FormErrors;
  onClearError?: (field: keyof FormErrors) => void;
}

export default function CustomerDataCard({
  formData,
  setFormData,
  prefillNik,
  errors = {},
  onClearError,
}: CustomerDataCardProps) {
  const handleChange = (
    field: keyof CheckoutFormData,
    value: string,
    errorKey?: keyof FormErrors
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (onClearError && errorKey) {
      onClearError(errorKey);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
      <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <User className="w-5 h-5 text-emerald-600" />
        Masukan Data Diri Anda
      </h2>
      <div className="grid sm:grid-cols-2 gap-6">
        {/* Nama Lengkap */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Nama Lengkap <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Sesuai KTP"
            value={formData.fullname}
            onChange={(e) => handleChange("fullname", e.target.value, "fullname")}
            className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${
              errors.fullname
                ? "border-rose-400 bg-rose-50/50 focus:ring-2 focus:ring-rose-400 focus:bg-white"
                : "border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            }`}
          />
          {errors.fullname && (
            <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {errors.fullname}
            </p>
          )}
        </div>

        {/* Nomor WhatsApp */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Nomor WhatsApp <span className="text-rose-500">*</span>
          </label>
          <input
            type="tel"
            placeholder="Contoh: 08123456789"
            value={formData.phone_number}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "");
              handleChange("phone_number", val, "phone_number");
            }}
            className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${
              errors.phone_number
                ? "border-rose-400 bg-rose-50/50 focus:ring-2 focus:ring-rose-400 focus:bg-white"
                : "border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            }`}
          />
          {errors.phone_number ? (
            <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {errors.phone_number}
            </p>
          ) : (
            <p className="text-[11px] text-slate-400 mt-1">
              Nomor aktif untuk pengiriman update status & invoice
            </p>
          )}
        </div>

        {/* NIK */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Nomor Induk Kependudukan (NIK) <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            placeholder="16 Digit NIK KTP"
            value={formData.nik}
            disabled={!!prefillNik}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 16);
              handleChange("nik", value, "nik");
            }}
            maxLength={16}
            inputMode="numeric"
            pattern="[0-9]*"
            className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${
              prefillNik
                ? "bg-slate-100 text-slate-500 cursor-not-allowed border-slate-200"
                : errors.nik
                ? "border-rose-400 bg-rose-50/50 focus:ring-2 focus:ring-rose-400 focus:bg-white"
                : "bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 border-slate-200"
            }`}
          />
          {errors.nik && (
            <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {errors.nik}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Email <span className="text-rose-500">*</span>
          </label>
          <input
            type="email"
            placeholder="Contoh: budi@email.com"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value, "email")}
            className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${
              errors.email
                ? "border-rose-400 bg-rose-50/50 focus:ring-2 focus:ring-rose-400 focus:bg-white"
                : "border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            }`}
          />
          {errors.email && (
            <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {errors.email}
            </p>
          )}
        </div>

        {/* Alamat & Kode Pos */}
        <div className="sm:col-span-2 grid sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Alamat Lengkap <span className="text-rose-500">*</span>
            </label>
            <textarea
              placeholder="Sesuai KTP / Domisili saat ini (Jalan, RT/RW, Kelurahan, Kecamatan)"
              rows={2}
              value={formData.address}
              onChange={(e) => {
                const newAddr = e.target.value;
                setFormData((prev) => ({
                  ...prev,
                  address: newAddr,
                  pickup_address: prev.pickup_address || newAddr,
                }));
                if (onClearError) {
                  onClearError("address");
                  if (newAddr.trim()) onClearError("pickup_address");
                }
              }}
              className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${
                errors.address
                  ? "border-rose-400 bg-rose-50/50 focus:ring-2 focus:ring-rose-400 focus:bg-white"
                  : "border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              }`}
            />
            {errors.address && (
              <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.address}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Kode Pos <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              maxLength={5}
              placeholder="Contoh: 12440"
              value={formData.postal_code}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 5);
                handleChange("postal_code", val, "postal_code");
              }}
              className={`w-full px-4 py-3 rounded-xl border outline-none transition-all font-mono text-center text-lg font-bold tracking-widest ${
                errors.postal_code
                  ? "border-rose-400 bg-rose-50/50 focus:ring-2 focus:ring-rose-400 focus:bg-white"
                  : "border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              }`}
            />
            {errors.postal_code ? (
              <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.postal_code}
              </p>
            ) : (
              <p className="text-[11px] text-slate-400 mt-1 text-center">5 Digit</p>
            )}
          </div>
        </div>

        {/* Catatan Tambahan untuk Petugas/Kurir */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Catatan Tambahan untuk Petugas / Kurir <span className="text-slate-400 font-normal text-xs">(Opsional)</span>
          </label>
          <input
            type="text"
            placeholder="Contoh: Tolong jemput sebelum jam 12 siang / Titip di pos satpam"
            value={formData.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-sm"
          />
        </div>
      </div>
    </div>
  );
}
