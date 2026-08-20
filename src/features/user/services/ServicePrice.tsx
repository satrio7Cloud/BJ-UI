import { ArrowRight, Receipt, Sparkles, ShieldCheck, Clock } from "lucide-react";

interface Props {
  onOpenServices: () => void;
}

export default function ServicePrice({ onOpenServices }: Props) {
  return (
    <section className="relative py-24 overflow-hidden bg-slate-900">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/20 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold tracking-wide uppercase mb-6 shadow-sm">
          <Sparkles size={16} />
          Transparan & Terjangkau
        </div>
        
        <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-6">
          Daftar Harga Layanan <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
            DTerazz Biro Jasa
          </span>
        </h2>

        <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Pilih layanan sesuai kebutuhan Anda. Kami menyediakan berbagai pengurusan dokumen kendaraan dengan proses yang cepat, aman, dan harga yang sepenuhnya transparan.
        </p>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/60 rounded-xl border border-slate-700 text-slate-200 text-sm font-medium backdrop-blur-sm">
            <ShieldCheck size={18} className="text-emerald-400" />
            Tanpa Biaya Tersembunyi
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/60 rounded-xl border border-slate-700 text-slate-200 text-sm font-medium backdrop-blur-sm">
            <Clock size={18} className="text-emerald-400" />
            Tersedia Paket Express
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/60 rounded-xl border border-slate-700 text-slate-200 text-sm font-medium backdrop-blur-sm">
            <Receipt size={18} className="text-emerald-400" />
            Invoice Otomatis
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={onOpenServices}
          className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-extrabold text-lg rounded-2xl shadow-[0_0_40px_-10px_rgba(16,185,129,0.4)] hover:shadow-[0_0_60px_-15px_rgba(16,185,129,0.6)] transition-all duration-300 cursor-pointer overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
          <span className="relative z-10">Lihat Semua Layanan & Harga</span>
          <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </section>
  );
}
