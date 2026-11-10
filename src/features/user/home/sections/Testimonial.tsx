import { useEffect, useState } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";

export const testimonials = [
  {
    name: "Budi Santoso",
    service: "Perpanjangan STNK",
    rating: 5,
    message:
      "Pelayanan cepat dan sangat membantu. Saya tinggal terima beres, tidak perlu bolak-balik cuti kerja.",
  },
  {
    name: "Siti Aminah",
    service: "Balik Nama Kendaraan",
    rating: 5,
    message:
      "Adminnya ramah dan selalu update progres. Semua berkas diurus tuntas dan transparan.",
  },
  {
    name: "Rizky Pratama",
    service: "Mutasi Kendaraan",
    rating: 5,
    message:
      "Proses transparan dari awal sampai selesai. Estimasi waktunya juga tepat sesuai kesepakatan.",
  },
  {
    name: "Andi Wijaya",
    service: "Blokir Kendaraan",
    rating: 5,
    message:
      "Proses resmi dan aman. Cocok sekali buat yang tidak mau ribet urusan birokrasi Samsat.",
  },
  {
    name: "Dewi Lestari",
    service: "STNK Hilang",
    rating: 5,
    message:
      "Awalnya bingung harus mulai dari mana, tapi di sini semuanya diurus dari laporan sampai fisik jadi.",
  },
  {
    name: "Fajar Ramadhan",
    service: "Balik Nama Kendaraan",
    rating: 5,
    message:
      "Pelayanan sangat cepat dan komunikatif. Harga jelas tanpa biaya tersembunyi.",
  },
];

export default function Testimonials() {
  const [itemsPerSlide, setItemsPerSlide] = useState(3);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Responsive items per slide
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerSlide(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerSlide(2);
      } else {
        setItemsPerSlide(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalSlides = Math.ceil(testimonials.length / itemsPerSlide);

  useEffect(() => {
    // Reset slide index jika totalSlides berubah saat resize
    if (currentSlide >= totalSlides) {
      setCurrentSlide(0);
    }
  }, [totalSlides, currentSlide]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);
    return () => clearInterval(interval);
  }, [totalSlides]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  return (
    <section
      id="testimoni"
      className="py-12 sm:py-20 lg:py-24 px-4 overflow-hidden relative bg-transparent"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Heading */}
        <div className="text-center mb-10 sm:mb-16">
          <div className="inline-flex items-center justify-center px-3.5 py-1.5 mb-3 rounded-full bg-emerald-100/80 text-emerald-800 font-bold text-xs uppercase tracking-wide border border-emerald-200">
            Testimoni Pelanggan
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Dipercaya oleh{" "}
            <span className="text-emerald-700">Ribuan Klien</span>
          </h2>
          <p className="mt-3 text-slate-500 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">
            Pengalaman nyata dari mereka yang telah merasakan kemudahan layanan
            pengurusan dokumen kendaraan bersama kami.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative overflow-hidden px-1 sm:px-4">
          <div
            className="flex transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
            style={{
              transform: `translateX(-${currentSlide * 100}%)`,
            }}
          >
            {Array.from({ length: totalSlides }).map((_, slideIndex) => (
              <div
                key={slideIndex}
                className="min-w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 px-1"
              >
                {testimonials
                  .slice(
                    slideIndex * itemsPerSlide,
                    slideIndex * itemsPerSlide + itemsPerSlide,
                  )
                  .map((item, index) => (
                    <div
                      key={index}
                      className="group bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm hover:shadow-xl hover:shadow-emerald-900/10 transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-full"
                    >
                      <Quote className="absolute top-5 right-5 w-10 h-10 sm:w-12 sm:h-12 text-slate-100 group-hover:text-emerald-50 transition-colors -rotate-12 pointer-events-none" />

                      {/* Rating */}
                      <div>
                        <div className="flex items-center gap-1 mb-4 sm:mb-6 relative z-10">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={
                                i < item.rating
                                  ? "text-amber-400 fill-amber-400"
                                  : "text-slate-300"
                              }
                            />
                          ))}
                        </div>

                        {/* Message */}
                        <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-6 relative z-10 italic">
                          "{item.message}"
                        </p>
                      </div>

                      {/* User Info */}
                      <div className="flex items-center gap-3 sm:gap-4 relative z-10 border-t border-slate-100 pt-4 sm:pt-5">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-linear-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center font-bold text-base sm:text-xl shadow-md shrink-0">
                          {item.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-900 text-sm sm:text-base truncate">
                            {item.name}
                          </h4>
                          <p className="text-[11px] sm:text-xs font-semibold text-emerald-700 uppercase tracking-wider mt-0.5 truncate">
                            {item.service}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ))}
          </div>

          {/* Navigation Controls: Dots & Arrows */}
          <div className="flex justify-between sm:justify-center items-center gap-3 mt-8 sm:mt-12 relative z-10 px-2">
            <button
              onClick={handlePrev}
              className="p-2 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-800 transition-colors shadow-xs"
              aria-label="Previous slide"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Pagination Indicators */}
            <div className="flex items-center gap-2">
              {Array.from({ length: totalSlides }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    currentSlide === idx
                      ? "w-7 h-2 bg-emerald-700"
                      : "w-2 h-2 bg-slate-300 hover:bg-emerald-300"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="p-2 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-800 transition-colors shadow-xs"
              aria-label="Next slide"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
