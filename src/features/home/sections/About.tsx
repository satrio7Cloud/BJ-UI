export default function About() {
  return (
    <section id="tentang" className="bg-linear-gradient from-white to-blue-50">
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
          {/* TEXT */}
          <div>
            <span className="inline-block mb-3 text-xs font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
              Tentang Kami
            </span>

            <h2 className="text-3xl font-bold text-gray-800 leading-tight">
              Solusi Praktis Pengurusan <br />
              Administrasi Kendaraan
            </h2>

            <p className="mt-5 text-gray-600 leading-relaxed">
              Kami adalah penyedia jasa pengurusan administrasi kendaraan yang
              berfokus pada{" "}
              <span className="font-medium text-gray-800">
                kemudahan, kecepatan, dan keamanan
              </span>{" "}
              proses.
            </p>

            <p className="mt-4 text-gray-600 leading-relaxed">
              Mulai dari pengurusan STNK, BPKB, mutasi, balik nama, hingga
              blokir kendaraan — semua dilakukan secara resmi, transparan, dan
              sesuai prosedur yang berlaku.
            </p>
          </div>

          {/* HIGHLIGHT */}
          <div className="bg-white rounded-3xl shadow-lg p-8 space-y-5">
            {[
              "Melayani perorangan maupun badan usaha",
              "Layanan resmi sesuai aturan",
              "Proses resmi & sesuai peraturan",
              "Konsultasi mudah via WhatsApp",
              "Update progres berkas secara realtime",
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-100 text-blue-600 font-bold">
                  ✓
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
