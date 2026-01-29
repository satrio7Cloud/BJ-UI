export default function Excellence() {
  const items = [
    {
      title: "Proses Cepat",
      desc: "Pengurusan lebih efisien tanpa antre panjang.",
      icon: "⚡",
    },
    {
      title: "Resmi & Aman",
      desc: "Sesuai prosedur dan peraturan yang berlaku.",
      icon: "🛡️",
    },
    {
      title: "Harga Transparan",
      desc: "Biaya jelas tanpa tambahan tersembunyi.",
      icon: "💰",
    },
    {
      title: "Bisa Online",
      desc: "Konsultasi & pengurusan bisa via WhatsApp.",
      icon: "📱",
    },
  ];

  return (
    <section id="keunggulan" className="bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-xl font-bold text-center text-gray-800">
          Kenapa Pilih Kami?
        </h2>

        <p className="text-sm text-gray-500 text-center mt-2">
          Alasan pelanggan mempercayakan pengurusan kendaraan kepada kami
        </p>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-2xl p-6 text-center shadow-sm
                         hover:shadow-md transition"
            >
              <div className="text-3xl">{item.icon}</div>

              <h3 className="mt-4 font-semibold text-gray-800">{item.title}</h3>

              <p className="mt-2 text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
