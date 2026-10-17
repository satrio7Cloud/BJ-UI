import { Car, Layers, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { getBrands, type Brand } from "../../../api/vehicle";
import BrandTab from "./components/BrandTab";
import ModelTab from "./components/ModelTab";
import ServiceTab from "./components/ServiceTab";

export default function VehiclesPage() {
  const [activeTab, setActiveTab] = useState<"brands" | "models" | "services">(
    "brands",
  );

  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoadingBrands, setIsLoadingBrands] = useState(false);

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

  useEffect(() => {
    fetchBrandsData();
  }, []);

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
      </div>

      {/* Tabs Header */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 transition-colors">
        <button
          onClick={() => setActiveTab("brands")}
          className={`flex items-center gap-2 py-3 px-4 font-medium text-sm border-b-2 transition-all -mb-0.5 cursor-pointer ${
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
          className={`flex items-center gap-2 py-3 px-4 font-medium text-sm border-b-2 transition-all -mb-0.5 cursor-pointer ${
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
          className={`flex items-center gap-2 py-3 px-4 font-medium text-sm border-b-2 transition-all -mb-0.5 cursor-pointer ${
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
        {activeTab === "brands" && (
          <BrandTab
            brands={brands}
            isLoadingBrands={isLoadingBrands}
            onRefreshBrands={fetchBrandsData}
          />
        )}
        {activeTab === "models" && <ModelTab brands={brands} />}
        {activeTab === "services" && <ServiceTab />}
      </div>
    </div>
  );
}
