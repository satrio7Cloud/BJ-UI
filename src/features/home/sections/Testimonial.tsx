import { useEffect, useState } from "react";

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
    }, 4000);

    return () => clearInterval(interval);
  }, [totalSlides]);

  return (
    <section className="bg-gray-50 py-20 px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900">
            Apa Kata Klien Kami
          </h2>
          <p className="mt-4 text-blue-700 max-w-2xl mx-auto">
            Testimoni dari klien yang telah menggunakan layanan kami.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateX(-${currentSlide * 100}%)`,
            }}
          >
            {Array.from({ length: totalSlides }).map((_, slideIndex) => (
              <div
                key={slideIndex}
                className="min-w-full grid grid-cols-1 md:grid-cols-3 gap-6 px-2"
              >
                {testimonials
                  .slice(
                    slideIndex * ITEMS_PER_SLIDE,
                    slideIndex * ITEMS_PER_SLIDE + ITEMS_PER_SLIDE,
                  )
                  .map((item, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-2xl p-6 hover:shadow-lg transition"
                    >
                      {/* Header */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                          {item.name.charAt(0)}
                        </div>

                        <div>
                          <h4 className="font-semibold text-blue-900">
                            {item.name}
                          </h4>
                          <p className="text-sm text-blue-600">
                            {item.service}
                          </p>
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="flex mb-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i}>{i < item.rating ? "⭐" : "☆"}</span>
                        ))}
                      </div>

                      {/* Message */}
                      <p className="text-blue-700 text-sm leading-relaxed">
                        “{item.message}”
                      </p>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
