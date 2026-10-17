import { Car, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { type VehicleModel } from "../../../../api/vehicle";
import { type CheckoutFormData } from "../types";

interface VehicleDataCardProps {
  formData: CheckoutFormData;
  setFormData: React.Dispatch<React.SetStateAction<CheckoutFormData>>;
  models: VehicleModel[];
  prefill?: {
    jenisKendaraan?: string;
    nopol?: string;
    tahun?: string;
  };
}

export default function VehicleDataCard({
  formData,
  setFormData,
  models,
  prefill,
}: VehicleDataCardProps) {
  const [modelSearch, setModelSearch] = useState("");
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const modelDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modelDropdownRef.current &&
        !modelDropdownRef.current.contains(event.target as Node)
      ) {
        setIsModelDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
      <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <Car className="w-5 h-5 text-emerald-600" />
        Data Kendaraan Anda
      </h2>
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="sm:col-span-2 relative" ref={modelDropdownRef}>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Pilih Model Kendaraan
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Cari model kendaraan (contoh: Vario, Civic)..."
              value={modelSearch}
              onChange={(e) => {
                setModelSearch(e.target.value);
                setIsModelDropdownOpen(true);
                if (formData.model_id)
                  setFormData((prev) => ({ ...prev, model_id: "" }));
              }}
              onFocus={() => setIsModelDropdownOpen(true)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-slate-50 focus:bg-white"
            />
          </div>

          {isModelDropdownOpen && (
            <div className="absolute z-10 mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
              {models
                .filter(
                  (model) =>
                    !prefill?.jenisKendaraan ||
                    model.vehicle_type === prefill.jenisKendaraan,
                )
                .filter(
                  (model) =>
                    model.model_name
                      .toLowerCase()
                      .includes(modelSearch.toLowerCase()) ||
                    model.brand_name
                      ?.toLowerCase()
                      .includes(modelSearch.toLowerCase()),
                )
                .map((model) => (
                  <div
                    key={model.id}
                    className={`px-4 py-3 cursor-pointer hover:bg-emerald-50 transition-colors ${
                      formData.model_id === model.id
                        ? "bg-emerald-50 text-emerald-700 font-medium"
                        : "text-slate-700"
                    }`}
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, model_id: model.id }));
                      setModelSearch(
                        `${model.brand_name ? model.brand_name + " " : ""}${model.model_name}`,
                      );
                      setIsModelDropdownOpen(false);
                    }}
                  >
                    {model.brand_name ? `${model.brand_name} ` : ""}
                    {model.model_name}{" "}
                    <span className="text-xs text-slate-400 ml-1">
                      ({model.vehicle_type === "mobil" ? "Mobil" : "Motor"})
                    </span>
                  </div>
                ))}
              {models
                .filter(
                  (model) =>
                    !prefill?.jenisKendaraan ||
                    model.vehicle_type === prefill.jenisKendaraan,
                )
                .filter(
                  (model) =>
                    model.model_name
                      .toLowerCase()
                      .includes(modelSearch.toLowerCase()) ||
                    model.brand_name
                      ?.toLowerCase()
                      .includes(modelSearch.toLowerCase()),
                ).length === 0 && (
                <div className="px-4 py-4 text-sm text-slate-500 text-center">
                  Model kendaraan tidak ditemukan
                </div>
              )}
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Plat Nomor (Nopol)
          </label>
          <input
            type="text"
            placeholder="Contoh: B 1234 ABC"
            value={formData.plate_number}
            disabled={!!prefill?.nopol}
            onChange={(e) => {
              const value = e.target.value
                .toUpperCase()
                .replace(/[^A-Z0-9 ]/g, "");

              setFormData((prev) => ({
                ...prev,
                plate_number: value,
              }));
            }}
            maxLength={10}
            className={`w-full px-4 py-3 rounded-xl border border-slate-200 outline-none transition-all ${
              prefill?.nopol
                ? "bg-slate-100 text-slate-500 cursor-not-allowed"
                : "bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            }`}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Tahun Pembuatan
          </label>
          <input
            type="number"
            placeholder="Contoh: 2018"
            value={formData.year}
            disabled={!!prefill?.tahun}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, year: e.target.value }))
            }
            className={`w-full px-4 py-3 rounded-xl border border-slate-200 outline-none transition-all ${
              prefill?.tahun
                ? "bg-slate-100 text-slate-500 cursor-not-allowed"
                : "bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            }`}
          />
        </div>
      </div>
    </div>
  );
}
