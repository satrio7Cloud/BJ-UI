import {
  Building2,
  CheckCircle2,
  Copy,
  CreditCard,
  PhoneCall,
  QrCode,
  Receipt,
  RefreshCw,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { getPublicAppUrl } from "../../../../api/config";
import { type CompanyProfile } from "../../../../api/companyProfile";
import {
  getInvoiceByOrderId,
  syncInvoiceStatusApi,
  type InvoiceData,
} from "../../../../api/invoice";
import Button from "../../../../shared/components/Button";
import {
  createWhatsappLink,
  formatPaymentReceiptMessage,
  WHATSAPP_NUMBER,
} from "../../../../shared/utils/whatsapp";
import { type CheckoutData, type CheckoutFormData } from "../types";

declare global {
  interface Window {
    snap: any;
  }
}

interface CheckoutPaymentStepProps {
  orderId: string;
  initialInvoice?: InvoiceData | null;
  checkoutData: CheckoutData;
  formData: CheckoutFormData;
  deliveryFee: number;
  totalDisplayPrice: number;
  officeProfile?: CompanyProfile;
  onFinish?: () => void;
}

export default function CheckoutPaymentStep({
  orderId,
  initialInvoice,
  checkoutData,
  formData,
  deliveryFee,
  totalDisplayPrice,
  officeProfile,
  onFinish,
}: CheckoutPaymentStepProps) {
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<InvoiceData | null>(
    initialInvoice || null,
  );
  const [isLoading, setIsLoading] = useState(!initialInvoice);
  const [isChecking, setIsChecking] = useState(false);
  const [isOpeningSnap, setIsOpeningSnap] = useState(false);
  const [copiedInvoice, setCopiedInvoice] = useState(false);
  const hasTriggeredSnapAuto = useRef(false);

  // Ambil rincian invoice & sinkronkan status dengan Midtrans
  const fetchInvoice = async (silent = false) => {
    if (!orderId) return;
    try {
      if (!silent) setIsChecking(true);
      let res;
      try {
        res = await syncInvoiceStatusApi(orderId);
      } catch {
        res = await getInvoiceByOrderId(orderId);
      }

      if (res?.data) {
        setInvoice(res.data);
        if (!silent) {
          if (res.data.payment_status?.toUpperCase() === "PAID") {
            toast.success("Status Pembayaran Terverifikasi: LUNAS!");
          } else {
            toast("Status: Menunggu Pembayaran.", { icon: "⏳" });
          }
        }
      }
    } catch (err: any) {
      console.error("Gagal memeriksa invoice:", err);
      if (!silent) {
        toast.error("Gagal memeriksa status pembayaran terbaru.");
      }
    } finally {
      setIsLoading(false);
      setIsChecking(false);
    }
  };

  // Muat snap script jika belum tersedia
  const ensureSnapLoaded = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.snap) {
        resolve(true);
        return;
      }

      const existingScript = document.querySelector(
        'script[src*="midtrans.com/snap/snap.js"]',
      );
      if (existingScript) {
        existingScript.addEventListener("load", () => resolve(true));
        existingScript.addEventListener("error", () => resolve(false));
        return;
      }

      const script = document.createElement("script");
      script.src = "https://app.midtrans.com/snap/snap.js";
      script.setAttribute("data-client-key", "Mid-client-At0tGD3z26S11LZa");
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Buka Pop-up Midtrans Snap
  const handleOpenSnapPayment = async () => {
    const token = invoice?.payment_token;
    if (!token) {
      toast.error("Token pembayaran tidak ditemukan. Coba segarkan halaman.");
      return;
    }

    setIsOpeningSnap(true);
    const isLoaded = await ensureSnapLoaded();

    if (!isLoaded || !window.snap) {
      setIsOpeningSnap(false);
      toast.error(
        "Gagal memuat modul pembayaran. Silakan periksa koneksi internet Anda.",
      );
      return;
    }

    try {
      window.snap.pay(token, {
        onSuccess: function (result: any) {
          console.log("Snap Success:", result);
          toast.success("Pembayaran berhasil diverifikasi!");
          fetchInvoice(true);
        },
        onPending: function (result: any) {
          console.log("Snap Pending:", result);
          toast("Menunggu penyelesaian pembayaran.", { icon: "⏳" });
          fetchInvoice(true);
        },
        onError: function (result: any) {
          console.error("Snap Error:", result);
          toast.error("Pembayaran gagal atau dibatalkan.");
        },
        onClose: function () {
          console.log("Snap Modal closed by user");
          fetchInvoice(true);
        },
      });
    } catch (e: any) {
      console.error("Snap Execution Error:", e);
      toast.error("Terjadi kendala saat membuka gerbang pembayaran.");
    } finally {
      setIsOpeningSnap(false);
    }
  };

  // Trigger otomatis saat pertama kali komponen dibuka jika token ada
  useEffect(() => {
    if (invoice?.payment_token && !hasTriggeredSnapAuto.current) {
      const isPaid = invoice.payment_status?.toUpperCase() === "PAID";
      if (!isPaid) {
        hasTriggeredSnapAuto.current = true;
        // Beri jeda kecil agar DOM selesai me-render tampilan latar belakang
        const timer = setTimeout(() => {
          handleOpenSnapPayment();
        }, 800);
        return () => clearTimeout(timer);
      }
    }
  }, [invoice?.payment_token]);

  // Muat data jika invoice belum ada
  useEffect(() => {
    if (!initialInvoice) {
      fetchInvoice(true);
    }
  }, [orderId]);

  // Polling status berkala jika belum lunas (setiap 10 detik)
  useEffect(() => {
    if (invoice?.payment_status?.toUpperCase() === "PAID") return;

    const interval = setInterval(() => {
      fetchInvoice(true);
    }, 10000);

    return () => clearInterval(interval);
  }, [invoice?.payment_status]);

  const isPaid = invoice?.payment_status?.toUpperCase() === "PAID";
  const displayTotal =
    invoice?.total_cost || invoice?.qris_amount || totalDisplayPrice;

  const copyInvoiceNumber = () => {
    const textToCopy = invoice?.invoice_number || orderId;
    navigator.clipboard.writeText(textToCopy);
    setCopiedInvoice(true);
    toast.success("Nomor referensi disalin!");
    setTimeout(() => setCopiedInvoice(false), 2000);
  };

  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=Halo%20Admin,%20saya%20ingin%20konfirmasi%20pembayaran%20untuk%20Order%20ID:%20${orderId}`;

  const deliveryMethodName =
    formData.pickup_method === "DOOR_TO_DOOR"
      ? "Door-to-Door via Ekspedisi Kurir"
      : formData.pickup_method === "PICKUP_INTERNAL"
        ? "Dijemput Armada Staf Kantor"
        : "Datang Mandiri ke Kantor";

  const receiptMessage = formatPaymentReceiptMessage({
    customerName: formData.fullname || invoice?.customer_name || "",
    invoiceNumber:
      invoice?.invoice_number || `INV-${orderId.slice(0, 8).toUpperCase()}`,
    orderId,
    serviceName:
      checkoutData.service.service_name || invoice?.service_name || "",
    plateNumber: formData.plate_number || invoice?.vehicle_plate || "",
    totalCost: displayTotal,
    deliveryMethod: deliveryMethodName,
    officeName: officeProfile?.office_name,
    trackingUrl: `${getPublicAppUrl()}/pay/${orderId}`,
  });

  const targetCustomerPhone =
    formData.phone_number || invoice?.customer_phone || "";
  const customerReceiptWaLink = createWhatsappLink(
    receiptMessage,
    targetCustomerPhone,
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* 1. Header Banner & Merchant Info */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-emerald-500 via-teal-500 to-blue-600" />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Tagihan Resmi Terbit
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-500 font-medium">
                  {new Date().toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 mt-0.5">
                {officeProfile?.office_name || "Biro Jasa DTerazz"}
              </h2>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-2">
            {isPaid ? (
              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-100 text-emerald-800 border border-emerald-300 font-extrabold text-sm shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>PEMBAYARAN BERHASIL</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-50 text-amber-800 border border-amber-200 font-bold text-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                </span>
                <span>Menunggu Pembayaran</span>
              </div>
            )}
          </div>
        </div>

        {/* Invoice & Order ID Quick Bar */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <span className="text-slate-400">No. Invoice:</span>
            <span className="font-mono font-bold text-slate-900">
              {invoice?.invoice_number ||
                `INV-${orderId.slice(0, 8).toUpperCase()}`}
            </span>
            <button
              type="button"
              onClick={copyInvoiceNumber}
              className="p-1 hover:bg-slate-100 rounded-md text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              title="Salin Nomor Invoice"
            >
              {copiedInvoice ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          <div className="text-slate-500">
            <span>Pelanggan: </span>
            <span className="font-bold text-slate-800">
              {formData.fullname}
            </span>
            <span className="mx-1.5">•</span>
            <span>{formData.phone_number}</span>
          </div>
        </div>
      </div>

      {/* 2. Main Midtrans Card & Payment Action */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Kolom Kiri: Kartu Gerbang Pembayaran Midtrans (3 Kolom) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
            {/* Judul & Deskripsi */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <CreditCard className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-lg">
                  Metode Pembayaran
                </h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed pl-10">
                Pilih kemudahan bertransaksi secara aman melalui QRIS instan,
                Virtual Account Bank resmi, maupun E-Wallet favorit Anda.
              </p>
            </div>

            {/* Total Tagihan Box */}
            <div className="bg-linear-to-br from-slate-900 via-slate-800 to-emerald-950 rounded-2xl p-6 text-white text-center space-y-2 shadow-inner">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Total Tagihan yang Harus Dibayar
              </p>
              <div className="text-3xl sm:text-4xl font-black text-emerald-400 tracking-tight">
                Rp {displayTotal.toLocaleString("id-ID")}
              </div>
              <p className="text-[11px] text-slate-300">
                *Sudah mencakup seluruh biaya jasa, estimasi pajak, dan kurir
                logistik.
              </p>
            </div>

            {/* Jika Pembayaran Sudah LUNAS */}
            {isPaid ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-4 animate-scaleUp">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-black text-emerald-900">
                    Pembayaran Berhasil Diterima!
                  </h4>
                  <p className="text-xs text-emerald-700 max-w-md mx-auto leading-relaxed">
                    Sistem telah memverifikasi pembayaran Anda secara otomatis.
                    Dokumen dan pesanan Anda langsung masuk ke tahap pemrosesan
                    oleh tim biro jasa.
                  </p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href={customerReceiptWaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Kirim Bukti Pembayaran ke WhatsApp Saya</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => navigate(`/pay/${orderId}`)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-50 font-bold text-xs shadow-2xs transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Receipt className="w-4 h-4" />
                    <span>Lihat Struk & Lacak Pesanan</span>
                  </button>

                  {onFinish && (
                    <button
                      type="button"
                      onClick={onFinish}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                    >
                      Selesai
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* Jika Masih Menunggu Pembayaran */
              <div className="space-y-4">
                {/* Midtrans Supported Channels Showcase */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4.5 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 flex items-center gap-1.5">
                      <QrCode className="w-4 h-4 text-emerald-600" />
                      Pilihan Kanal Pembayaran:
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      Verifikasi Otomatis
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    {[
                      "QRIS",
                      "BCA VA",
                      "Mandiri",
                      "BNI",
                      "BRI",
                      "Permata",
                      "GoPay",
                      "ShopeePay",
                    ].map((channel) => (
                      <span
                        key={channel}
                        className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-extrabold text-slate-700 shadow-2xs"
                      >
                        {channel}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tombol Utama Bayar Sekarang Midtrans */}
                <div className="space-y-2.5 pt-2">
                  <Button
                    size="full"
                    variant="primary"
                    onClick={handleOpenSnapPayment}
                    isLoading={isOpeningSnap || isLoading}
                    className="py-4 text-base font-extrabold shadow-lg shadow-emerald-900/30 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Zap className="w-5 h-5 text-amber-300 fill-amber-300" />
                    <span>Bayar Sekarang</span>
                  </Button>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => fetchInvoice(false)}
                      disabled={isChecking}
                      className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-600 py-2 px-3 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <RefreshCw
                        className={`w-3.5 h-3.5 ${
                          isChecking ? "animate-spin text-emerald-600" : ""
                        }`}
                      />
                      <span>Cek Status Pembayaran</span>
                    </button>

                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 py-2 px-3 rounded-xl hover:bg-emerald-50 transition-colors cursor-pointer"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Bantuan CS WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Kolom Kanan: Ringkasan Rincian Pesanan (2 Kolom) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h4 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-slate-100">
              <Receipt className="w-4 h-4 text-emerald-600" />
              Rincian Layanan & Kendaraan
            </h4>

            <div className="space-y-3 text-xs">
              <div>
                <p className="text-slate-400 font-medium">
                  Layanan yang Dipilih
                </p>
                <p className="font-bold text-slate-800 text-sm mt-0.5">
                  {checkoutData.service.service_name}
                </p>
                <div className="inline-flex items-center gap-1 mt-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  Paket {checkoutData.pkg.toUpperCase()}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <p className="text-slate-400 font-medium">Nomor Plat & Tahun</p>
                <p className="font-mono font-bold text-slate-800 text-sm mt-0.5">
                  {formData.plate_number.toUpperCase()}
                  <span className="font-sans text-xs font-normal text-slate-500 ml-2">
                    ({formData.year})
                  </span>
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <p className="text-slate-400 font-medium">
                  Metode Serah Terima Berkas
                </p>
                <p className="font-bold text-slate-800 mt-0.5">
                  {formData.pickup_method === "DOOR_TO_DOOR"
                    ? "Door-to-Door via Ekspedisi Kurir"
                    : formData.pickup_method === "PICKUP_INTERNAL"
                      ? "Dijemput Armada Staf Kantor"
                      : "Datang Mandiri ke Kantor"}
                </p>
              </div>
            </div>

            {/* Rincian Komponen Biaya */}
            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Biaya Jasa Resmi</span>
                <span className="font-semibold text-slate-900">
                  Rp {checkoutData.service.service_fee.toLocaleString("id-ID")}
                </span>
              </div>

              {checkoutData.pkg === "express" &&
                checkoutData.service.express_fee > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>Layanan Prioritas Express</span>
                    <span className="font-semibold text-slate-900">
                      Rp{" "}
                      {checkoutData.service.express_fee.toLocaleString("id-ID")}
                    </span>
                  </div>
                )}

              <div className="flex justify-between text-slate-600">
                <span>Ongkos Kirim Kurir</span>
                <span
                  className={`font-semibold ${
                    deliveryFee === 0 ? "text-emerald-600" : "text-slate-900"
                  }`}
                >
                  {deliveryFee === 0
                    ? "Gratis (Rp 0)"
                    : `Rp ${deliveryFee.toLocaleString("id-ID")}`}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm">
                <span className="font-bold text-slate-900">
                  Total Pembayaran
                </span>
                <span className="font-black text-emerald-600 text-base">
                  Rp {displayTotal.toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            {/* Keamanan & Jaminan */}
            <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Transaksi dijamin aman dan terenkripsi resmi sesuai standar
                perbankan.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
