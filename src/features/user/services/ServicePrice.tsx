import {
    ArrowRight,
    Clock,
    Receipt,
    ShieldCheck,
    Sparkles,
} from "lucide-react";
import Button from "../../../shared/components/Button";

interface Props {
  onOpenServices: () => void;
}

export default function ServicePrice({ onOpenServices }: Props) {
  return (
    <section className="relative py-12 sm:py-20 lg:py-24 overflow-hidden bg-transparent">
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-bold tracking-wide uppercase mb-4 sm:mb-6 shadow-xs">
          <Sparkles size={15} />
          Transparan & Terjangkau
        </div>

        <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight mb-4 sm:mb-6 leading-tight">
          Daftar Harga Layanan <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-900 to-teal-700">
            Urus Kendaraan
          </span>
        </h2>

        <p className="text-slate-600 text-sm sm:text-lg max-w-2xl mx-auto mb-6 sm:mb-10 leading-relaxed">
          Pilih layanan sesuai kebutuhan Anda. Kami menyediakan berbagai pengurusan dokumen kendaraan dengan proses cepat, legal, dan harga transparan.
        </p>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8 sm:mb-12">
          <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white rounded-full border border-slate-200 text-slate-700 text-xs sm:text-sm font-medium shadow-xs">
            <ShieldCheck size={16} className="text-emerald-600" />
            Tanpa Biaya Tersembunyi
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white rounded-full border border-slate-200 text-slate-700 text-xs sm:text-sm font-medium shadow-xs">
            <Clock size={16} className="text-emerald-600" />
            Tersedia Paket Express
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white rounded-full border border-slate-200 text-slate-700 text-xs sm:text-sm font-medium shadow-xs">
            <Receipt size={16} className="text-emerald-600" />
            Invoice Otomatis
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex justify-center">
          <Button
            onClick={onOpenServices}
            variant="primary"
            size="lg"
            className="w-full sm:w-auto py-3.5 sm:py-4 px-8 text-base sm:text-lg font-bold bg-emerald-900 hover:bg-emerald-800 text-white rounded-2xl sm:rounded-full shadow-lg shadow-emerald-900/25 active:scale-[0.98] cursor-pointer"
          >
            <span>Lihat Semua Layanan & Harga</span>
            <ArrowRight size={18} className="ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}
