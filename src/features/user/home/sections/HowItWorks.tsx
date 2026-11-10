import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const steps = [
  {
    num: "01",
    title: "Konsultasi / Cek Pajak",
    desc: "Cek estimasi biaya via website kami atau hubungi kami langsung via WhatsApp untuk panduan lengkap.",
  },
  {
    num: "02",
    title: "Kirim Dokumen",
    desc: "Kirimkan dokumen fisik atau foto STNK & KTP. Tim kami memvalidasi keabsahan data terlebih dahulu.",
  },
  {
    num: "03",
    title: "Proses Pengurusan",
    desc: "Kami urus seluruh proses ke instansi Samsat/Kepolisian dengan cepat, transparan, dan legal.",
  },
  {
    num: "04",
    title: "Selesai & Terima Dokumen",
    desc: "Dokumen asli yang telah terbit kami antarkan langsung ke alamat Anda atau siap diambil di kantor.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="proses"
      className="py-12 sm:py-20 lg:py-24 bg-linear-to-b from-transparent via-slate-50/50 to-transparent"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <span className="inline-block text-emerald-800 text-xs font-bold tracking-widest uppercase mb-3 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100">
            Cara Kerja
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            4 Langkah Mudah Urus Dokumen Kendaraan
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
            Proses terstandarisasi tanpa repot antre dan tanpa ribet.
          </p>
        </div>

        {/* Steps Container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 relative">
          {steps.map((step, idx) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xs hover:shadow-xl hover:shadow-emerald-900/5 border border-slate-100 transition-all duration-300 relative group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-linear-to-r from-emerald-600 to-teal-500">
                    {step.num}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    {idx + 1}
                  </div>
                </div>

                <h4 className="text-base sm:text-lg font-bold text-slate-800 mb-2 group-hover:text-emerald-800 transition-colors">
                  {step.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden lg:flex items-center gap-1 text-emerald-400 text-xs font-semibold mt-4 pt-3 border-t border-slate-50">
                  <span>Langkah berikutnya</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
