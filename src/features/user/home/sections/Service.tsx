import { motion } from "framer-motion";
import {
  Car,
  Bike,
  FileText,
  ClipboardCheck,
  LayoutGrid,
  Headphones,
  ArrowRight,
} from "lucide-react";

const services = [
  {
    icon: Car,
    title: "Perpanjang Pajak Mobil",
    description: "Pajak tahunan dan 5 tahunan mobil dengan proses lengkap tanpa perlu antre lama.",
  },
  {
    icon: Bike,
    title: "Perpanjang Pajak Motor",
    description: "Layanan cepat untuk segala jenis motor, dari pajak tahunan hingga mutasi.",
  },
  {
    icon: FileText,
    title: "Pengurusan STNK",
    description: "Duplikat STNK hilang, perpanjang STNK, dan perubahan data kendaraan.",
  },
  {
    icon: ClipboardCheck,
    title: "BPKB & Balik Nama",
    description: "Proses BPKB, balik nama, dan mutasi kendaraan antar daerah dengan aman.",
  },
  {
    icon: LayoutGrid,
    title: "Layanan Lainnya",
    description: "STCK, KIR, ganti warna plat, dan berbagai keperluan administrasi kendaraan.",
  },
  {
    icon: Headphones,
    title: "Konsultasi Gratis",
    description: "Tim kami siap membantu menjawab pertanyaan seputar layanan kendaraan.",
  },
];

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function Services() {
  return (
    <section id="layanan" className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mb-16"
        >
          <span className="block text-emerald-800 text-xs font-bold tracking-widest uppercase mb-4">
            Layanan Kami
          </span>
          <h2 className="text-3xl md:text-[2.5rem] font-extrabold text-slate-800 mb-6 leading-tight">
            Semua Kebutuhan Kendaraan Dalam Satu Tempat
          </h2>
          <p className="text-slate-500 text-lg">
            Pilih layanan yang Anda butuhkan. Kami menangani proses administrasi dengan transparan dan bertanggung jawab.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service) => (
            <motion.div
              key={service.title}
              variants={item}
              className="group bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300 border border-slate-100 relative overflow-hidden"
            >
              {/* Decorative circle at top right */}
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-emerald-50 rounded-full group-hover:scale-150 transition-transform duration-700 ease-out z-0"></div>

              <div className="relative z-10">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <service.icon className="w-6 h-6" strokeWidth={2} />
                </div>

                <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-emerald-800 transition-colors">
                  {service.title}
                </h3>

                <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                  {service.description}
                </p>

                <a
                  href="#layanan"
                  className="inline-flex items-center gap-2 text-emerald-700 font-bold text-sm group-hover:gap-3 transition-all"
                >
                  Pelajari
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
