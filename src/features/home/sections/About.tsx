import { CheckCircle2, ShieldCheck, Target, Zap } from "lucide-react";

export default function About() {
  return (
    <section id="tentang" className="py-24 relative overflow-hidden bg-white">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20  w-125 h-125 bg-emerald-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* TEXT SIDE */}
          <div className="space-y-8">
            <div>
              <span className="inline-flex items-center gap-1.5 mb-4 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-full uppercase tracking-wider">
                <Target size={14} />
                Tentang Kami
              </span>

              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight">
                Solusi Praktis Pengurusan <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text  bg-liniear-to-r from-emerald-600 to-teal-500">
                  Administrasi Kendaraan
                </span>
              </h2>
            </div>

            <p className="text-slate-600 text-lg leading-relaxed">
              Kami adalah penyedia jasa pengurusan administrasi kendaraan yang
              berfokus pada{" "}
              <strong className="text-slate-900 font-bold">
                kemudahan, kecepatan, dan keamanan
              </strong>{" "}
              proses, memberikan Anda ketenangan pikiran tanpa harus antri
              berjam-jam.
            </p>

            <p className="text-slate-600 text-lg leading-relaxed">
              Mulai dari pengurusan STNK, BPKB, mutasi, balik nama, hingga
              blokir kendaraan — semua dilakukan secara resmi, transparan, dan
              sesuai prosedur yang berlaku di Samsat dan kepolisian.
            </p>

            <div className="flex gap-4 pt-4">
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-5 py-3 rounded-2xl">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shrink-0">
                  <Zap size={20} />
                </div>
                <div className="text-sm font-bold text-slate-900">
                  Proses Kilat
                </div>
              </div>
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-5 py-3 rounded-2xl">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <div className="text-sm font-bold text-slate-900">
                  Terjamin Aman
                </div>
              </div>
            </div>
          </div>

          {/* HIGHLIGHT SIDE */}
          <div className="relative">
            <div className="absolute inset-0 bg-liniear-to-br from-emerald-400 to-teal-500 rounded-[2.5rem] transform rotate-3 scale-[1.02] opacity-20 blur-lg"></div>

            <div className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-2xl shadow-slate-200 p-8 md:p-10 relative z-10 space-y-6">
              <div className="border-b border-slate-100 pb-5 mb-6">
                <h3 className="text-2xl font-bold text-slate-800">
                  Kenapa Memilih Kami?
                </h3>
                <p className="text-slate-500 text-sm mt-2">
                  Nilai unggul yang selalu kami berikan kepada setiap pelanggan.
                </p>
              </div>

              {[
                "Melayani perorangan maupun armada perusahaan",
                "Biaya transparan tanpa pungutan liar",
                "Proses 100% legal dan terdaftar di Samsat",
                "Layanan antar-jemput berkas via Kurir/Ekspedisi",
                "Sistem pelacakan status berkas secara realtime",
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-4 group">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors shrink-0 shadow-sm border border-emerald-100">
                    <CheckCircle2 size={18} />
                  </div>
                  <p className="text-slate-700 font-medium leading-relaxed pt-1">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
