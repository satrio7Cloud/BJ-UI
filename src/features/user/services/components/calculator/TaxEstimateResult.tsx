import { AlertCircle, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import Button from "../../../../../shared/components/Button";
import type { CalculatorFormData } from "./TaxCalculatorForm";

export interface CalculatedResult {
  pkb: number;
  swdkllj: number;
  biayaJasa: number;
  adminFee: number;
  physicalCheckFee: number;
  totalEstimasi: number;
  isValidated: boolean;
}

interface Props {
  calculatedResult: CalculatedResult | null;
  formData: CalculatorFormData;
  onProceedToCheckout: () => void;
}

export default function TaxEstimateResult({
  calculatedResult,
  formData,
  onProceedToCheckout,
}: Props) {
  return (
    <div className="lg:col-span-5">
      <div className="bg-slate-900 rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-white shadow-2xl sticky top-24 border border-slate-800">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 sm:pb-5 mb-5 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-extrabold flex items-center gap-2">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
            Hasil Estimasi Biaya
          </h3>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-full">
            Transparan
          </span>
        </div>

        {calculatedResult ? (
          <div className="space-y-6">
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-start gap-3 text-emerald-300 text-xs leading-relaxed">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm text-emerald-200">
                  Validasi Data Berhasil!
                </p>
                <p className="mt-0.5 text-slate-300">
                  Plat: <b>{formData.nopol}</b> | NIK: <b>{formData.nik}</b>
                </p>
              </div>
            </div>

            {/* Breakdown List */}
            <div className="space-y-3 border-b border-slate-800 pb-5 text-sm">
              <div className="flex justify-between items-center text-slate-300">
                <span>PKB (Pajak Pokok STNK)</span>
                <span className="font-bold text-white">
                  Rp {calculatedResult.pkb.toLocaleString("id-ID")}
                </span>
              </div>

              <div className="flex justify-between items-center text-slate-300">
                <div className="flex items-center gap-1.5">
                  <span>SWDKLLJ</span>
                  <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">
                    {formData.jenisKendaraan === "motor" ? "Motor" : "Mobil"}
                  </span>
                </div>
                <span className="font-bold text-white">
                  Rp {calculatedResult.swdkllj.toLocaleString("id-ID")}
                </span>
              </div>

              <div className="flex justify-between items-center text-slate-300">
                <span>Biaya Jasa</span>
                <span className="font-bold text-white">
                  Rp {calculatedResult.biayaJasa.toLocaleString("id-ID")}
                </span>
              </div>

              {calculatedResult.adminFee > 0 && (
                <div className="flex justify-between items-center text-slate-300">
                  <span>Biaya Admin</span>
                  <span className="font-bold text-white">
                    Rp {calculatedResult.adminFee.toLocaleString("id-ID")}
                  </span>
                </div>
              )}

              {calculatedResult.physicalCheckFee > 0 && (
                <div className="flex justify-between items-center text-slate-300">
                  <span>Biaya Cek Fisik</span>
                  <span className="font-bold text-white">
                    Rp {calculatedResult.physicalCheckFee.toLocaleString("id-ID")}
                  </span>
                </div>
              )}
            </div>

            {/* Total Highlight */}
            <div className="pt-2">
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
                Total Estimasi Keseluruhan
              </p>
              <p className="text-4xl font-extrabold text-emerald-400 tracking-tight">
                Rp {calculatedResult.totalEstimasi.toLocaleString("id-ID")}
              </p>
              <p className="text-[11px] text-slate-400 mt-2">
                * Estimasi dapat menyesuaikan jika ada denda keterlambatan pajak dari Samsat.
              </p>
            </div>

            <Button
              variant="secondary"
              size="full"
              onClick={onProceedToCheckout}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20 text-lg cursor-pointer"
            >
              <span>Lanjutkan Pemesanan Layanan</span>
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        ) : (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div>
              <h4 className="font-bold text-slate-300">Belum Ada Kalkulasi</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
                Isi form harga pajak STNK, Nopol, Tahun, dan NIK di sebelah kiri untuk melihat rincian biaya.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

