import { Building2, Package, Send, ShieldCheck, Truck } from "lucide-react";
import {
  DEFAULT_OFFICE_PROFILE,
  type CompanyProfile,
} from "../../../../api/companyProfile";
import Button from "../../../../shared/components/Button";
import { useCompanyProfile } from "../../../../shared/hooks/useCompanyProfile";
import { type ShippingScenario } from "../types";

interface CheckoutSuccessProps {
  orderIdRef: string | null;
  shippingScenario?: ShippingScenario;
  onBack: () => void;
  onResetSuccess: () => void;
  officeProfile?: CompanyProfile;
}

export default function CheckoutSuccess({
  orderIdRef,
  shippingScenario = "A",
  onBack,
  onResetSuccess,
  officeProfile: propOfficeProfile,
}: CheckoutSuccessProps) {
  const { profile: hookOfficeProfile } = useCompanyProfile();
  const officeProfile =
    propOfficeProfile || hookOfficeProfile || DEFAULT_OFFICE_PROFILE;

  const displayAddress = officeProfile.full_address
    ? officeProfile.post_code &&
      !officeProfile.full_address.includes(officeProfile.post_code)
      ? `${officeProfile.full_address}, ${officeProfile.post_code}`
      : officeProfile.full_address
    : DEFAULT_OFFICE_PROFILE.full_address;

  const cleanPhone = (officeProfile.phone_number || "085156419062").replace(
    /\D/g,
    "",
  );
  const waNumber = cleanPhone.startsWith("0")
    ? `62${cleanPhone.slice(1)}`
    : cleanPhone;

  return (
    <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-sm max-w-2xl mx-auto text-center space-y-6">
      <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <ShieldCheck className="w-10 h-10" />
      </div>
      <h2 className="text-3xl font-extrabold text-slate-800">
        Pesanan Berhasil Dibuat!
      </h2>

      <p className="text-slate-600 text-lg leading-relaxed">
        Terima kasih telah mempercayakan pengurusan surat kendaraan Anda kepada{" "}
        <b>{officeProfile.office_name || "Biro Jasa"}</b>.
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

      {shippingScenario === "A" && (
        <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-left space-y-3 mt-4">
          <h3 className="font-bold text-emerald-900 text-lg flex items-center gap-2">
            <Truck className="w-5 h-5 text-emerald-700" />
            Metode: Door-to-Door (Jemput & Antar)
          </h3>
          <p className="text-emerald-800 text-sm">
            Setelah pembayaran diverifikasi oleh Admin, kurir kami akan segera
            datang ke <b>Alamat Penjemputan</b> yang Anda cantumkan untuk
            mengambil berkas fisik asli Anda.
          </p>
        </div>
      )}

      {shippingScenario === "B" && (
        <div className="bg-blue-50 border border-blue-200 p-6 rounded-2xl text-left space-y-3 mt-4">
          <h3 className="font-bold text-blue-900 text-lg flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-700" />
            Metode: Office Drop-off (Antar ke Kantor)
          </h3>
          <p className="text-blue-800 text-sm">
            Silakan antarkan berkas fisik Anda ke kantor kami di:
          </p>
          <div className="bg-white p-3 rounded-xl border border-blue-200 text-xs font-medium text-slate-800">
            📍 <b>Alamat Kantor {officeProfile.office_name || "Biro Jasa"}:</b>{" "}
            {displayAddress} ({officeProfile.operational_hours || "Senin - Sabtu, 08:00 - 17:00 WIB"}).
          </div>
          <p className="text-blue-800 text-xs">
            Setelah selesai diproses, dokumen resmi akan dikirimkan kurir
            langsung ke alamat Anda.
          </p>
        </div>
      )}

      {shippingScenario === "C" && (
        <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl text-left space-y-3 mt-4">
          <h3 className="font-bold text-amber-900 text-lg flex items-center gap-2">
            <Send className="w-5 h-5 text-amber-700" />
            Metode: Send-in Ekspedisi (Kirim Paket Luar)
          </h3>
          <p className="text-amber-800 text-sm">
            Silakan kirimkan berkas fisik Anda via ekspedisi luar (JNE / SiCepat /
            J&T / Gojek / Grab) ke kantor kami:
          </p>
          <div className="bg-white p-3 rounded-xl border border-amber-200 text-xs font-medium text-slate-800">
            📍 <b>Tujuan Pengiriman:</b> {officeProfile.office_name || "Biro Jasa"}{" "}
            - {displayAddress} (Telp: {officeProfile.phone_number || "085156419062"}).
          </div>
          <p className="text-amber-800 text-sm">
            Setelah paket dikirim, mohon <b>kirimkan nomor resi</b> ke WhatsApp
            Admin kami agar kami dapat memonitor kedatangan berkas Anda.
          </p>
          <a
            href={`https://wa.me/${waNumber}?text=${encodeURIComponent(
              `Halo Admin, saya telah mengirim berkas pesanan (ID: ${orderIdRef}) via ekspedisi.\nNomor Resi / Ekspedisi: `,
            )}`}
            target="_blank"
            rel="noreferrer"
            className="inline-block mt-1 px-4 py-2 bg-amber-600 text-white font-bold rounded-lg text-sm hover:bg-amber-700 transition-colors"
          >
            Kirim Resi ke WhatsApp Admin
          </a>
        </div>
      )}

      {shippingScenario === "D" && (
        <div className="bg-purple-50 border border-purple-200 p-6 rounded-2xl text-left space-y-3 mt-4">
          <h3 className="font-bold text-purple-900 text-lg flex items-center gap-2">
            <Building2 className="w-5 h-5 text-purple-700" />
            Metode: Walk-in Mandiri (Datang & Ambil Sendiri)
          </h3>
          <p className="text-purple-800 text-sm">
            Seluruh serah terima berkas dilakukan langsung di kantor kami
            (Bebas Ongkir).
          </p>
          <div className="bg-white p-3 rounded-xl border border-purple-200 text-xs font-medium text-slate-800">
            📍 <b>Alamat Kantor {officeProfile.office_name ? `(${officeProfile.office_name})` : ""}:</b>{" "}
            {displayAddress}
            <br />
            🕒 <b>Jam Operasional:</b>{" "}
            {officeProfile.operational_hours || "Senin - Sabtu, 08:00 - 17:00 WIB"}
          </div>
          <p className="text-purple-800 text-xs">
            Kami akan memberi tahu Anda via WhatsApp jika dokumen sudah siap
            untuk diambil kembali di kantor.
          </p>
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
