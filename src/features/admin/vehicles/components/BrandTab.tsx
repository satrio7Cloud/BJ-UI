import { Check, List, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { createBrand, type Brand } from "../../../../api/vehicle";
import Button from "../../../../shared/components/Button";

interface BrandTabProps {
  brands: Brand[];
  isLoadingBrands: boolean;
  onRefreshBrands: () => Promise<void>;
}

export default function BrandTab({
  brands,
  isLoadingBrands,
  onRefreshBrands,
}: BrandTabProps) {
  const [newBrandName, setNewBrandName] = useState("");
  const [isSubmittingBrand, setIsSubmittingBrand] = useState(false);

  const handleAddBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandName.trim()) {
      toast.error("Nama merek tidak boleh kosong");
      return;
    }

    try {
      setIsSubmittingBrand(true);
      const res = await createBrand({ brand_name: newBrandName.trim() });
      toast.success(res.message || "Merek berhasil ditambahkan");
      setNewBrandName("");
      onRefreshBrands(); // reload brands
    } catch (err: any) {
      toast.error(err.message || "Gagal menambahkan merek");
    } finally {
      setIsSubmittingBrand(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Form Add Brand */}
      <div className="space-y-4 lg:col-span-1">
        <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
          Tambah Merek Baru
        </h2>
        <form onSubmit={handleAddBrand} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Nama Merek
            </label>
            <input
              type="text"
              value={newBrandName}
              onChange={(e) => setNewBrandName(e.target.value)}
              placeholder="Contoh: Honda, Toyota, Yamaha"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            size="full"
            isLoading={isSubmittingBrand}
          >
            <Plus size={16} />
            Tambah Merek
          </Button>
        </form>
      </div>

      {/* List Brands */}
      <div className="space-y-4 lg:col-span-2 border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800 lg:pl-8 pt-6 lg:pt-0">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-slate-950 dark:text-white flex items-center gap-2">
            <List size={18} />
            Daftar Merek Terdaftar
          </h2>
          <span className="text-xs text-slate-400 dark:text-slate-500">
            {brands.length} merek
          </span>
        </div>

        {isLoadingBrands ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
          </div>
        ) : brands.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            Belum ada merek terdaftar.
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 overflow-y-auto max-h-100 pr-2">
            {brands.map((b) => (
              <div
                key={b.id}
                className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-sm flex items-center gap-1.5 shadow-sm"
              >
                <Check size={14} className="text-emerald-500" />
                {b.brand_name}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
