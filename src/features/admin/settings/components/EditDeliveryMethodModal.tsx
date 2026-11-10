import { useState, useEffect } from "react";
import { Eye, EyeOff, Edit3, X } from "lucide-react";
import toast from "react-hot-toast";
import Modal from "../../../../shared/components/Modal";
import Button from "../../../../shared/components/Button";
import { updateDeliveryMethodApi } from "../../../../api/deliveryMethods";
import type {
  DeliveryDirection,
  DeliveryMethod,
  DeliveryProviderType,
  UpdateDeliveryMethodPayload,
} from "../../../../types/deliveryMethod";

interface EditDeliveryMethodModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  method: DeliveryMethod | null;
}

export default function EditDeliveryMethodModal({
  open,
  onClose,
  onSuccess,
  method,
}: EditDeliveryMethodModalProps) {
  const [formData, setFormData] = useState<UpdateDeliveryMethodPayload>({
    method_name: "",
    direction: "PICKUP",
    provider_type: "SELF",
    description: "",
    flat_fee: 0,
    requires_address: false,
    requires_courier: false,
    is_active: true,
    display_order: 1,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Inisialisasi form data saat method berubah
  useEffect(() => {
    if (method) {
      setFormData({
        method_name: method.method_name || "",
        direction: method.direction || "PICKUP",
        provider_type: method.provider_type || "SELF",
        description: method.description || "",
        flat_fee: method.flat_fee || 0,
        requires_address: !!method.requires_address,
        requires_courier: !!method.requires_courier,
        is_active: method.is_active ?? true,
        display_order: method.display_order || 1,
      });
    }
  }, [method]);

  const handleProviderTypeChange = (type: DeliveryProviderType) => {
    setFormData((prev) => ({
      ...prev,
      provider_type: type,
      requires_address: type === "COURIER" || type === "INTERNAL",
      requires_courier: type === "COURIER",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!method) return;

    if (!formData.method_name.trim()) {
      toast.error("Nama metode wajib diisi.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: UpdateDeliveryMethodPayload = {
        method_name: formData.method_name.trim(),
        direction: formData.direction,
        provider_type: formData.provider_type,
        description: formData.description?.trim() || "",
        flat_fee: Number(formData.flat_fee) || 0,
        requires_address: formData.requires_address,
        requires_courier: formData.requires_courier,
        is_active: formData.is_active,
        display_order: Number(formData.display_order) || 1,
      };

      const res = await updateDeliveryMethodApi(method.id, payload);
      toast.success(res?.message || "Metode pengantaran berhasil diperbarui");
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Gagal memperbarui metode pengantaran:", err);
      toast.error(err?.message || "Gagal memperbarui metode pengantaran");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!method) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-600 flex items-center justify-center shrink-0">
            <Edit3 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Edit Metode Pengantaran
              </h3>
              <span className="text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-md">
                {method.method_code}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Perbarui konfigurasi tarif, arah alur, dan visibilitas metode
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {/* Direction */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Arah Alur <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.direction}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    direction: e.target.value as DeliveryDirection,
                  }))
                }
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="PICKUP">PICKUP (Serah Berkas Awal)</option>
                <option value="RETURN">RETURN (Kirim Dokumen Selesai)</option>
                <option value="BOTH">BOTH (Dua Arah: Serah & Kirim Balik)</option>
              </select>
            </div>

            {/* Provider Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Penyedia / Tipe <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.provider_type}
                onChange={(e) =>
                  handleProviderTypeChange(
                    e.target.value as DeliveryProviderType,
                  )
                }
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="SELF">SELF (Mandiri Pelanggan)</option>
                <option value="COURIER">COURIER (Ekspedisi Mitra)</option>
                <option value="INTERNAL">INTERNAL (Armada Kantor)</option>
              </select>
            </div>
          </div>

          {/* Method Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Nama Metode{" "}
              <span className="text-rose-500">* (Maks 100 Karakter)</span>
            </label>
            <input
              type="text"
              maxLength={100}
              placeholder="Contoh: Dijemput Staf Operasional Kantor"
              value={formData.method_name}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  method_name: e.target.value,
                }))
              }
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Deskripsi{" "}
              <span className="text-slate-400 font-normal">
                (Maks 255 Karakter)
              </span>
            </label>
            <textarea
              rows={2}
              maxLength={255}
              placeholder="Penjelasan ringkas instruksi pengantaran untuk pelanggan..."
              value={formData.description || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-normal bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Flat Fee */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Biaya Tetap (Rp)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">
                  Rp
                </span>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={formData.flat_fee}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      flat_fee: parseInt(e.target.value, 10) || 0,
                    }))
                  }
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Isi 0 jika tarif ekspedisi / gratis
              </p>
            </div>

            {/* Status Visibilitas: Tampilkan (Unhide) / Sembunyikan (Hide) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Status Visibilitas
              </label>
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    is_active: !prev.is_active,
                  }))
                }
                className={`w-full px-3 py-2 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                  formData.is_active
                    ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500/80 text-emerald-800 dark:text-emerald-300"
                    : "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                }`}
              >
                <div className="flex items-center gap-1.5 truncate">
                  {formData.is_active ? (
                    <Eye className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  ) : (
                    <EyeOff className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  )}
                  <span className="truncate">
                    {formData.is_active
                      ? "Tampilkan (Aktif)"
                      : "Sembunyikan (Hide)"}
                  </span>
                </div>

                <div
                  className={`w-8 h-4.5 rounded-full relative transition-colors shrink-0 ${
                    formData.is_active
                      ? "bg-emerald-600"
                      : "bg-slate-300 dark:bg-slate-600"
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-all ${
                      formData.is_active ? "left-4" : "left-0.5"
                    }`}
                  />
                </div>
              </button>
              <p className="text-[10px] text-slate-400 mt-1">
                {formData.is_active
                  ? "Tampil di halaman checkout"
                  : "Disembunyikan dari checkout"}
              </p>
            </div>
          </div>

          {/* Checkboxes: requires_address & requires_courier */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <label className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.requires_address}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    requires_address: e.target.checked,
                  }))
                }
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Wajib Isi Alamat
              </span>
            </label>

            <label className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.requires_courier}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    requires_courier: e.target.checked,
                  }))
                }
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Pilih Kurir Ekspedisi
              </span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold cursor-pointer"
            >
              Batal
            </button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              className="px-5 py-2.5 text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md shadow-blue-900/20"
            >
              <Edit3 className="w-4 h-4" />
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
