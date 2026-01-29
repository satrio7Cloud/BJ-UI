import { motion } from "framer-motion";
import {
  FileText,
  RefreshCcw,
  MapPin,
  Ban,
  AlertTriangle,
  Hash,
  ArrowRight,
} from "lucide-react";

const services = [
  {
    icon: RefreshCcw,
    title: "Perpanjang STNK",
    description:
      "Perpanjangan STNK tahunan & 5 tahunan secara cepat dan resmi.",
  },
  {
    icon: FileText,
    title: "Balik Nama BPKB",
    description: "Proses balik nama kendaraan sesuai identitas terbaru.",
  },
  {
    icon: MapPin,
    title: "Mutasi Kendaraan",
    description: "Pengurusan mutasi kendaraan antar daerah dengan aman.",
  },
  {
    icon: Ban,
    title: "Blokir Kendaraan",
    description: "Blokir kendaraan bekas jual atau terkena ETLE.",
  },
  {
    icon: AlertTriangle,
    title: "STNK Hilang",
    description: "Pengurusan STNK hilang hingga proses mutasi.",
  },
  {
    icon: Hash,
    title: "Request Nomor Plat",
    description: "Pengajuan nomor plat kendaraan sesuai permintaan.",
  },
];

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function Services() {
  return (
    <section id="layanan" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-4">
            Layanan Kami
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Solusi Lengkap Pengurusan Kendaraan
          </h2>
          <p className="text-gray-500">
            Proses cepat, transparan, dan terpercaya untuk semua kebutuhan
            administrasi kendaraan Anda.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 md:grid-cols-3 gap-6"
        >
          {services.map((service) => (
            <motion.div
              key={service.title}
              variants={item}
              className="
                group bg-white rounded-2xl p-6
                shadow-sm hover:shadow-lg
                transition border border-gray-100
              "
            >
              <div
                className="
                w-14 h-14 rounded-xl
                bg-blue-100 text-blue-600
                flex items-center justify-center
                mb-5 group-hover:scale-110
                transition
              "
              >
                <service.icon className="w-7 h-7" />
              </div>

              <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition">
                {service.title}
              </h3>

              <p className="text-gray-500 text-sm mb-4">
                {service.description}
              </p>

              <a
                href="#kontak"
                className="inline-flex items-center gap-2 text-blue-600 font-medium text-sm group-hover:gap-3 transition"
              >
                Selengkapnya
                <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
