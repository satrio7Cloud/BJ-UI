import {
  Car,
  Check,
  Layers,
  List,
  Plus,
  RefreshCw,
  Shield,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  createService,
  getServices,
  type ApiService,
} from "../../../api/services";
import {
  createBrand,
  createModel,
  getBrands,
  getModels,
  type Brand,
  type VehicleModel,
} from "../../../api/vehicle";

export default function VehiclesPage() {
  const [activeTab, setActiveTab] = useState<"brands" | "models" | "services">(
    "brands",
  );

  // Brands states
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoadingBrands, setIsLoadingBrands] = useState(false);
  const [newBrandName, setNewBrandName] = useState("");
  const [isSubmittingBrand, setIsSubmittingBrand] = useState(false);

  // Models states
  const [models, setModels] = useState<VehicleModel[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [selectedBrandId, setSelectedBrandId] = useState("");
  const [newModelName, setNewModelName] = useState("");
  const [vehicleType, setVehicleType] = useState<"mobil" | "motor">("mobil");
  const [isSubmittingModel, setIsSubmittingModel] = useState(false);

  // Services states
  const [services, setServices] = useState<ApiService[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(false);
  const [serviceName, setServiceName] = useState("");
  const [serviceCategory, setServiceCategory] = useState("");
  const [serviceFee, setServiceFee] = useState("");
  const [serviceExpressFee, setServiceExpressFee] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [isSubmittingService, setIsSubmittingService] = useState(false);

  const fetchBrandsData = async () => {
    try {
      setIsLoadingBrands(true);
      const res = await getBrands();
      if (res?.data) {
        setBrands(res.data);
      }
    } catch (err: any) {
      toast.error(err.message || "Gagal mengambil data merek");
    } finally {
      setIsLoadingBrands(false);
    }
  };

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

  const fetchServicesData = async () => {
    try {
      setIsLoadingServices(true);
      const res = await getServices();
      if (res?.data) {
        setServices(res.data);
      }
    } catch (err: any) {
      toast.error(err.message || "Gagal mengambil data layanan");
    } finally {
      setIsLoadingServices(false);
    }
  };

  useEffect(() => {
    fetchBrandsData();
    fetchModelsData();
    fetchServicesData();
  }, []);

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
      fetchBrandsData(); // reload brands
    } catch (err: any) {
      toast.error(err.message || "Gagal menambahkan merek");
    } finally {
      setIsSubmittingBrand(false);
    }
  };

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

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceName.trim()) {
      toast.error("Nama layanan tidak boleh kosong");
      return;
    }
    if (!serviceCategory.trim()) {
      toast.error("Kategori layanan tidak boleh kosong");
      return;
    }
    if (!serviceFee.trim() || isNaN(Number(serviceFee))) {
      toast.error("Biaya layanan reguler harus berupa angka");
      return;
    }
    if (!serviceExpressFee.trim() || isNaN(Number(serviceExpressFee))) {
      toast.error("Biaya layanan express harus berupa angka");
      return;
    }

    try {
      setIsSubmittingService(true);
      const res = await createService({
        service_name: serviceName.trim(),
        category: serviceCategory.trim(),
        service_fee: Number(serviceFee),
        express_fee: Number(serviceExpressFee),
        description: serviceDescription.trim(),
      });

      toast.success(res.message || "Layanan berhasil ditambahkan!");
      setServiceName("");
      setServiceCategory("");
      setServiceFee("");
      setServiceExpressFee("");
      setServiceDescription("");
      fetchServicesData(); // Refresh list
    } catch (err: any) {
      toast.error(err.message || "Gagal menambahkan layanan");
    } finally {
      setIsSubmittingService(false);
    }
  };

  // Helper to map brand_id to brand_name
  const getBrandName = (brandId: string) => {
    const brand = brands.find((b) => b.id === brandId);
    return brand ? brand.brand_name : "Merek Tidak Diketahui";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Data Master
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Kelola data merek, Merek Kendaraan, dan jenis layanan yang aktif di
            sistem.
          </p>
        </div>
        <button
          onClick={() => {
            fetchBrandsData();
            fetchModelsData();
            fetchServicesData();
            toast.success("Semua data master berhasil disegarkan");
          }}
          className="flex items-center gap-2 justify-center px-4 py-2 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 rounded-xl text-sm hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer shrink-0 transition-colors"
        >
          <RefreshCw size={16} />
          Segarkan Data
        </button>
      </div>

      {/* Tabs Header */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 transition-colors">
        <button
          onClick={() => setActiveTab("brands")}
          className={`flex items-center gap-2 py-3 px-4 font-medium text-sm border-b-2 transition-all -mb-0.5 ${
            activeTab === "brands"
              ? "border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          <Shield size={16} />
          Brand
        </button>
        <button
          onClick={() => setActiveTab("models")}
          className={`flex items-center gap-2 py-3 px-4 font-medium text-sm border-b-2 transition-all -mb-0.5 ${
            activeTab === "models"
              ? "border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          <Car size={16} />
          Merek Kendaraan
        </button>
        <button
          onClick={() => setActiveTab("services")}
          className={`flex items-center gap-2 py-3 px-4 font-medium text-sm border-b-2 transition-all -mb-0.5 ${
            activeTab === "services"
              ? "border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          <Layers size={16} />
          Layanan Biro Jasa
        </button>
      </div>

      {/* Tabs Content */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
        {activeTab === "brands" ? (
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
                <button
                  type="submit"
                  disabled={isSubmittingBrand}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <Plus size={16} />
                  {isSubmittingBrand ? "Menyimpan..." : "Tambah Merek"}
                </button>
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
        ) : activeTab === "models" ? (
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

                <button
                  type="submit"
                  disabled={isSubmittingModel}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <Plus size={16} />
                  {isSubmittingModel ? "Menyimpan..." : "Tambah Model"}
                </button>
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
        ) : (
          /* TAB LAYANAN BIRO JASA */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Add Service */}
            <div className="space-y-4 lg:col-span-1">
              <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
                Tambah Layanan Baru
              </h2>
              <form onSubmit={handleAddService} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Nama Layanan
                  </label>
                  <input
                    type="text"
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                    placeholder="Contoh: Perpanjang STNK 5 Tahun"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Kategori Layanan
                  </label>
                  <input
                    type="text"
                    value={serviceCategory}
                    onChange={(e) => setServiceCategory(e.target.value)}
                    placeholder="Contoh: STNK, BPKB, SIM, Plat Nomor, dll."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Biaya Jasa Dasar / Reguler (Rupiah)
                  </label>
                  <input
                    type="text"
                    value={serviceFee}
                    onChange={(e) => setServiceFee(e.target.value)}
                    placeholder="Contoh: 300000"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Biaya Tambahan Express (Rupiah)
                  </label>
                  <input
                    type="text"
                    value={serviceExpressFee}
                    onChange={(e) => setServiceExpressFee(e.target.value)}
                    placeholder="Contoh: 150000"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Deskripsi Layanan
                  </label>
                  <textarea
                    value={serviceDescription}
                    onChange={(e) => setServiceDescription(e.target.value)}
                    placeholder="Contoh: Kebutuhan perpanjangan STNK motor/mobil"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                    rows={3}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingService}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <Plus size={16} />
                  {isSubmittingService ? "Menyimpan..." : "Tambah Layanan"}
                </button>
              </form>
            </div>

            {/* List Services Table */}
            <div className="space-y-4 lg:col-span-2 border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800 lg:pl-8 pt-6 lg:pt-0">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-slate-950 dark:text-white flex items-center gap-2">
                  <List size={18} />
                  Daftar Layanan Tersedia
                </h2>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  {services.length} layanan
                </span>
              </div>

              {isLoadingServices ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
                </div>
              ) : services.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  Belum ada layanan terdaftar.
                </div>
              ) : (
                <div className="overflow-x-auto border border-slate-100 dark:border-slate-800 rounded-xl">
                  <table className="w-full text-sm text-left text-slate-600 dark:text-slate-400">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                      <tr>
                        <th className="px-4 py-3">No.</th>
                        <th className="px-4 py-3">Nama Layanan</th>
                        <th className="px-4 py-3">Kategori</th>
                        <th className="px-4 py-3">Biaya Reguler</th>
                        <th className="px-4 py-3">Biaya Express</th>
                        <th className="px-4 py-3">Tanggal Dibuat</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {services.map((service, idx) => {
                        const displayDate = service.created_at
                          ? new Date(service.created_at).toLocaleDateString(
                              "id-ID",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )
                          : "-";
                        return (
                          <tr
                            key={service.id}
                            className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                          >
                            <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                              {idx + 1}
                            </td>
                            <td className="px-4 py-3">
                              <p className="font-semibold text-slate-900 dark:text-white">
                                {service.service_name}
                              </p>
                              <p
                                className="text-xs text-slate-450 dark:text-slate-500 truncate max-h-100"
                                title={service.description}
                              >
                                {service.description}
                              </p>
                            </td>
                            <td className="px-4 py-3">
                              <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400">
                                {service.category}
                              </span>
                            </td>
                            <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                              Rp{" "}
                              {(service.service_fee || 0).toLocaleString(
                                "id-ID",
                              )}
                            </td>
                            <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                              Rp{" "}
                              {(service.express_fee || 0).toLocaleString(
                                "id-ID",
                              )}
                            </td>
                            <td className="px-4 py-3 text-slate-500 text-xs">
                              {displayDate}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
