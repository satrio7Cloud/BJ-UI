import { ArrowRight, CheckCircle2, Clock, Sparkles } from "lucide-react";
import hero from "../../../../assets/hero.png";

export default function Hero() {
  return (
    <section
      id="beranda"
      className="relative overflow-hidden text-slate-800 pt-20 sm:pt-24 pb-12 lg:pb-20"
    >
      {/* Ambient Background Gradient for Mobile & Desktop */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-linear-to-b from-emerald-100/50 via-emerald-50/20 to-transparent pointer-events-none -z-10 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-8 items-center">
          {/* LEFT CONTENT */}
          <div className="max-w-2xl text-left mx-auto lg:mx-0">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 mb-5 sm:mb-6 shadow-xs">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
              </span>
              <span className="text-xs sm:text-sm font-semibold text-emerald-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Layanan Cepat Online & Offline
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-3xl sm:text-5xl lg:text-[4rem] font-extrabold tracking-tight mb-4 sm:mb-6 leading-[1.15]">
              Urus Pajak Kendaraan <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-900 via-emerald-800 to-teal-700">
                Cepat, Aman, & Terpercaya
              </span>
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-lg text-slate-600 mb-6 sm:mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal">
              Perpanjang STNK tahunan, 5 tahunan, balik nama, hingga cetak KTL
              tanpa perlu antre berjam-jam. Dokumen diantar langsung ke rumah
              Anda.
            </p>

            {/* Buttons (Responsive Stack in Mobile, Row in Tablet/Desktop) */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-10 w-full sm:w-auto">
              <a
                href="#cek-pajak"
                className="group flex items-center justify-center gap-2 bg-emerald-900 text-white text-sm sm:text-base font-semibold px-6 sm:px-8 py-3.5 rounded-2xl sm:rounded-full hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-900/25 active:scale-[0.98]"
              >
                Cek Estimasi Pajak
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="#layanan"
                className="flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-200 text-sm sm:text-base font-semibold px-6 sm:px-8 py-3.5 rounded-2xl sm:rounded-full hover:bg-slate-50 transition-all shadow-xs active:scale-[0.98]"
              >
                Lihat Layanan
              </a>
            </div>

            {/* Features list (Compact Pills on Mobile) */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-slate-600 font-medium">
              <div className="flex items-center gap-1.5 bg-white/80 border border-slate-200/80 px-3 py-1.5 rounded-full shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Proses 1-3 Hari</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/80 border border-slate-200/80 px-3 py-1.5 rounded-full shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>10.000+ Pelanggan</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/80 border border-slate-200/80 px-3 py-1.5 rounded-full shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Garansi Dokumen Asli</span>
              </div>
            </div>
          </div>

          {/* RIGHT VISUAL */}
          <div className="relative mt-4 lg:mt-0">
            {/* Background decorative blob */}
            <div className="absolute inset-0 bg-linear-to-tr from-emerald-200/60 to-teal-100/40 rounded-3xl sm:rounded-[3rem] transform rotate-2 sm:rotate-3 scale-102 sm:scale-105 -z-10"></div>

            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl bg-white p-2 sm:p-4 border border-slate-100">
              <img
                src={hero}
                alt="Ilustrasi Pengurusan Kendaraan"
                className="relative w-full h-auto rounded-xl sm:rounded-2xl object-cover bg-slate-50"
              />
            </div>

            {/* Floating Badge (Adapted for Mobile & Desktop) */}
            <div className="relative mt-3 sm:mt-0 sm:absolute sm:-bottom-6 sm:-left-6 bg-white/95 backdrop-blur-md rounded-2xl p-3 sm:p-4 shadow-lg sm:shadow-xl shadow-slate-200/60 border border-slate-100 flex items-center gap-3 z-10">
              <div className="bg-emerald-50 p-2.5 rounded-xl shrink-0">
                <Clock className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-slate-800">
                  Pelayanan Cepat & Akurat
                </p>
                <p className="text-[11px] sm:text-xs text-slate-500">
                  Tracking real-time status pengurusan
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
