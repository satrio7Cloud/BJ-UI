import { getPublicAppUrl } from "../../api/config";

export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "6285156419062";

/**
 * Normalisasi nomor HP ke format internasional WhatsApp (62xxxxxxxxxxx)
 */
export const normalizePhoneNumber = (phone: string): string => {
  if (!phone) return "";
  let clean = phone.replace(/\D/g, "");
  if (clean.startsWith("0")) {
    clean = "62" + clean.slice(1);
  } else if (clean.startsWith("8")) {
    clean = "62" + clean;
  }
  return clean;
};

/**
 * Buat tautan WhatsApp ke nomor tertentu dengan pesan opsional
 */
export const createWhatsappLink = (message?: string, targetNumber = WHATSAPP_NUMBER) => {
  const cleanNumber = normalizePhoneNumber(targetNumber);
  const base = `https://wa.me/${cleanNumber}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
};

export interface PaymentReceiptMessageData {
  customerName: string;
  invoiceNumber: string;
  orderId?: string;
  serviceName: string;
  plateNumber: string;
  totalCost: number;
  deliveryMethod?: string;
  officeName?: string;
  trackingUrl?: string;
}

/**
 * Format pesan resmi tanda terima lunas & tautan pelacakan dokumen transparan
 */
export const formatPaymentReceiptMessage = (data: PaymentReceiptMessageData): string => {
  const office = data.officeName || "Biro Jasa DTerazz";
  const trackingLink =
    data.trackingUrl ||
    (data.orderId
      ? `${getPublicAppUrl()}/pay/${data.orderId}`
      : `${getPublicAppUrl()}`);

  const lines = [
    `Halo Bpk/Ibu *${data.customerName || "Pelanggan"}*,`,
    "",
    `Terima kasih! Pembayaran pengurusan dokumen kendaraan Anda telah *BERHASIL DIVERIFIKASI (LUNAS)* oleh sistem kami. ✅`,
    "",
    `📄 *RINCIAN TRANSAKSI RESMI:*`,
    `• No. Invoice: *${data.invoiceNumber || "-"}*`,
    `• Layanan: *${data.serviceName || "-"}*`,
    `• No. Plat Kendaraan: *${data.plateNumber ? data.plateNumber.toUpperCase() : "-"}*`,
    `• Total Pembayaran: *Rp ${data.totalCost.toLocaleString("id-ID")}* (Lunas Otomatis)`,
    data.deliveryMethod ? `• Metode Penyerahan: *${data.deliveryMethod}*` : null,
    "",
    `🔍 *PANTAU STATUS & PROGRES BERKAS:*`,
    `Untuk menjaga transparansi dan kenyamanan Anda, setiap tahapan proses pengerjaan berkas dapat dipantau langsung secara real-time melalui tautan resmi kami:`,
    `👉 ${trackingLink}`,
    "",
    `Dokumen fisik Anda akan segera kami jadwalkan untuk pemrosesan oleh tim biro jasa. Jika ada hal yang ingin ditanyakan, silakan balas pesan ini.`,
    "",
    `Salam hormat,`,
    `*${office}*`,
  ].filter((line) => line !== null);

  return lines.join("\n");
};
