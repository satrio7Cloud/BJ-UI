import { motion } from "framer-motion";
import { Clock, FileText, Headphones, ShieldCheck } from "lucide-react";

const features = [
    {
        icon: Clock,
        title: "Hemat Waktu",
        desc: "Tidak perlu antre berjam-jam. Serahkan urusan administrasi pada tim kami.",
    },
    {
        icon: ShieldCheck,
        title: "Aman & Legal",
        desc: "Seluruh proses mengikuti prosedur resmi dan terjamin keabsahan dokumennya.",
    },
    {
        icon: FileText,
        title: "Transparan",
        desc: "Harga jelas, tanpa biaya tersembunyi. Anda dapat melacak status kapan saja.",
    },
    {
        icon: Headphones,
        title: "Dukungan Pribadi",
        desc: "Customer service responsif siap membantu dari konsultasi hingga selesai.",
    },
];

export default function Excellence() {
    return (
        <section id="keunggulan" className="py-12 sm:py-20 lg:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">

                    {/* LEFT: Stats Cards */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-[#0A3222] rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-10 lg:p-12 text-white shadow-2xl shadow-emerald-900/15 flex flex-col justify-between"
                    >
                        <div className="mb-8 sm:mb-12">
                            <span className="text-emerald-300 text-xs font-bold uppercase tracking-wider block mb-2">
                                Rekam Jejak
                            </span>
                            <h3 className="text-4xl sm:text-6xl lg:text-[4.5rem] font-black tracking-tight mb-2 sm:mb-4">
                                10+ <span className="text-emerald-400 text-2xl sm:text-4xl font-bold">Tahun</span>
                            </h3>
                            <p className="text-emerald-100/80 text-sm sm:text-lg font-normal max-w-sm">
                                Pengalaman terpercaya melayani legalitas & administrasi kendaraan di Indonesia.
                            </p>
                        </div>

                        {/* 2-Cols in Mobile for Compact Stats */}
                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                            <div className="bg-[#12412D] rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-emerald-800/40">
                                <h4 className="text-2xl sm:text-4xl font-black mb-1 text-emerald-300">10rb+</h4>
                                <p className="text-emerald-100/80 text-xs sm:text-sm font-medium">Kendaraan Terlayani</p>
                            </div>
                            <div className="bg-[#12412D] rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-emerald-800/40">
                                <h4 className="text-2xl sm:text-4xl font-black mb-1 text-emerald-300">99%</h4>
                                <p className="text-emerald-100/80 text-xs sm:text-sm font-medium">Kepuasan Pelanggan</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* RIGHT: Text and Features */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="inline-block text-emerald-800 text-xs font-bold tracking-widest uppercase mb-3 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100">
                            Mengapa Kami
                        </span>
                        <h2 className="text-2xl sm:text-3xl md:text-[2.5rem] font-extrabold text-slate-800 mb-4 sm:mb-6 leading-tight">
                            Solusi Cepat untuk Urusan Administrasi Kendaraan
                        </h2>
                        <p className="text-slate-600 text-sm sm:text-base lg:text-lg leading-relaxed mb-8 sm:mb-10">
                            Kami mengerti bahwa waktu Anda berharga. Itulah sebabnya kami membangun sistem pengurusan yang efisien, transparan, dan mudah dipantau kapan saja.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            {features.map((item) => (
                                <div
                                    key={item.title}
                                    className="flex items-start gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-white sm:bg-transparent border border-slate-100 sm:border-none shadow-xs sm:shadow-none"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center shrink-0">
                                        <item.icon className="w-5 h-5" strokeWidth={2.5} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm sm:text-base font-bold text-slate-800 mb-1">{item.title}</h4>
                                        <p className="text-slate-500 text-xs leading-relaxed">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
