import { useEffect, useState } from "react";
import { Star, Quote } from "lucide-react";

export const testimonials = [
  {
    name: "Budi Santoso",
    service: "Perpanjangan STNK",
    rating: 5,
    message:
      "Pelayanan cepat dan sangat membantu. Saya tinggal terima beres, tidak perlu bolak-balik.",
  },
  {
    name: "Siti Aminah",
    service: "Balik Nama Kendaraan",
    rating: 5,
    message:
      "Adminnya ramah dan selalu update progres. Semua dijelaskan dengan jelas.",
  },
  {
    name: "Rizky Pratama",
    service: "Mutasi Kendaraan",
    rating: 4,
    message:
      "Proses transparan dari awal sampai selesai. Estimasi waktunya juga sesuai.",
  },
  {
    name: "Andi Wijaya",
    service: "Blokir Kendaraan",
    rating: 5,
    message:
      "Proses resmi dan aman. Cocok buat yang tidak mau ribet urusan administrasi.",
  },
  {
    name: "Dewi Lestari",
    service: "STNK Hilang",
    rating: 5,
    message:
      "Awalnya bingung harus mulai dari mana, tapi di sini semuanya diurus sampai selesai.",
  },
  {
    name: "Fajar Ramadhan",
    service: "Balik Nama Kendaraan",
    rating: 4,
    message: "Pelayanan cepat dan komunikatif. Harga sesuai dengan layanan.",
  },
  {
    name: "Agus Saputra",
    service: "Perpanjangan STNK Tahunan",
    rating: 5,
    message: "Tidak perlu cuti kerja. Semua bisa dipantau lewat WhatsApp.",
  },
  {
    name: "PT Maju Jaya Transport",
    service: "Pengurusan STNK Armada",
    rating: 5,
    message:
      "Sangat membantu untuk pengurusan kendaraan operasional perusahaan kami.",
  },
  {
    name: "Lina Kartika",
    service: "Balik Nama & Pajak",
    rating: 4,
    message:
      "Prosesnya jelas dan admin selalu mengingatkan jika ada dokumen kurang.",
  },
];

const ITEMS_PER_SLIDE = 3;

export default function Testimonials() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = Math.ceil(testimonials.length / ITEMS_PER_SLIDE);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000); // 5 seconds
    return () => clearInterval(interval);
  }, [totalSlides]);

  return (
    <section className="py-24 px-4 overflow-hidden relative">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-200/40 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-200/40 rounded-full blur-3xl translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Heading */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center px-4 py-1.5 mb-4 rounded-full bg-emerald-100 text-emerald-700 font-semibold text-sm uppercase tracking-wide">
            Testimoni Pelanggan
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Dipercaya oleh <span className="text-emerald-600">Ribuan Klien</span>
          </h2>
          <p className="mt-4 text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
            Pengalaman nyata dari mereka yang telah merasakan kemudahan dan kecepatan layanan pengurusan dokumen kendaraan bersama kami.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative overflow-hidden px-4 md:px-0">
          <div
            className="flex transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]"
            style={{
              transform: `translateX(-${currentSlide * 100}%)`,
            }}
          >
            {Array.from({ length: totalSlides }).map((_, slideIndex) => (
              <div
                key={slideIndex}
                className="min-w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 px-2 md:px-4"
              >
                {testimonials
                  .slice(
                    slideIndex * ITEMS_PER_SLIDE,
                    slideIndex * ITEMS_PER_SLIDE + ITEMS_PER_SLIDE,
                  )
                  .map((item, index) => (
                    <div
                      key={index}
                      className="group bg-white rounded-3xl p-8 border border-slate-200/60 shadow-lg shadow-slate-200/50 hover:shadow-2xl hover:shadow-emerald-900/10 transition-all duration-300 relative overflow-hidden flex flex-col h-full"
                    >
                      <Quote className="absolute top-6 right-6 w-12 h-12 text-slate-100 group-hover:text-emerald-50 transition-colors -rotate-12" />
                      
                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-6 relative z-10">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={18}
                            className={i < item.rating ? "text-amber-400 fill-amber-400" : "text-slate-300"}
                          />
                        ))}
                      </div>

                      {/* Message */}
                      <p className="text-slate-600 text-base leading-relaxed mb-8 flex-grow relative z-10 italic">
                        "{item.message}"
                      </p>

                      {/* User Info */}
                      <div className="flex items-center gap-4 mt-auto relative z-10 border-t border-slate-100 pt-5">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-white flex items-center justify-center font-bold text-xl shadow-md shrink-0">
                          {item.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 line-clamp-1">
                            {item.name}
                          </h4>
                          <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mt-0.5 line-clamp-1">
                            {item.service}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ))}
          </div>
          
          {/* Pagination Indicators */}
          <div className="flex justify-center items-center gap-3 mt-12 relative z-10">
            {Array.from({ length: totalSlides }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  currentSlide === idx 
                    ? "w-8 h-2.5 bg-emerald-500" 
                    : "w-2.5 h-2.5 bg-slate-300 hover:bg-emerald-300"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
