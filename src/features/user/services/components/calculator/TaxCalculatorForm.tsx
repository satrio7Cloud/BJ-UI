import { Calculator, Car, FileText, HelpCircle } from "lucide-react";
import React from "react";
import type { ApiService } from "../../../../../api/services";
import Button from "../../../../../shared/components/Button";
import DocumentRequirementBox from "./DocumentRequirementBox";

export interface CalculatorFormData {
  pajakStnk: string;
  nopol: string;
  tahunKendaraan: string;
  nik: string;
  jenisKendaraan: "motor" | "mobil";
  serviceId: string;
}

export interface NopolParts {
  p1: string;
  p2: string;
  p3: string;
}

interface Props {
  formData: CalculatorFormData;
  setFormData: React.Dispatch<React.SetStateAction<CalculatorFormData>>;
  nopolParts: NopolParts;
  setNopolParts: React.Dispatch<React.SetStateAction<NopolParts>>;
  services: ApiService[];
  loadingServices: boolean;
  isCalculating: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export default function TaxCalculatorForm({
  formData,
  setFormData,
  nopolParts,
  setNopolParts,
  services,
  loadingServices,
  isCalculating,
  onSubmit,
}: Props) {
  const selectedService = services.find((s) => s.id === formData.serviceId);

  return (
    <div className="lg:col-span-7 bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-slate-200/80 shadow-xl shadow-slate-200/50 relative">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 sm:pb-5 mb-5 sm:mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl sm:rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base sm:text-lg">
              Estimasi Pajak Kendaraan
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-500">
              Masukkan nilai sesuai lembar pajak STNK Anda
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-flex text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Estimasi Biaya
        </span>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        {/* Jenis Kendaraan Toggle */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
            Jenis Kendaraan
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  jenisKendaraan: "motor",
                  serviceId: "",
                }))
              }
              className={`py-3 px-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                formData.jenisKendaraan === "motor"
                  ? "bg-emerald-900 text-white border-emerald-900 shadow-md shadow-emerald-900/20"
                  : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <Car className="w-4 h-4" />
              Sepeda Motor
            </button>
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  jenisKendaraan: "mobil",
                  serviceId: "",
                }))
              }
              className={`py-3 px-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                formData.jenisKendaraan === "mobil"
                  ? "bg-emerald-900 text-white border-emerald-900 shadow-md shadow-emerald-900/20"
                  : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <Car className="w-4 h-4" />
              Mobil / Roda 4
            </button>
          </div>
        </div>

        {/* Tipe Layanan Dinamis */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
            Tipe Pengurusan Pajak
          </label>
          {loadingServices ? (
            <div className="grid grid-cols-2 gap-2 animate-pulse">
              <div className="h-10 bg-slate-200 rounded-xl"></div>
              <div className="h-10 bg-slate-200 rounded-xl"></div>
              <div className="h-10 bg-slate-200 rounded-xl"></div>
              <div className="h-10 bg-slate-200 rounded-xl"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {services
                .filter((s) => {
                  const name = s.service_name.toLowerCase();
                  if (formData.jenisKendaraan === "mobil") {
                    return !name.includes("motor");
                  } else {
                    return !name.includes("mobil");
                  }
                })
                .map((s) => {
                  const cleanLabel = s.service_name
                    .replace(/Mobil/gi, "")
                    .replace(/Motor/gi, "")
                    .replace(/\(MOTOR & MOBIL\)/gi, "")
                    .trim();

                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, serviceId: s.id }))
                      }
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer border text-left flex items-center min-h-11 leading-tight ${
                        formData.serviceId === s.id
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {cleanLabel}
                    </button>
                  );
                })}
            </div>
          )}
        </div>

        {/* Info Box untuk Balik Nama / Mutasi */}
        <DocumentRequirementBox selectedService={selectedService} />

        {/* Main Input: Harga Pajak Tahunan STNK */}
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-amber-900 uppercase tracking-wide">
              Harga Pajak Tahunan di STNK (PKB Pokok) *
            </label>
            <div className="group relative cursor-pointer">
              <HelpCircle className="w-4 h-4 text-amber-600" />
              <div className="absolute bottom-full right-0 mb-2 w-64 p-3 bg-slate-900 text-white text-xs rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30">
                Lihat di lembar Pajak STNK pada kolom <b>PKB Pokok</b> (biasanya
                di sisi kanan atas lembar STNK).
              </div>
            </div>
          </div>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center font-bold text-slate-500 text-sm">
              Rp
            </span>
            <input
              type="text"
              placeholder="Contoh: 350.000"
              value={formData.pajakStnk}
              onChange={(e) => {
                const raw = e.target.value.replace(/\D/g, "");
                const formatted = raw
                  ? parseInt(raw, 10).toLocaleString("id-ID")
                  : "";
                setFormData((prev) => ({ ...prev, pajakStnk: formatted }));
              }}
              className="w-full pl-12 pr-4 py-3 bg-white border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-slate-900 font-extrabold text-lg"
            />
          </div>
        </div>

        {/* Grid 3 Columns: Nopol (span 2) & Tahun (span 1) */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Nomor Polisi (Nopol) *
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="B"
                value={nopolParts.p1}
                maxLength={2}
                onChange={(e) => {
                  const val = e.target.value
                    .replace(/[^A-Za-z]/g, "")
                    .toUpperCase();
                  const newParts = { ...nopolParts, p1: val };
                  setNopolParts(newParts);
                  setFormData((prev) => ({
                    ...prev,
                    nopol: `${newParts.p1} ${newParts.p2} ${newParts.p3}`
                      .trim()
                      .replace(/\s+/g, " "),
                  }));
                }}
                className="w-16 px-2 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none text-slate-900 font-bold uppercase text-center text-sm"
              />
              <span className="text-slate-400 font-bold">-</span>
              <input
                type="text"
                placeholder="1234"
                value={nopolParts.p2}
                maxLength={4}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, "");
                  const newParts = { ...nopolParts, p2: val };
                  setNopolParts(newParts);
                  setFormData((prev) => ({
                    ...prev,
                    nopol: `${newParts.p1} ${newParts.p2} ${newParts.p3}`
                      .trim()
                      .replace(/\s+/g, " "),
                  }));
                }}
                className="flex-1 px-2 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none text-slate-900 font-bold uppercase text-center text-sm tracking-widest"
              />
              <span className="text-slate-400 font-bold">-</span>
              <input
                type="text"
                placeholder="ABC"
                value={nopolParts.p3}
                maxLength={3}
                onChange={(e) => {
                  const val = e.target.value
                    .replace(/[^A-Za-z]/g, "")
                    .toUpperCase();
                  const newParts = { ...nopolParts, p3: val };
                  setNopolParts(newParts);
                  setFormData((prev) => ({
                    ...prev,
                    nopol: `${newParts.p1} ${newParts.p2} ${newParts.p3}`
                      .trim()
                      .replace(/\s+/g, " "),
                  }));
                }}
                className="w-20 px-2 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none text-slate-900 font-bold uppercase text-center text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Tahun Kendaraan *
            </label>
            <select
              value={formData.tahunKendaraan}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  tahunKendaraan: e.target.value,
                }))
              }
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none text-slate-900 font-semibold text-sm cursor-pointer"
            >
              <option value="" disabled>
                Pilih Tahun
              </option>
              {Array.from(
                { length: new Date().getFullYear() - 1989 },
                (_, i) => new Date().getFullYear() - i,
              ).map((year) => (
                <option key={year} value={year.toString()}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Validasi Tambahan: NIK */}
        <div className="pt-2 border-t border-slate-100 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              NIK / Nomor KTP Pemilik *
            </label>
            <input
              type="text"
              maxLength={16}
              placeholder="16 Digit NIK KTP"
              value={formData.nik}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 16);
                setFormData((prev) => ({ ...prev, nik: val }));
              }}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none text-slate-900 text-sm font-mono"
            />
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="full"
          isLoading={isCalculating}
          className="bg-emerald-900 hover:bg-emerald-800 text-lg mt-4 cursor-pointer"
        >
          <Calculator className="w-5 h-5" />
          Hitung Estimasi Biaya Pajak
        </Button>
      </form>
    </div>
  );
}
