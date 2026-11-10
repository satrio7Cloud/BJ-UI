import { CheckCircle2, ShieldCheck, Target, Zap } from "lucide-react";

export default function About() {
  return (
    <section
      id="tentang"
      className="py-12 sm:py-20 lg:py-24 relative overflow-hidden bg-transparent"
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 sm:w-112.5 h-80 sm:h-112.5 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          {/* TEXT SIDE */}
          <div className="space-y-6 sm:space-y-8 text-center sm:text-left">
            <div>
              <span className="inline-flex items-center gap-1.5 mb-3 sm:mb-4 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                <Target size={14} />
                Tentang Kami
              </span>

              <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight">
                Solusi Praktis Pengurusan <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-900 via-emerald-800 to-teal-700">
                  Administrasi Kendaraan
                </span>
              </h2>
            </div>

            <p className="text-slate-600 text-sm sm:text-lg leading-relaxed">
              Kami adalah penyedia jasa pengurusan administrasi kendaraan yang
              berfokus pada{" "}
              <strong className="text-slate-900 font-bold">
                kemudahan, kecepatan, dan keamanan
              </strong>{" "}
              proses, memberikan Anda ketenangan pikiran tanpa harus antre
              berjam-jam di Samsat.
            </p>

            <p className="text-slate-600 text-sm sm:text-lg leading-relaxed">
              Mulai dari pengurusan STNK tahunan, 5 tahunan, BPKB, mutasi, balik
              nama, hingga cetak KTL — semua dilakukan secara resmi, transparan,
              dan sesuai prosedur kepolisian.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
              <div className="flex items-center justify-center sm:justify-start gap-3 bg-white border border-slate-200 px-4 py-3 rounded-2xl shadow-xs">
                <div className="w-9 h-9 bg-emerald-100/80 rounded-xl flex items-center justify-center text-emerald-800 shrink-0">
                  <Zap size={18} />
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-900">
                  Proses Kilat 1-3 Hari
                </div>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-3 bg-white border border-slate-200 px-4 py-3 rounded-2xl shadow-xs">
                <div className="w-9 h-9 bg-emerald-100/80 rounded-xl flex items-center justify-center text-emerald-800 shrink-0">
                  <ShieldCheck size={18} />
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-900">
                  Terjamin Legal & Resmi
                </div>
              </div>
            </div>
          </div>

          {/* HIGHLIGHT SIDE */}
          <div className="relative mt-4 lg:mt-0">
            <div className="absolute inset-0 bg-linear-to-br from-emerald-400 to-teal-500 rounded-2xl sm:rounded-[2.5rem] transform rotate-2 sm:rotate-3 scale-[1.02] opacity-20 blur-lg -z-10"></div>

            <div className="bg-white rounded-2xl sm:rounded-[2.5rem] border border-slate-200/80 shadow-xl shadow-slate-200/50 p-5 sm:p-8 md:p-10 relative z-10 space-y-4 sm:space-y-5">
              <div className="border-b border-slate-100 pb-4 mb-4">
                <h3 className="text-lg sm:text-2xl font-bold text-slate-800">
                  Kenapa Memilih Kami?
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm mt-1">
                  Standar keunggulan yang kami berikan kepada setiap pelanggan.
                </p>
              </div>

              {[
                "Melayani perorangan maupun armada perusahaan",
                "Biaya transparan tanpa pungutan tersembunyi",
                "Proses 100% legal dan terverifikasi di Samsat",
                "Layanan antar-jemput berkas via ekspedisi aman",
                "Tracking status berkas secara realtime",
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3 group">
                  <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors shrink-0 shadow-xs border border-emerald-100 mt-0.5">
                    <CheckCircle2 size={16} />
                  </div>
                  <p className="text-slate-700 text-xs sm:text-sm font-medium leading-relaxed pt-0.5">
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
