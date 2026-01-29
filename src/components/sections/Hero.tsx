import pict from "../../assets/pict-1.png";

export default function Hero() {
  return (
    <section
      id="beranda"
      className="bg-linear-to-br from-blue-600 to-blue-800 text-white"
    >
      <div className="max-w-6xl mx-auto px-4 py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* LEFT CONTENT */}
          <div>
            <span className="inline-block text-xs bg-white/20 px-3 py-1 rounded-full">
              Biro Jasa Kendaraan Resmi
            </span>

            <h1 className="mt-4 text-3xl md:text-4xl font-bold leading-tight">
              Pengurusan Administrasi Kendaraan
              <span className="block text-blue-200">
                Lebih Mudah, Aman, dan Transparan
              </span>
            </h1>

            <p className="mt-4 text-blue-100 max-w-xl">
              Kami membantu Anda memahami dan mengurus berbagai kebutuhan
              administrasi kendaraan seperti STNK, BPKB, balik nama, mutasi,
              hingga plat nomor dengan proses yang jelas dan legal.
            </p>

            {/* SOFT CTA */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <a
                href="#layanan"
                className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition text-center"
              >
                Lihat Layanan
              </a>

              <a
                href="#keunggulan"
                className="border border-white font-semibold px-6 py-3 rounded-xl hover:bg-white/10 transition text-center"
              >
                Kenapa Pilih Kami
              </a>
            </div>
          </div>

          {/* RIGHT VISUAL */}
          <div className="hidden md:flex justify-center md:justify-end">
            <img
              src={pict}
              alt="Ilustrasi Pengurusan Kendaraan"
              className="w-full max-w-md drop-shadow-2xl rounded-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
