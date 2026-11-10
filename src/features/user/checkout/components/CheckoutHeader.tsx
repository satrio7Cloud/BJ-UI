import {
  BadgeCheck,
  CheckCircle2,
  FileCheck2,
  ShieldCheck,
  Sparkles,
  Truck,
  Zap,
} from "lucide-react";
import { type CheckoutData, type CheckoutStep } from "../types";

interface CheckoutHeaderProps {
  serviceName: string;
  pkg: string;
  step?: CheckoutStep;
  onStepChange?: (step: CheckoutStep) => void;
  checkoutData?: CheckoutData;
}

export default function CheckoutHeader({
  serviceName,
  pkg,
  step = 1,
  onStepChange,
  checkoutData,
}: CheckoutHeaderProps) {
  const isExpress = pkg.toLowerCase() === "express";

  return (
    <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-slate-950 via-[#022c22] to-emerald-950 p-6 sm:p-8 md:p-10 text-white shadow-2xl mb-8 border border-emerald-500/30">
      {/* Ambient Lighting & Glow Orbs */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/25 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none"></div>

      {/* Decorative Grid Mesh */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] bg-size-[16px_16px]"
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
        {/* Kolom Kiri: Header, Headline, dan Value Points */}
        <div className="flex-1 max-w-3xl space-y-5">
          {/* Top Bar: Mini Badge & Modern Stepper */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 backdrop-blur-md text-[11px] font-extrabold uppercase tracking-widest text-emerald-300 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300 animate-spin-slow" />
              <span>Layanan Pengurusan Dokumen Resmi</span>
            </div>

            {/* Stepper Progress Modern */}
            <div className="inline-flex items-center p-1 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 shadow-inner">
              <button
                type="button"
                onClick={() => {
                  if (step !== 3 && onStepChange) onStepChange(1);
                }}
                disabled={step === 3}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  step === 1
                    ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30"
                    : step > 1
                    ? "text-emerald-300 hover:text-white cursor-pointer"
                    : "text-slate-400"
                }`}
              >
                {step > 1 ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <span className="w-4 h-4 rounded-full bg-white/20 text-white text-[10px] flex items-center justify-center font-black">
                    1
                  </span>
                )}
                <span>1. Formulir Data</span>
              </button>

              <div className="w-3 h-1px bg-white/20 mx-0.5"></div>

              <button
                type="button"
                onClick={() => {
                  if (step === 2 && onStepChange) onStepChange(2);
                }}
                disabled={step !== 2}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  step === 2
                    ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30"
                    : step > 2
                    ? "text-emerald-300"
                    : "text-slate-400/80"
                }`}
              >
                {step > 2 ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <span className="w-4 h-4 rounded-full bg-white/15 text-white text-[10px] flex items-center justify-center font-black">
                    2
                  </span>
                )}
                <span>2. Tinjau</span>
              </button>

              <div className="w-3 h-1px bg-white/20 mx-0.5"></div>

              <div
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  step === 3
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                    : "text-slate-400/80"
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-white/15 text-white text-[10px] flex items-center justify-center font-black">
                  3
                </span>
                <span>3. Pembayaran</span>
              </div>
            </div>
          </div>

          {/* Main Title */}
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              {step === 1 ? (
                <>
                  Selesaikan Pesanan{" "}
                  <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-300 via-teal-200 to-white">
                    Anda
                  </span>
                </>
              ) : step === 2 ? (
                <>
                  Tinjau Ringkasan{" "}
                  <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-300 via-teal-200 to-white">
                    Pesanan Anda
                  </span>
                </>
              ) : (
                <>
                  Pembayaran Tagihan{" "}
                  <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-300 via-indigo-200 to-white">
                    Resmi &amp; Aman
                  </span>
                </>
              )}
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mt-2.5 max-w-2xl">
              {step === 1 ? (
                <>
                  Silakan lengkapi formulir identitas, data kendaraan, dan
                  tentukan metode serah terima berkas fisik untuk pengurusan
                  dokumen Anda.
                </>
              ) : step === 2 ? (
                <>
                  Pastikan seluruh data pemesan, nomor plat kendaraan, alamat,
                  serta rincian opsi logistik telah sesuai sebelum pesanan resmi
                  diterbitkan.
                </>
              ) : (
                <>
                  Selesaikan pembayaran tagihan pesanan Anda melalui kanal pembayaran online
                  (QRIS, Virtual Account Bank, atau E-Wallet) untuk segera kami proses.
                </>
              )}
            </p>
          </div>

          {/* Service & Package Pills */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-white shadow-xs">
              <FileCheck2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{serviceName}</span>
            </div>

            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider border shadow-xs ${
                isExpress
                  ? "bg-amber-500/20 text-amber-300 border-amber-400/40"
                  : "bg-emerald-500/20 text-emerald-300 border-emerald-400/40"
              }`}
            >
              {isExpress ? (
                <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              ) : (
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              )}
              <span>Paket {pkg}</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-300 text-xs font-semibold">
              <Truck className="w-3.5 h-3.5 text-teal-400" />
              <span>Logistik Terintegrasi</span>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">
                  100% Berkas Terjamin
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  Asli, aman & tersegel rapi
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center shrink-0">
                <BadgeCheck className="w-4 h-4 text-teal-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">
                  Biro Jasa Terpercaya
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  Proses sah Samsat resmi
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4 text-blue-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">
                  Tanpa Ribet Antre
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  Hemat waktu & tenaga
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Quick Preview Info Card (Desktop Only / Large) */}
        {checkoutData && (
          <div className="hidden lg:block w-72 shrink-0">
            <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between pb-2 border-b border-white/15">
                <span className="text-[11px] uppercase tracking-wider font-extrabold text-emerald-300">
                  Ringkasan Paket
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-400/30">
                  {pkg.toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-[11px] text-slate-300">Biaya Layanan:</p>
                <p className="font-black text-xl text-white">
                  Rp {checkoutData.price.toLocaleString("id-ID")}
                </p>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-3">
                {checkoutData.service.description ||
                  "Pengurusan dokumen kendaraan bermotor resmi, aman dan terpercaya."}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
