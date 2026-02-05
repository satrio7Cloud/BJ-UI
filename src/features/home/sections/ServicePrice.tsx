import { ArrowRight } from "lucide-react";

interface Props {
  onOpenServices: () => void;
}

export default function ServicePrice({ onOpenServices }: Props) {
  return (
    <section className="py-20 text-center">
      {/* Heading */}
      <h2 className="text-3xl font-bold text-gray-900">Daftar Harga Layanan</h2>

      <p className="text-gray-500 mt-3 max-w-xl mx-auto">
        Pilih layanan sesuai kebutuhan Anda. Kami menyediakan berbagai
        pengurusan dokumen dengan proses cepat dan transparan.
      </p>

      {/* CTA Button */}
      <div className="mt-8">
        <button
          onClick={onOpenServices}
          className="
            inline-flex items-center gap-2
            bg-linear-to-r from-blue-600 to-blue-500
            hover:from-blue-700 hover:to-blue-600
            text-white px-8 py-4 rounded-xl
            shadow-lg hover:shadow-xl
            transition-all duration-300 cursor-pointer
          "
        >
          Lihat Semua Layanan
          <ArrowRight size={18} />
        </button>
      </div>
    </section>
  );
}
