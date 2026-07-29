import { ArrowLeft, Send } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { generateInvoiceApi } from "../../../../api/invoice";
import { createOrderApi, uploadCustomerDocument, type CreateOrderRequest } from "../../../../api/order";
import type { Service } from "../../../../data/services";
import Button from "../../../../shared/components/Button";

declare global {
  interface Window {
    snap: any;
  }
}
import { createWhatsappLink } from "../../../../shared/utils/whatsapp";
import type { Method } from "../../hooks/useShipping";
import Stepper from "../Stepper";

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
  const servicePrice = service.basePrice + selectedOption.extraPrice;
  const totalPrice = servicePrice + shippingFee;

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!formData.customerId) {
      toast.error("Data pelanggan tidak ditemukan. Silakan kembali ke form sebelumnya.");
      return;
    }

    setIsSubmitting(true);

    const payload: CreateOrderRequest = {
      customer_id: formData.customerId,
      vehicle_id: formData.vehicleId, // Optional if it's not a vehicle service
      service_id: service.id,
      pickup_method: shippingMethod.toUpperCase(),
      pickup_address: formData.address || "",
      customer_tracking_number: "", // Optional
      return_method: "KURIR",
      tax_amount: 0, // Should be updated manually by admin later or estimated
      service_fee: servicePrice,
      admin_fee: 0,
      physical_check_fee: 0,
      delivery_fee: shippingFee,
      express_fee: 0,
      service_level: selectedOption.label.toUpperCase().includes("EXPRESS") ? "EXPRESS" : "REGULAR",
      is_name_transfer_required: false,
      notes: "Pesan dari web",
    };

    toast.promise(
      createOrderApi(payload).then(async (res) => {
        const docId = res.data?.id || "N/A";
        
        // Upload documents if any exist
        if (formData.documents && docId !== "N/A") {
          const uploadPromises: Promise<any>[] = [];
          if (formData.documents.ktp) {
            uploadPromises.push(uploadCustomerDocument(docId, "KTP", formData.documents.ktp));
          }
          if (formData.documents.stnk) {
            uploadPromises.push(uploadCustomerDocument(docId, "STNK", formData.documents.stnk));
          }
          if (formData.documents.bpkb) {
            uploadPromises.push(uploadCustomerDocument(docId, "BPKB", formData.documents.bpkb));
          }
          
          if (uploadPromises.length > 0) {
            try {
              await Promise.all(uploadPromises);
            } catch (uploadErr) {
              console.error("Failed to upload some documents:", uploadErr);
              toast.error("Pesanan dibuat, tetapi beberapa dokumen gagal diunggah.");
            }
          }
        }

        // Trigger Midtrans Snap
        if (docId !== "N/A") {
          try {
            const invoiceRes = await generateInvoiceApi(docId);
            if (invoiceRes.data?.payment_token) {
              window.snap.pay(invoiceRes.data.payment_token, {
                onSuccess: function () {
                  toast.success("Pembayaran berhasil diselesaikan!");
                },
                onPending: function () {
                  toast.success("Menunggu pembayaran Anda!");
                },
                onError: function () {
                  toast.error("Pembayaran gagal atau dibatalkan!");
                }
              });
            }
          } catch (err) {
            console.error("Gagal mendapatkan token pembayaran Midtrans", err);
            toast.error("Gagal memuat pop-up pembayaran otomatis.");
          }
        }

        // Generate WhatsApp message
        let message = `Halo Birosaja, saya ingin memesan layanan berikut:\n\n`;

    message += `📋 *DETAIL LAYANAN*\n`;
    message += `- Layanan: ${service.title} (${selectedOption.label})\n`;
    message += `- Estimasi Selesai: ${selectedOption.duration}\n\n`;

    message += `🚚 *DETAIL PENGIRIMAN*\n`;
    message += `- Metode: ${methodNames[shippingMethod]}\n`;
    if (shippingMethod === "kurir" && formData.address) {
      message += `- Alamat Jemput: ${formData.address}\n`;
      if (typeof formData.distance === "number") {
        message += `- Estimasi Jarak: ${formData.distance.toFixed(1)} km\n`;
      }
    }
    message += `\n`;

    message += `👤 *DATA PENGIRIM & BERKAS*\n`;
    message += `- Nama: ${formData.name || ""}\n`;
    message += `- WhatsApp: ${formData.whatsapp || ""}\n`;

    if (service.category === "STNK") {
      const vType = formData.vehicleType || "";
      const capitalizedVType = vType ? vType.charAt(0).toUpperCase() + vType.slice(1) : "";
      message += `- Tipe Kendaraan: ${capitalizedVType}\n`;
      message += `- Masa STNK: ${formData.duration || ""} Tahun\n`;
      message += `- Plat Kendaraan: B ${formData.plateNumber ? formData.plateNumber.toUpperCase() : ""}\n`;
      message += `- Tahun Kendaraan: ${formData.vehicleYear || ""}\n`;
    } else if (service.category === "Mutasi" || service.category === "BPKB") {
      if (formData.plateNumber) {
        message += `- Plat Kendaraan: B ${formData.plateNumber.toUpperCase()}\n`;
      }
      if (formData.samsatFrom) {
        message += `- Samsat Asal: ${formData.samsatFrom}\n`;
        message += `- Samsat Tujuan: ${formData.samsatTo}\n`;
      }
    } else if (service.category === "SIM") {
      message += `- Tipe SIM: ${formData.simType || ""}\n`;
    } else if (service.category === "Plat Nomor") {
      message += `- Jumlah Angka Plat: ${formData.plateDigit || ""} Angka\n`;
      message += `- Huruf Belakang: ${formData.plateSuffix === "yes" ? "Dengan Huruf" : "Tanpa Huruf"}\n`;
    }
    message += `\n`;

    message += `💳 *METODE PEMBAYARAN TERPILIH*\n`;
    if (paymentMethod === "qris") {
      message += `- Metode: QRIS (E-Wallet / m-Banking)\n`;
    } else if (paymentMethod === "bank") {
      message += `- Metode: Bank Virtual Account (${paymentDetail?.name || ""})\n`;
    } else if (paymentMethod === "ewallet") {
      message += `- Metode: E-Wallet (${paymentDetail?.name || ""})\n`;
      message += `- No. HP: ${paymentDetail?.phone || ""}\n`;
    }
    message += `- Pembayaran akan diproses via Midtrans Gateway.\n\n`;

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
        return res;
      }),
      {
        loading: "Membuat pesanan Anda...",
        success: () => {
          setIsSubmitting(false);
          return "Pesanan berhasil dibuat!";
        },
        error: (err) => {
          setIsSubmitting(false);
          return err.message || "Gagal membuat pesanan. Silakan coba lagi.";
        }
      }
    );
  };

  return (
    <div className="flex flex-col w-full bg-white">
      {/* HEADER */}
      <div className="flex items-center gap-3 p-5 border-b">
        <ArrowLeft onClick={onBack} className="cursor-pointer text-gray-600 hover:text-gray-900" />
        <div>
          <h2 className="text-lg font-semibold">Tinjau Pembayaran & Pesanan</h2>
          <p className="text-sm text-gray-500">Selesaikan tagihan Anda di bawah ini</p>
        </div>
      </div>

      <Stepper currentStep={5} />

      {/* BODY */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 text-sm text-gray-700">
        
        {/* WIDGET INSTRUKSI PEMBAYARAN MIDTRANS */}
        <div className="border border-blue-200 rounded-xl p-4 bg-blue-50/10 space-y-3">
          <p className="text-xs text-blue-700 font-bold uppercase tracking-wider">
            💳 INSTRUKSI PEMBAYARAN ({paymentMethod === "qris" ? "QRIS" : paymentMethod === "bank" ? `VA ${paymentDetail?.name || ""}` : `E-Wallet ${paymentDetail?.name || ""}`})
          </p>

          <div className="bg-white border border-gray-200 p-4 rounded-xl text-center space-y-3 shadow-sm">
            <div className="flex justify-center">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-2xl">
                {paymentMethod === "qris" ? "📱" : paymentMethod === "bank" ? "🏦" : "📲"}
              </div>
            </div>
            
            <h4 className="font-bold text-gray-900">
              {paymentMethod === "qris" 
                ? "Scan QRIS via Midtrans" 
                : paymentMethod === "bank" 
                  ? `Transfer Virtual Account ${paymentDetail?.name || ""}` 
                  : `Bayar via ${paymentDetail?.name || ""}`}
            </h4>
            
            <p className="text-xs text-gray-500 leading-relaxed max-w-xs mx-auto">
              Sistem Midtrans akan memunculkan pop-up resmi berisi 
              {paymentMethod === "qris" 
                ? " kode QR QRIS yang siap Anda scan" 
                : paymentMethod === "bank" 
                  ? " Nomor Virtual Account (VA) untuk Anda transfer" 
                  : " instruksi pembayaran"} 
              <b> SECARA OTOMATIS</b> sesaat setelah Anda menekan tombol <b>Konfirmasi</b> di bawah ini.
            </p>
          </div>
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
            {shippingMethod === "kurir" && typeof formData.distance === "number" && (
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
              <span className="font-semibold text-gray-900">{formData?.name || ""}</span>
            </div>
            <div>
              <span className="text-xs text-gray-400 block">No. WhatsApp</span>
              <span className="font-semibold text-gray-900">{formData?.whatsapp || ""}</span>
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
          disabled={isSubmitting}
          className={`w-full text-white py-3 rounded-xl flex items-center justify-center gap-2 ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {isSubmitting ? (
            <>Memproses...</>
          ) : (
            <>
              <Send size={16} /> Konfirmasi & Kirim via WhatsApp
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
