import { ShieldCheck, Truck } from "lucide-react";
import Button from "../../../../shared/components/Button";

interface CheckoutSuccessProps {
  orderIdRef: string | null;
  pickupMethod: string;
  onBack: () => void;
  onResetSuccess: () => void;
}

export default function CheckoutSuccess({
  orderIdRef,
  pickupMethod,
  onBack,
  onResetSuccess,
}: CheckoutSuccessProps) {
  return (
    <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-sm max-w-2xl mx-auto text-center space-y-6">
      <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <ShieldCheck className="w-10 h-10" />
      </div>
      <h2 className="text-3xl font-extrabold text-slate-800">
        Pesanan Berhasil Dibuats!
      </h2>

      <p className="text-slate-600 text-lg leading-relaxed">
        Terima kasih telah mempercayakan pengurusan surat kendaraan Anda
        kepada DTerazz Biro Jasa.
      </p>

      <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl text-left space-y-3">
        <h3 className="font-bold text-amber-900 text-lg">
          Langkah Selanjutnya:
        </h3>
        <ul className="list-disc pl-5 text-amber-800 space-y-2 text-sm">
          <li>
            Admin kami akan melakukan pengecekan dan verifikasi dokumen yang
            Anda lampirkan.
          </li>
          <li>
            Jika dokumen sudah lengkap dan sesuai, Admin akan membuatkan
            tagihan pembayaran (Invoice).
          </li>
          <li>
            Anda akan menerima pesan <b>WhatsApp</b> yang berisi Link
            Pembayaran resmi.
          </li>
        </ul>
      </div>

      {(pickupMethod === "OJOL" ||
        pickupMethod === "GOSEND" ||
        pickupMethod === "KURIR") && (
        <div className="bg-blue-50 border border-blue-200 p-6 rounded-2xl text-left space-y-3 mt-4">
          <h3 className="font-bold text-blue-900 text-lg flex items-center gap-2">
            <Truck className="w-5 h-5" />
            Khusus Penjemputan via Kurir / Ojol
          </h3>
          <p className="text-blue-800 text-sm">
            Karena Anda memilih metode penjemputan berkas via
            GoSend/GrabExpress/Kurir Eksternal,{" "}
            <b>mohon segera pesan kurir Anda</b> ke alamat kantor kami.
          </p>
          <p className="text-blue-800 text-sm">
            Setelah kurir dipesan,{" "}
            <b>kirimkan Link Live Tracking atau Nomor Resi</b> ke WhatsApp
            Admin kami agar kami bisa melacak kedatangan berkas Anda.
          </p>
          <a
            href={`https://wa.me/6285156419062?text=${encodeURIComponent(`Halo Admin, ini link tracking/resi untuk penjemputan berkas pesanan saya (ID: ${orderIdRef}).\nLink/Resi: `)}`}
            target="_blank"
            rel="noreferrer"
            className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white font-bold rounded-lg text-sm hover:bg-blue-700 transition-colors"
          >
            Kirim Resi ke WhatsApp Admin
          </a>
        </div>
      )}

      <div className="text-xs text-slate-500 font-mono mt-4">
        ID Pesanan: {orderIdRef}
      </div>

      <Button
        variant="primary"
        onClick={() => {
          onResetSuccess();
          onBack();
        }}
        className="mt-8 w-full sm:w-auto"
      >
        Selesai & Kembali ke Layanan
      </Button>
    </div>
  );
}
