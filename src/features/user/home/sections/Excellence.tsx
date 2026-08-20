import { Clock, ShieldCheck, FileText, Headphones } from "lucide-react";
import { motion } from "framer-motion";

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
    <section id="keunggulan" className="py-24 bg-[#FDFBF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-12 items-center">
          
          {/* LEFT: Stats Cards */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-[#0A3222] rounded-[2.5rem] p-8 sm:p-12 text-white shadow-2xl shadow-emerald-900/10 flex flex-col justify-between"
          >
            <div className="mb-16">
              <h3 className="text-6xl sm:text-[5rem] font-extrabold tracking-tight mb-4">
                10+
              </h3>
              <p className="text-emerald-100/80 text-lg sm:text-xl font-medium max-w-sm">
                Tahun pengalaman melayani administrasi kendaraan
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#12412D] rounded-3xl p-6 sm:p-8">
                <h4 className="text-3xl sm:text-4xl font-bold mb-2">10rb+</h4>
                <p className="text-emerald-200/90 text-sm font-medium">Kendaraan Terlayani</p>
              </div>
              <div className="bg-[#12412D] rounded-3xl p-6 sm:p-8">
                <h4 className="text-3xl sm:text-4xl font-bold mb-2">99%</h4>
                <p className="text-emerald-200/90 text-sm font-medium">Kepuasan Pelanggan</p>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Text and Features */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="block text-emerald-800 text-xs font-bold tracking-widest uppercase mb-4">
              Mengapa Kami
            </span>
            <h2 className="text-3xl md:text-[2.5rem] font-extrabold text-slate-800 mb-6 leading-[1.15]">
              Solusi Cepat untuk Urusan Administrasi Kendaraan
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed mb-12">
              Kami mengerti bahwa waktu Anda berharga. Itulah sebabnya kami membangun proses yang efisien, aman, dan mudah diakses.
            </p>

            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-10">
              {features.map((item) => (
                <div key={item.title} className="flex flex-col sm:flex-row gap-4">
                  <div className=" shrink-0">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <item.icon className="w-5 h-5" strokeWidth={2.5} />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[17px] font-bold text-slate-800 mb-2">{item.title}</h4>
                    <p className="text-slate-500 text-[13px] leading-relaxed">
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
