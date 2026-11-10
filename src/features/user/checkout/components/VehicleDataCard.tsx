import { AlertCircle, Car, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { type VehicleModel } from "../../../../api/vehicle";
import { type CheckoutFormData, type FormErrors } from "../types";

interface VehicleDataCardProps {
  formData: CheckoutFormData;
  setFormData: React.Dispatch<React.SetStateAction<CheckoutFormData>>;
  models: VehicleModel[];
  prefill?: {
    jenisKendaraan?: string;
    nopol?: string;
    tahun?: string;
  };
  errors?: FormErrors;
  onClearError?: (field: keyof FormErrors) => void;
}

export default function VehicleDataCard({
  formData,
  setFormData,
  models,
  prefill,
  errors = {},
  onClearError,
}: VehicleDataCardProps) {
  const [modelSearch, setModelSearch] = useState("");
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const modelDropdownRef = useRef<HTMLDivElement>(null);

  // Sinkronkan text search dengan model terpilih jika sudah ada
  useEffect(() => {
    if (formData.model_id && models.length > 0) {
      const selected = models.find((m) => m.id === formData.model_id);
      if (selected && !modelSearch) {
        setModelSearch(
          `${selected.brand_name ? selected.brand_name + " " : ""}${selected.model_name}`
        );
      }
    }
  }, [formData.model_id, models, modelSearch]);

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
        {/* Pilih Model */}
        <div className="sm:col-span-2 relative" ref={modelDropdownRef}>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Pilih Model Kendaraan <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Cari model kendaraan (contoh: Vario, Civic, Avanza)..."
              value={modelSearch}
              onChange={(e) => {
                setModelSearch(e.target.value);
                setIsModelDropdownOpen(true);
                if (formData.model_id) {
                  setFormData((prev) => ({ ...prev, model_id: "" }));
                }
                if (onClearError) onClearError("model_id");
              }}
              onFocus={() => setIsModelDropdownOpen(true)}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none transition-all ${
                errors.model_id
                  ? "border-rose-400 bg-rose-50/50 focus:ring-2 focus:ring-rose-400 focus:bg-white"
                  : "border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              }`}
            />
          </div>

          {errors.model_id && (
            <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {errors.model_id}
            </p>
          )}

          {isModelDropdownOpen && (
            <div className="absolute z-20 mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
              {models
                .filter(
                  (model) =>
                    !prefill?.jenisKendaraan ||
                    model.vehicle_type === prefill.jenisKendaraan
                )
                .filter(
                  (model) =>
                    model.model_name
                      .toLowerCase()
                      .includes(modelSearch.toLowerCase()) ||
                    model.brand_name
                      ?.toLowerCase()
                      .includes(modelSearch.toLowerCase())
                )
                .map((model) => (
                  <div
                    key={model.id}
                    className={`px-4 py-3 cursor-pointer hover:bg-emerald-50 transition-colors border-b border-slate-50 last:border-0 ${
                      formData.model_id === model.id
                        ? "bg-emerald-50 text-emerald-700 font-semibold"
                        : "text-slate-700"
                    }`}
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, model_id: model.id }));
                      setModelSearch(
                        `${model.brand_name ? model.brand_name + " " : ""}${model.model_name}`
                      );
                      setIsModelDropdownOpen(false);
                      if (onClearError) onClearError("model_id");
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span>
                        {model.brand_name && (
                          <span className="font-bold text-slate-900 mr-1.5">
                            {model.brand_name}
                          </span>
                        )}
                        {model.model_name}
                      </span>
                      <span className="text-xs uppercase bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-mono">
                        {model.vehicle_type}
                      </span>
                    </div>
                  </div>
                ))}
              {models.length === 0 && (
                <div className="p-4 text-center text-sm text-slate-500">
                  Memuat data model kendaraan...
                </div>
              )}
            </div>
          )}
        </div>

        {/* Plat Nomor */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Nomor Polisi (Plat Nomor) <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Contoh: B 1234 ABC"
            value={formData.plate_number}
            onChange={(e) => {
              const val = e.target.value.toUpperCase();
              setFormData((prev) => ({ ...prev, plate_number: val }));
              if (onClearError) onClearError("plate_number");
            }}
            className={`w-full px-4 py-3 rounded-xl border outline-none font-mono uppercase font-bold tracking-wider transition-all ${
              errors.plate_number
                ? "border-rose-400 bg-rose-50/50 focus:ring-2 focus:ring-rose-400 focus:bg-white text-rose-900"
                : "border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900"
            }`}
          />
          {errors.plate_number ? (
            <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {errors.plate_number}
            </p>
          ) : (
            <p className="text-[11px] text-slate-400 mt-1">
              Gunakan spasi antar blok, contoh: B 1234 ABC
            </p>
          )}
        </div>

        {/* Tahun Pembuatan */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Tahun Pembuatan <span className="text-rose-500">*</span>
          </label>
          <input
            type="number"
            placeholder="Contoh: 2021"
            min="1900"
            max={new Date().getFullYear() + 1}
            value={formData.year}
            onChange={(e) => {
              const val = e.target.value;
              setFormData((prev) => ({ ...prev, year: val }));
              if (onClearError) onClearError("year");
            }}
            className={`w-full px-4 py-3 rounded-xl border outline-none transition-all font-mono font-semibold ${
              errors.year
                ? "border-rose-400 bg-rose-50/50 focus:ring-2 focus:ring-rose-400 focus:bg-white"
                : "border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            }`}
          />
          {errors.year && (
            <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {errors.year}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
