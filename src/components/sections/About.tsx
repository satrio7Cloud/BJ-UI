export default function About() {
  return (
    <>
      {/* ABOUT */}
      <section id="tentang">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            {/* Text */}
            <div>
              <h2 className="text-xl font-bold text-gray-800">Tentang Kami</h2>

              <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                Kami adalah penyedia jasa pengurusan administrasi kendaraan yang
                berfokus pada kemudahan, kecepatan, dan keamanan proses. Layanan
                kami membantu perorangan dalam mengurus STNK, BPKB, mutasi,
                balik nama, hingga blokir kendaraan tanpa ribet.
              </p>

              <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                Dengan pengalaman dan proses yang transparan, kami berkomitmen
                memberikan pelayanan terbaik sesuai prosedur yang berlaku.
              </p>
            </div>

            {/* Highlight Box */}
            <div className="bg-blue-50 rounded-2xl p-8 space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-blue-600 font-bold">✔</span>
                <p className="text-sm text-gray-700">
                  Khusus perorangan (pribadi)
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-blue-600 font-bold">✔</span>
                <p className="text-sm text-gray-700">
                  Proses resmi & sesuai aturan
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-blue-600 font-bold">✔</span>
                <p className="text-sm text-gray-700">
                  Bisa konsultasi via WhatsApp
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-blue-600 font-bold">✔</span>
                <p className="text-sm text-gray-700">
                  Update proses secara transparan
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
