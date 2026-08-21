import { motion } from "framer-motion";

const steps = [
  {
    num: "01",
    title: "Konsultasi",
    desc: "Hubungi kami via WhatsApp atau datang ke kantor untuk diskusi kebutuhan kendaraan Anda.",
  },
  {
    num: "02",
    title: "Kirim Dokumen",
    desc: "Serahkan dokumen yang diperlukan. Tim kami akan memeriksa kelengkapannya.",
  },
  {
    num: "03",
    title: "Proses Pengurusan",
    desc: "Kami urus dokumen ke instansi terkait dengan prosedur resmi dan transparan.",
  },
  {
    num: "04",
    title: "Selesai & Terima",
    desc: "Dokumen selesai. Anda bisa mengambil di kantor atau kami antar sesuai kesepakatan.",
  },
];

export default function HowItWorks() {
  return (
    <section id="proses" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="block text-emerald-800 text-xs font-bold tracking-widest uppercase mb-4">
            Cara Kerja
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            4 Langkah Mudah Mengurus Kendaraan
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="bg-white rounded-3xl p-8 shadow-sm border border-emerald-50 hover:shadow-lg hover:shadow-emerald-900/5 transition-all duration-300"
            >
              <h3 className="text-5xl font-extrabold text-emerald-100 mb-4">
                {step.num}
              </h3>
              <h4 className="text-lg font-bold text-slate-800 mb-3">
                {step.title}
              </h4>
              <p className="text-sm text-slate-500 leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
