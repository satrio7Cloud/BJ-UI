import { List, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  createModel,
  getModels,
  type Brand,
  type VehicleModel,
} from "../../../../api/vehicle";
import Button from "../../../../shared/components/Button";

interface ModelTabProps {
  brands: Brand[];
}

export default function ModelTab({ brands }: ModelTabProps) {
  const [models, setModels] = useState<VehicleModel[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [selectedBrandId, setSelectedBrandId] = useState("");
  const [newModelName, setNewModelName] = useState("");
  const [vehicleType, setVehicleType] = useState<"mobil" | "motor">("mobil");
  const [isSubmittingModel, setIsSubmittingModel] = useState(false);

  const fetchModelsData = async () => {
    try {
      setIsLoadingModels(true);
      const res = await getModels();
      if (res?.data) {
        setModels(res.data);
      }
    } catch (err: any) {
      toast.error(err.message || "Gagal mengambil data model");
    } finally {
      setIsLoadingModels(false);
    }
  };

  useEffect(() => {
    fetchModelsData();
  }, []);

  const handleAddModel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBrandId) {
      toast.error("Silakan pilih merek kendaraan");
      return;
    }
    if (!newModelName.trim()) {
      toast.error("Nama model tidak boleh kosong");
      return;
    }

    try {
      setIsSubmittingModel(true);
      const brand = brands.find((b) => b.id === selectedBrandId);
      const res = await createModel({
        brand_id: selectedBrandId,
        model_name: newModelName.trim(),
        brand_name: brand ? brand.brand_name : "",
        vehicle_type: vehicleType,
      });
      toast.success(res.message || "Model berhasil ditambahkan");
      setNewModelName("");
      setSelectedBrandId("");
      setVehicleType("mobil");
      fetchModelsData(); // reload models
    } catch (err: any) {
      toast.error(err.message || "Gagal menambahkan model");
    } finally {
      setIsSubmittingModel(false);
    }
  };

  const getBrandName = (brandId: string) => {
    const brand = brands.find((b) => b.id === brandId);
    return brand ? brand.brand_name : "Merek Tidak Diketahui";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Form Add Model */}
      <div className="space-y-4 lg:col-span-1">
        <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
          Tambah Merek Kendaraan Baru
        </h2>
        <form onSubmit={handleAddModel} className="space-y-5">
          {/* Brand Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Merek Kendaraan
            </label>
            <select
              value={selectedBrandId}
              onChange={(e) => setSelectedBrandId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
            >
              <option value="">-- Pilih Merek --</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.brand_name}
                </option>
              ))}
            </select>
          </div>

          {/* Model Name Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Nama Merek Kendaraan
            </label>
            <input
              type="text"
              value={newModelName}
              onChange={(e) => setNewModelName(e.target.value)}
              placeholder="Contoh: Honda Civic, Yamaha NMAX"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
            />
          </div>

          {/* Vehicle Type Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
              Tipe Kendaraan
            </label>
            <div className="flex gap-4">
              <label className="flex-1 flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 cursor-pointer text-sm font-semibold select-none">
                <span className="text-slate-700 dark:text-slate-300">
                  Mobil
                </span>
                <input
                  type="radio"
                  name="vehicleType"
                  checked={vehicleType === "mobil"}
                  onChange={() => setVehicleType("mobil")}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
              </label>
              <label className="flex-1 flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 cursor-pointer text-sm font-semibold select-none">
                <span className="text-slate-700 dark:text-slate-300">
                  Motor
                </span>
                <input
                  type="radio"
                  name="vehicleType"
                  checked={vehicleType === "motor"}
                  onChange={() => setVehicleType("motor")}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
              </label>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="full"
            isLoading={isSubmittingModel}
          >
            <Plus size={16} />
            Tambah Model
          </Button>
        </form>
      </div>

      {/* List Models Table */}
      <div className="space-y-4 lg:col-span-2 border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800 lg:pl-8 pt-6 lg:pt-0">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-slate-950 dark:text-white flex items-center gap-2">
            <List size={18} />
            Daftar Model Terdaftar
          </h2>
          <span className="text-xs text-slate-400 dark:text-slate-500">
            {models.length} model
          </span>
        </div>

        {isLoadingModels ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
          </div>
        ) : models.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            Belum ada model terdaftar.
          </div>
        ) : (
          <div className="overflow-x-auto border border-slate-100 dark:border-slate-800 rounded-xl">
            <table className="w-full text-sm text-left text-slate-600 dark:text-slate-400">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3">No.</th>
                  <th className="px-4 py-3">Nama Model</th>
                  <th className="px-4 py-3">Merek</th>
                  <th className="px-4 py-3">Tipe</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {models.map((model, idx) => (
                  <tr
                    key={model.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                      {idx + 1}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                      {model.model_name}
                    </td>
                    <td className="px-4 py-3">
                      {getBrandName(model.brand_id)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                          model.vehicle_type === "mobil"
                            ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                            : "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                        }`}
                      >
                        {model.vehicle_type}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
