import { AlertCircle, ArrowLeft, Car, ChevronRight, Key, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { createCustomerVehicle, getCustomerVehicles, type CustomerVehicle } from "../../../api/customerVehicle";
import { getBrands, getModels, type Brand, type VehicleModel } from "../../../api/vehicle";

export default function MyVehiclesPage() {
  const [customerId, setCustomerId] = useState("");
  const [isGarageOpen, setIsGarageOpen] = useState(false);
  const [myVehicles, setMyVehicles] = useState<CustomerVehicle[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Master Data (for adding vehicle form)
  const [brands, setBrands] = useState<Brand[]>([]);
  const [models, setModels] = useState<VehicleModel[]>([]);
  const [selectedBrandId, setSelectedBrandId] = useState("");
  const [selectedModelId, setSelectedModelId] = useState("");
  const [plateNumber, setPlateNumber] = useState("");
  const [vehicleYear, setVehicleYear] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Load master data for the creation dropdowns
    const loadMasterData = async () => {
      try {
        const [brandRes, modelRes] = await Promise.all([getBrands(), getModels()]);
        if (brandRes?.data) setBrands(brandRes.data);
        if (modelRes?.data) setModels(modelRes.data);
      } catch (err) {
        console.error("Gagal memuat master data kendaraan", err);
      }
    };
    loadMasterData();
  }, []);

  const handleOpenGarage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId.trim()) {
      toast.error("Silakan masukkan ID Pelanggan Anda");
      return;
    }

    try {
      setIsLoading(true);
      const res = await getCustomerVehicles();
      if (res?.data) {
        // Filter vehicles matching the input customer_id
        const filtered = res.data.filter(
          (v) => v.customer_id.toLowerCase() === customerId.trim().toLowerCase()
        );
        setMyVehicles(filtered);
        setIsGarageOpen(true);
        toast.success("Garasi berhasil dibuka!");
      }
    } catch (err: any) {
      toast.error(err.message || "Gagal membuka garasi");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedModelId) {
      toast.error("Silakan pilih Merek Kendaraan");
      return;
    }
    if (!plateNumber.trim()) {
      toast.error("Nomor plat kendaraan tidak boleh kosong");
      return;
    }
    if (!vehicleYear.trim() || isNaN(Number(vehicleYear))) {
      toast.error("Tahun kendaraan harus berupa angka");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await createCustomerVehicle({
        customer_id: customerId.trim(),
        model_id: selectedModelId,
        plate_number: plateNumber.trim().toUpperCase(),
        year: Number(vehicleYear),
      });

      toast.success(res.message || "Kendaraan berhasil didaftarkan!");
      
      // Reset form fields
      setSelectedBrandId("");
      setSelectedModelId("");
      setPlateNumber("");
      setVehicleYear("");

      // Refresh list
      const updatedRes = await getCustomerVehicles();
      if (updatedRes?.data) {
        const filtered = updatedRes.data.filter(
          (v) => v.customer_id.toLowerCase() === customerId.trim().toLowerCase()
        );
        setMyVehicles(filtered);
      }
    } catch (err: any) {
      toast.error(err.message || "Gagal mendaftarkan kendaraan");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter models based on selected brand
  const filteredModels = models.filter((m) => m.brand_id === selectedBrandId);

  // Helper to map model_id to model name
  const getModelName = (modelId: string) => {
    const model = models.find((m) => m.id === modelId);
    return model ? model.model_name : "Model Tidak Diketahui";
  };

  // Helper to map model_id to vehicle type (mobil/motor)
  const getVehicleType = (modelId: string) => {
    const model = models.find((m) => m.id === modelId);
    return model ? model.vehicle_type : "mobil";
  };

  // Helper to get brand name from model_id
  const getBrandNameFromModel = (modelId: string) => {
    const model = models.find((m) => m.id === modelId);
    if (!model) return "Merek Tidak Diketahui";
    const brand = brands.find((b) => b.id === model.brand_id);
    return brand ? brand.brand_name : "Merek Tidak Diketahui";
  };

  return (
    <div className="min-h-screen bg-transparent relative dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* NAVBAR */}
      <nav className="border-b bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors text-sm font-semibold">
            <ArrowLeft size={16} />
            Kembali ke Beranda
          </Link>
          <span className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            Garasi Layanan
          </span>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12 space-y-8">
        {!isGarageOpen ? (
          /* ID PENGGUNA ENTRY */
          <div className="max-w-md mx-auto bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border border-slate-100 dark:border-slate-800/50 space-y-6 text-center transition-colors">
            <div className="mx-auto w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Key size={32} />
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-950 dark:text-white">
                Buka Garasi Kendaraan
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500 mt-2">
                Masukkan ID Pelanggan (*Customer ID*) Anda untuk melihat daftar kendaraan yang terdaftar.
              </p>
            </div>

            <form onSubmit={handleOpenGarage} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  ID Pelanggan
                </label>
                <input
                  type="text"
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  placeholder="Contoh: 7EE40036-419E-4DC7-914B-81477F1AC9B2"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl text-sm transition-colors disabled:opacity-50 cursor-pointer shadow-lg shadow-blue-500/10"
              >
                {isLoading ? "Membuka..." : "Buka Garasi"}
                <ChevronRight size={16} />
              </button>
            </form>
          </div>
        ) : (
          /* GARASI KENDARAAN (LIST + FORM DAFTAR) */
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Garasi Kendaraan Saya
                </h1>
                <p className="mt-2 text-xs sm:text-sm text-slate-400 dark:text-slate-500">
                  ID Pelanggan: <span className="font-mono text-blue-600 dark:text-blue-400 font-semibold">{customerId}</span>
                </p>
              </div>

              <button
                onClick={() => {
                  setIsGarageOpen(false);
                  setCustomerId("");
                  setMyVehicles([]);
                }}
                className="px-4 py-2 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 rounded-xl text-sm hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer transition-colors"
              >
                Ganti ID Pelanggan
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form Register Vehicle */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 transition-colors space-y-4 lg:col-span-1">
                <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
                  Daftarkan Kendaraan Baru
                </h2>
                <form onSubmit={handleRegisterVehicle} className="space-y-4">
                  {/* Brand Selector */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                      Merek Kendaraan
                    </label>
                    <select
                      value={selectedBrandId}
                      onChange={(e) => {
                        setSelectedBrandId(e.target.value);
                        setSelectedModelId("");
                      }}
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

                  {/* Model Selector */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                     Merek Kendaraan
                    </label>
                    <select
                      value={selectedModelId}
                      onChange={(e) => setSelectedModelId(e.target.value)}
                      disabled={!selectedBrandId}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm disabled:opacity-50"
                    >
                      <option value="">-- Pilih Model --</option>
                      {filteredModels.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.model_name} ({m.vehicle_type})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Plate Number */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                      Nomor Plat
                    </label>
                    <input
                      type="text"
                      value={plateNumber}
                      onChange={(e) => setPlateNumber(e.target.value)}
                      placeholder="Contoh: B 0901 ZOB"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm uppercase"
                    />
                  </div>

                  {/* Year */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                      Tahun Pembuatan
                    </label>
                    <input
                      type="text"
                      value={vehicleYear}
                      onChange={(e) => setVehicleYear(e.target.value)}
                      placeholder="Contoh: 2020"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    <Plus size={16} />
                    {isSubmitting ? "Mendaftarkan..." : "Daftarkan"}
                  </button>
                </form>
              </div>

              {/* List Vehicles */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 transition-colors lg:col-span-2 space-y-4">
                <h2 className="text-lg font-semibold text-slate-950 dark:text-white flex items-center gap-2">
                  <Car size={20} />
                  Daftar Kendaraan Terdaftar
                </h2>

                {myVehicles.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-500">
                    <AlertCircle size={40} className="mb-2" />
                    <p className="text-sm">Belum ada kendaraan terdaftar.</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Silakan daftarkan kendaraan baru di form sebelah kiri.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {myVehicles.map((vehicle) => (
                      <div
                        key={vehicle.id}
                        className="p-5 rounded-2xl border border-slate-150 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:border-blue-300 dark:hover:border-blue-800 transition-all shadow-sm space-y-3 relative group"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-wider mb-2 ${
                              getVehicleType(vehicle.model_id) === "mobil"
                                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                            }`}>
                              {getVehicleType(vehicle.model_id)}
                            </span>
                            <h3 className="font-bold text-base text-slate-950 dark:text-white">
                              {getBrandNameFromModel(vehicle.model_id)} {getModelName(vehicle.model_id)}
                            </h3>
                          </div>
                          <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold shrink-0">
                            Thn {vehicle.year}
                          </span>
                        </div>

                        <div className="border-t border-slate-200/50 dark:border-slate-800/50 pt-2 flex items-center justify-between">
                          <span className="text-xs text-slate-400 dark:text-slate-500 uppercase font-semibold">
                            Nomor Plat
                          </span>
                          <span className="font-mono text-sm font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1 rounded-lg tracking-wider text-slate-900 dark:text-white uppercase">
                            {vehicle.plate_number}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
