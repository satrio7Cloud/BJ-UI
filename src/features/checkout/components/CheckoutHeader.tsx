import { Sparkles, ShieldCheck, Clock } from "lucide-react";

interface CheckoutHeaderProps {
    serviceName: string;
    pkg: string;
}

export default function CheckoutHeader({ serviceName, pkg }: CheckoutHeaderProps) {
    return (
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-emerald-950 via-[#004d34] to-emerald-900 p-8 md:p-10 text-white shadow-2xl mb-8 border border-emerald-800/50">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>
            
            <div className="relative z-10 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider mb-5 shadow-inner">
                    <Sparkles className="w-4 h-4 text-emerald-300" />
                    <span className="text-emerald-50">Langkah Terakhir</span>
                </div>
                
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight text-white drop-shadow-sm">
                    Selesaikan Pesanan Anda
                </h1>
                
                <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed max-w-2xl mb-8">
                    Anda selangkah lagi menikmati kemudahan pengurusan <strong className="text-white font-extrabold px-1">{serviceName}</strong> menggunakan paket layanan <strong className="text-emerald-300 uppercase tracking-wide font-extrabold">{pkg}</strong> kami. Harap lengkapi data di bawah ini untuk melanjutkan.
                </p>

                <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2.5 bg-black/20 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 shadow-lg">
                        <ShieldCheck className="w-5 h-5 text-emerald-400" />
                        <span className="text-sm font-semibold text-slate-100">100% Data Aman</span>
                    </div>
                    <div className="flex items-center gap-2.5 bg-black/20 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 shadow-lg">
                        <Clock className="w-5 h-5 text-teal-400" />
                        <span className="text-sm font-semibold text-slate-100">Proses Cepat & Transparan</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
