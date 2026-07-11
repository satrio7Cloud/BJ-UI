import { useEffect, useState, useMemo } from "react";
import { ArrowLeft, Send } from "lucide-react";
import toast from "react-hot-toast";
import type { Service } from "../../../../data/services";
import type { Method } from "../../hooks/useShipping";
import Button from "../../../../shared/components/Button";
import { createWhatsappLink } from "../../../../shared/utils/whatsapp";
import { useOrder } from "../../../../context/OrderContext";

interface Props {
  service: Service;
  selectedOption: Service["options"][0];
  shippingMethod: Method;
  formData: any;
  shippingFee: number;
  paymentMethod: string;
  paymentDetail: any;
  onBack: () => void;
  onNext: () => void;
}

const methodNames: Record<Method, string> = {
  kurir: "Jemput Kurir Kami",
  datang: "Datang Langsung",
  ojol: "Kirim via Ojol",
};

export default function StepSummary({
  service,
  selectedOption,
  shippingMethod,
  formData,
  shippingFee,
  paymentMethod,
  paymentDetail,
  onBack,
  onNext,
}: Props) {
  const { createOrder } = useOrder();
  const servicePrice = service.basePrice + selectedOption.extraPrice;
  const totalPrice = servicePrice + shippingFee;

  // QRIS Countdown Timer State
  const [timer, setTimer] = useState(900); // 15 minutes in seconds

  useEffect(() => {
    if (paymentMethod !== "qris") return;
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [paymentMethod]);

  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // Bank Virtual Account Mock Generation
  const mockVA = useMemo(() => {
    const bankPrefix: Record<string, string> = {
      BCA: "88012",
      MANDIRI: "89012",
      BNI: "82012",
      BRI: "85012",
    };
    const prefix = bankPrefix[paymentDetail?.name] || "88012";
    // Generate a pseudo-random string of 11 digits
    const seed = (formData.whatsapp || "08123456789").replace(/[^0-9]/g, "");
    const randomSuffix = seed.length >= 10 ? seed.slice(-10) : "1234567890";
    const filler = Math.abs(hashCode(formData.name + service.id)).toString().slice(0, 2);
    const rawNumber = (randomSuffix + filler).slice(0, 11);
    
    return `${prefix} ${rawNumber.slice(0, 4)} ${rawNumber.slice(4, 8)} ${rawNumber.slice(8)}`;
  }, [paymentDetail, formData.name, formData.whatsapp, service.id]);

  function hashCode(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  }

  const handleCopyVA = () => {
    const rawVA = mockVA.replace(/\s/g, "");
    navigator.clipboard.writeText(rawVA);
    toast.success("Nomor Virtual Account berhasil disalin!");
  };

  // E-Wallet loader simulation
  const [ewalletPaid, setEwalletPaid] = useState(false);
  useEffect(() => {
    if (paymentMethod !== "ewallet") return;
    setEwalletPaid(false);
    const timeout = setTimeout(() => {
      setEwalletPaid(true);
      toast.success(`Konfirmasi pembayaran ${paymentDetail.name} berhasil!`);
    }, 3500);
    return () => clearTimeout(timeout);
  }, [paymentMethod, paymentDetail]);

  const handleSubmit = () => {
    // Check if e-wallet is still loading
    if (paymentMethod === "ewallet" && !ewalletPaid) {
      toast.error(`Harap tunggu konfirmasi push notification di ponsel Anda.`);
      return;
    }

    // Record order in system context (local state / localStorage)
    const { docId } = createOrder(
      service,
      selectedOption,
      formData,
      shippingFee,
      paymentMethod,
      paymentDetail
    );

    // Generate WhatsApp message
    let message = `Halo Birosaja, saya ingin memesan layanan berikut:\n\n`;
    message += `🆔 *ID TRANSAKSI*: ${docId}\n\n`;

    message += `📋 *DETAIL LAYANAN*\n`;
    message += `- Layanan: ${service.title} (${selectedOption.label})\n`;
    message += `- Estimasi Selesai: ${selectedOption.duration}\n\n`;

    message += `🚚 *DETAIL PENGIRIMAN*\n`;
    message += `- Metode: ${methodNames[shippingMethod]}\n`;
    if (shippingMethod === "kurir" && formData.address) {
      message += `- Alamat Jemput: ${formData.address}\n`;
      if (formData.distance !== null) {
        message += `- Estimasi Jarak: ${formData.distance.toFixed(1)} km\n`;
      }
    }
    message += `\n`;

    message += `👤 *DATA PENGIRIM & BERKAS*\n`;
    message += `- Nama: ${formData.name}\n`;
    message += `- WhatsApp: ${formData.whatsapp}\n`;

    if (service.category === "STNK") {
      message += `- Tipe Kendaraan: ${formData.vehicleType.charAt(0).toUpperCase() + formData.vehicleType.slice(1)}\n`;
      message += `- Masa STNK: ${formData.duration} Tahun\n`;
      message += `- Plat Kendaraan: B ${formData.plateNumber.toUpperCase()}\n`;
      message += `- Tahun Kendaraan: ${formData.vehicleYear}\n`;
    } else if (service.category === "Mutasi" || service.category === "BPKB") {
      if (formData.plateNumber) {
        message += `- Plat Kendaraan: B ${formData.plateNumber.toUpperCase()}\n`;
      }
      if (formData.samsatFrom) {
        message += `- Samsat Asal: ${formData.samsatFrom}\n`;
        message += `- Samsat Tujuan: ${formData.samsatTo}\n`;
      }
    } else if (service.category === "SIM") {
      message += `- Tipe SIM: ${formData.simType}\n`;
    } else if (service.category === "Plat Nomor") {
      message += `- Jumlah Angka Plat: ${formData.plateDigit} Angka\n`;
      message += `- Huruf Belakang: ${formData.plateSuffix === "yes" ? "Dengan Huruf" : "Tanpa Huruf"}\n`;
    }
    message += `\n`;

    message += `💳 *METODE PEMBAYARAN*\n`;
    if (paymentMethod === "qris") {
      message += `- Metode: QRIS (E-Wallet / m-Banking)\n`;
      message += `- Status: LUNAS (Sudah Di-scan)\n`;
    } else if (paymentMethod === "bank") {
      message += `- Metode: Bank Virtual Account (${paymentDetail.name})\n`;
      message += `- No. VA: ${mockVA.replace(/\s/g, "")}\n`;
      message += `- Status: LUNAS / Sedang Ditransfer\n`;
    } else if (paymentMethod === "ewallet") {
      message += `- Metode: E-Wallet (${paymentDetail.name})\n`;
      message += `- No. HP: ${paymentDetail.phone}\n`;
      message += `- Status: LUNAS (Push Notification Sukses)\n`;
    }
    message += `\n`;

    message += `💰 *RINCIAN BIAYA*\n`;
    message += `- Biaya Jasa: Rp ${servicePrice.toLocaleString("id-ID")}\n`;
    if (shippingMethod === "kurir") {
      message += `- Biaya Pengiriman: ${
        shippingFee > 0 ? `Rp ${shippingFee.toLocaleString("id-ID")}` : "Dihitung Manual"
      }\n`;
    } else {
      message += `- Biaya Pengiriman: Gratis / Sesuai Aplikasi\n`;
    }
    message += `- *Total Pembayaran*: Rp ${totalPrice.toLocaleString("id-ID")}\n`;

    // Open WhatsApp
    window.open(createWhatsappLink(message), "_blank");
    
    // Proceed to Step 6 (Success Screen)
    onNext();
  };

  return (
    <div className="flex flex-col h-[90vh] max-w-3xl w-full bg-white rounded-2xl">
      {/* HEADER */}
      <div className="flex items-center gap-3 p-5 border-b">
        <ArrowLeft onClick={onBack} className="cursor-pointer text-gray-600 hover:text-gray-900" />
        <div>
          <h2 className="text-lg font-semibold">Tinjau Pembayaran & Pesanan</h2>
          <p className="text-sm text-gray-500">Selesaikan tagihan Anda di bawah ini</p>
        </div>
      </div>

      {/* BODY */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 text-sm text-gray-700">
        
        {/* PAYMENT CHECKOUT WIDGET (MOCK GATEWAY) */}
        <div className="border border-blue-200 rounded-xl p-4 bg-blue-50/10 space-y-3">
          <p className="text-xs text-blue-700 font-bold uppercase tracking-wider">
            💳 INSTRUKSI PEMBAYARAN ({paymentMethod === "qris" ? "QRIS" : paymentMethod === "bank" ? `VA ${paymentDetail.name}` : `E-Wallet ${paymentDetail.name}`})
          </p>

          {/* CASE 1: QRIS */}
          {paymentMethod === "qris" && (
            <div className="flex flex-col items-center justify-center py-2 space-y-3">
              <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=https://birosaja.com/pay/qris?amount=${totalPrice}`}
                  alt="QRIS QR Code"
                  className="w-36 h-36"
                />
              </div>
              <div className="text-center space-y-1.5">
                <p className="font-bold text-gray-900 text-sm">Scan QRIS Birosaja</p>
                <p className="text-xs text-gray-500">Scan QR di atas untuk menyelesaikan transaksi Anda</p>
                <div className="pt-1">
                  <span className="text-xs font-semibold text-red-600 bg-red-50 border border-red-100 rounded-md px-2.5 py-1 inline-block">
                    ⏳ Batas Waktu: {formatTime(timer)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* CASE 2: VIRTUAL ACCOUNT */}
          {paymentMethod === "bank" && (
            <div className="space-y-3 pt-1">
              <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Nomor Virtual Account</span>
                  <span className="font-mono text-base font-bold text-gray-900 tracking-wider">
                    {mockVA}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyVA}
                  className="text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg border border-blue-200 transition cursor-pointer"
                >
                  Salin
                </button>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-xs text-gray-600 space-y-1">
                <p className="font-semibold text-gray-800">Petunjuk Transfer:</p>
                <ol className="list-decimal pl-4 space-y-1">
                  <li>Pilih menu <b>Transfer ➔ Virtual Account</b> di m-banking Anda.</li>
                  <li>Masukkan nomor VA di atas.</li>
                  <li>Pastikan nominal transfer sesuai: <b>Rp {totalPrice.toLocaleString("id-ID")}</b>.</li>
                  <li>Konfirmasi transaksi Anda.</li>
                </ol>
              </div>
            </div>
          )}

          {/* CASE 3: E-WALLET */}
          {paymentMethod === "ewallet" && (
            <div className="space-y-3 py-1">
              <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-lg font-bold text-blue-700 shrink-0">
                  📱
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Kirim Notifikasi Ke</span>
                  <span className="font-semibold text-gray-900">{paymentDetail.name} ({paymentDetail.phone})</span>
                </div>
              </div>
              
              {ewalletPaid ? (
                <div className="bg-green-50 text-green-800 text-xs p-3 rounded-lg border border-green-200 text-center font-medium">
                  ✅ Konfirmasi push notifikasi berhasil! Pembayaran disimulasikan LUNAS.
                </div>
              ) : (
                <div className="bg-orange-50 text-orange-800 text-xs p-3 rounded-lg border border-orange-200 flex items-center justify-center gap-2">
                  <div className="animate-spin border-2 border-orange-600 border-t-transparent rounded-full w-4 h-4"></div>
                  <span>Menunggu pembayaran di aplikasi {paymentDetail.name} ponsel Anda...</span>
                </div>
              )}
            </div>
          )}

        </div>

        {/* LAYANAN CARD */}
        <div className="border border-gray-200 rounded-xl p-4 space-y-2 bg-gray-50/50">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Layanan Terpilih</p>
              <h4 className="font-bold text-gray-900 mt-0.5">{service.title}</h4>
            </div>
            <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-blue-100">
              {selectedOption.label}
            </span>
          </div>
          <p className="text-xs text-gray-500">Estimasi Selesai: {selectedOption.duration}</p>
        </div>

        {/* PENGIRIMAN CARD */}
        <div className="border border-gray-200 rounded-xl p-4 space-y-2 bg-gray-50/50">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Metode Pengiriman Berkas</p>
          <div className="flex justify-between">
            <span className="font-bold text-gray-900">{methodNames[shippingMethod]}</span>
            {shippingMethod === "kurir" && formData.distance !== null && (
              <span className="text-xs text-gray-500 font-medium">
                Jarak: {formData.distance.toFixed(1)} km
              </span>
            )}
          </div>
          {shippingMethod === "kurir" && formData.address && (
            <p className="text-xs text-gray-500">Alamat: {formData.address}</p>
          )}
        </div>

        {/* DATA DETAIL CARD */}
        <div className="border border-gray-200 rounded-xl p-4 space-y-3 bg-gray-50/50">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Detail Data Berkas</p>
          <div className="grid grid-cols-2 gap-y-2.5 gap-x-4">
            <div>
              <span className="text-xs text-gray-400 block">Nama Lengkap</span>
              <span className="font-semibold text-gray-900">{formData.name}</span>
            </div>
            <div>
              <span className="text-xs text-gray-400 block">No. WhatsApp</span>
              <span className="font-semibold text-gray-900">{formData.whatsapp}</span>
            </div>

            {service.category === "STNK" && (
              <>
                <div>
                  <span className="text-xs text-gray-400 block">Nomor Plat</span>
                  <span className="font-semibold text-gray-900 uppercase">B {formData.plateNumber}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-400 block">Tahun / Jenis</span>
                  <span className="font-semibold text-gray-900 capitalize">
                    {formData.vehicleYear} / {formData.vehicleType}
                  </span>
                </div>
              </>
            )}

            {(service.category === "Mutasi" || service.category === "BPKB") && (
              <>
                {formData.plateNumber && (
                  <div>
                    <span className="text-xs text-gray-400 block">Nomor Plat</span>
                    <span className="font-semibold text-gray-900 uppercase">B {formData.plateNumber}</span>
                  </div>
                )}
                {formData.samsatFrom && (
                  <div>
                    <span className="text-xs text-gray-400 block">Samsat Asal ➔ Tujuan</span>
                    <span className="font-semibold text-gray-900 truncate block" title={`${formData.samsatFrom} ➔ ${formData.samsatTo}`}>
                      {formData.samsatFrom} ➔ {formData.samsatTo}
                    </span>
                  </div>
                )}
              </>
            )}

            {service.category === "SIM" && (
              <div>
                <span className="text-xs text-gray-400 block">Tipe SIM</span>
                <span className="font-semibold text-gray-900">{formData.simType}</span>
              </div>
            )}

            {service.category === "Plat Nomor" && (
              <>
                <div>
                  <span className="text-xs text-gray-400 block">Jumlah Angka</span>
                  <span className="font-semibold text-gray-900">{formData.plateDigit} Angka</span>
                </div>
                <div>
                  <span className="text-xs text-gray-400 block">Huruf Belakang</span>
                  <span className="font-semibold text-gray-900">
                    {formData.plateSuffix === "yes" ? "Dengan Huruf" : "Tanpa Huruf"}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* RINCIAN BIAYA CARD */}
        <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 space-y-2">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Rincian Pembayaran</p>
          <div className="flex justify-between text-xs">
            <span>Biaya Jasa ({selectedOption.label})</span>
            <span>Rp {servicePrice.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span>Biaya Pengiriman</span>
            <span>
              {shippingMethod === "kurir"
                ? shippingFee > 0
                  ? `Rp ${shippingFee.toLocaleString("id-ID")}`
                  : "Dihitung Manual"
                : "Gratis / Sesuai Aplikasi"}
            </span>
          </div>
          <div className="border-t border-dashed border-gray-300 pt-2 flex justify-between font-bold text-gray-900">
            <span>Total Tagihan</span>
            <span className="text-blue-700">Rp {totalPrice.toLocaleString("id-ID")}</span>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="p-5 border-t">
        <Button
          onClick={handleSubmit}
          disabled={paymentMethod === "ewallet" && !ewalletPaid}
          className={`w-full text-white py-3 rounded-xl flex items-center justify-center gap-2 ${
            paymentMethod === "ewallet" && !ewalletPaid
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          <Send size={16} /> Konfirmasi & Kirim via WhatsApp
        </Button>
      </div>
    </div>
  );
}
