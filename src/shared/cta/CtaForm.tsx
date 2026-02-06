import { useState } from "react";
import Modal from "../components/Modal";
import VehicleForm from "../components/VehicleForm";
import { createWhatsappLink } from "../utils/whatsaap";

export default function CtaForm() {
  const [open, setOpen] = useState(false);

  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl p-10 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-900">
            Siap Memulai Pengurusan Kendaraan Anda?
          </h2>

          <p className="mt-3 text-blue-700 max-w-2xl mx-auto">
            Setelah mengisi E-Form atau konsultasi via WhatsApp, tim kami akan
            langsung menghubungi Anda untuk menjelaskan estimasi biaya, proses,
            dan kelengkapan dokumen.
          </p>

          {/* reassurance */}
          <p className="mt-2 text-sm text-blue-500">
            Tanpa biaya pendaftaran • Konsultasi gratis • Legal & transparan
          </p>

          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            {/* CTA FORM */}
            <button
              onClick={() => setOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition"
            >
              Isi E-Form Pengajuan
            </button>

            {/* CTA WHATSAPP */}
            <a
              href={createWhatsappLink(
                "Halo, saya ingin memulai pengurusan kendaraan dan ingin konsultasi terlebih dahulu.",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-blue-600 text-blue-600 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition text-center"
            >
              Konsultasi via WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* MODAL */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Form Pengurusan Kendaraan"
      >
        <VehicleForm />
      </Modal>
    </section>
  );
}
