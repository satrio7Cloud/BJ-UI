import React from "react";
import { createWhatsappLink } from "../../../shared/utils/whatsaap";

const Contact: React.FC = () => {
  return (
    <section id="kontak" className=" py-20 px-4">
      <div className="max-w-5xl mx-auto text-center">
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-blue-900">
          Masih Ada Pertanyaan?
        </h2>

        <p className="mt-4 text-blue-700 max-w-2xl mx-auto">
          Jangan ragu untuk menghubungi kami. Tim kami siap membantu Anda
          memahami proses pengurusan kendaraan secara jelas, legal, dan
          transparan.
        </p>

        {/* Info Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 text-left">
            <div className="text-3xl mb-3">📞</div>
            <h4 className="font-semibold text-blue-900">WhatsApp</h4>
            <p className="text-blue-700 mt-1">Respon cepat & ramah</p>
            <p className="text-blue-500 text-sm mt-1">0851-5641-9062</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 text-left">
            <div className="text-3xl mb-3">📍</div>
            <h4 className="font-semibold text-blue-900">Area Layanan</h4>
            <p className="text-blue-700 mt-1">Depok & Sekitarnya</p>
            <p className="text-blue-500 text-sm mt-1">Bisa konsultasi online</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 text-left">
            <div className="text-3xl mb-3">⏰</div>
            <h4 className="font-semibold text-blue-900">Jam Operasional</h4>
            <p className="text-blue-700 mt-1">Senin – Sabtu</p>
            <p className="text-blue-500 text-sm mt-1">08.00 – 17.00 WIB</p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12">
          <a
            href={createWhatsappLink(
              "Halo, saya ingin konsultasi pengurusan kendaraan. Mohon informasinya.",
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-col items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg transition"
          >
            <span>Chat WhatsApp Sekarang</span>
            <span className="text-xs text-blue-100">
              Konsultasi gratis • Tanpa komitmen
            </span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Contact;
