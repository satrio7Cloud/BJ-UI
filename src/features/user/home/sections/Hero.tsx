import { ArrowRight, CheckCircle2, Clock } from "lucide-react";
import hero from "../../../../assets/hero.png";

export default function Hero() {
    return (
        <section
            id="beranda"
            className="relative overflow-hidden text-slate-800 pt-24 pb-12 lg:pb-16"
        >
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 lg:gap-8 items-center">
                    {/* LEFT CONTENT */}
                    <div className="max-w-2xl text-left mx-auto lg:mx-0">
                        {/* Top Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50/80 border border-emerald-100 mb-6 lg:mb-8">
                            <div className="w-2 h-2 rounded-full bg-emerald-600"></div>
                            <span className="text-xs sm:text-sm font-semibold text-emerald-800">
                                Layanan Online & Offline
                            </span>
                        </div>

                        {/* Heading */}
                        <h1 className="text-4xl sm:text-5xl lg:text-[4rem] font-extrabold tracking-tight mb-6 leading-[1.1]">
                            Urus Pajak <br className="hidden lg:block" />
                            Kendaraan <span className="text-emerald-900">Cepat, <br className="hidden lg:block" /> Aman, Terpercaya</span>
                        </h1>

                        {/* Description */}
                        <p className="text-base sm:text-lg text-slate-500 mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
                            Perpanjang pajak motor, mobil, STNK, BPKB, dan berbagai kebutuhan administrasi kendaraan lainnya tanpa ribet. Didukung tenaga ahli berpengalaman.
                        </p>

                        {/* Buttons */}
                        <div className="flex flex-row flex-wrap justify-start gap-3 sm:gap-4 mb-10">
                            <a
                                href="#cek-pajak"
                                className="group flex items-center justify-center gap-2 bg-emerald-900 text-white text-sm sm:text-base font-semibold px-6 sm:px-8 py-3 sm:py-3.5 rounded-full hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-900/20"
                            >
                                Cek Estimasi Pajak
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </a>

                            <a
                                href="#layanan"
                                className="flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-200 text-sm sm:text-base font-semibold px-6 sm:px-8 py-3 sm:py-3.5 rounded-full hover:bg-slate-50 transition-all shadow-sm"
                            >
                                Lihat Layanan
                            </a>
                        </div>

                        {/* Features list */}
                        <div className="flex flex-wrap justify-start items-center gap-x-4 gap-y-2 sm:gap-6 text-[13px] sm:text-sm text-slate-500 font-medium">
                            <div className="flex items-center gap-1.5 sm:gap-2">
                                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                                <span>Proses 1-3 Hari</span>
                            </div>
                            <div className="flex items-center gap-1.5 sm:gap-2">
                                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                                <span>10.000+ Pelanggan</span>
                            </div>
                            <div className="flex items-center gap-1.5 sm:gap-2">
                                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                                <span>Garansi Dokumen</span>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT VISUAL */}
                    <div className="relative mt-12 lg:mt-0 px-4 sm:px-0">
                        {/* Background decorative blob */}
                        <div className="absolute inset-0 bg-emerald-100 rounded-[3rem] transform rotate-3 scale-105"></div>

                        <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-white p-2 sm:p-4">
                            <img
                                src={hero}
                                alt="Ilustrasi Pengurusan Kendaraan"
                                className="relative w-full h-auto rounded-2xl object-cover bg-slate-50"
                            />
                        </div>

                        {/* Floating Badge */}
                        <div className="hidden sm:flex absolute -bottom-6 -left-2 sm:-left-8 bg-white rounded-2xl p-4 shadow-xl shadow-slate-200/50 border border-slate-100 items-center gap-4 z-10 hover:-translate-y-1 transition-transform cursor-pointer">
                            <div className="bg-emerald-50 p-3 rounded-xl">
                                <Clock className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-800">Pelayanan Cepat</p>
                                <p className="text-xs text-slate-500">Tracking real-time status dokumen</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
