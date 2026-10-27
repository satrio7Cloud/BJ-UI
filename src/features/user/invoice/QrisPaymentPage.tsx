import {
  AlertCircle,
  Building2,
  CheckCircle2,
  CreditCard,
  Loader2,
  PhoneCall,
  Receipt,
  RefreshCw,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { getInvoiceByOrderId, type InvoiceData } from "../../../api/invoice";
import Button from "../../../shared/components/Button";
import { useCompanyProfile } from "../../../shared/hooks/useCompanyProfile";
import { WHATSAPP_NUMBER } from "../../../shared/utils/whatsapp";
import OrderTracking from "./OrderTracking";

declare global {
  interface Window {
    snap: any;
  }
}

export default function QrisPaymentPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { profile: officeProfile } = useCompanyProfile();
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInvoiceDetails = async (showToast = false) => {
    if (!orderId) return;
    try {
      if (showToast) setIsChecking(true);
      const res = await getInvoiceByOrderId(orderId);
      if (res?.data) {
        setInvoice(res.data);
        if (showToast) {
          if (res.data.payment_status?.toUpperCase() === "PAID") {
            toast.success("Pembayaran Terdeteksi: LUNAS!");
          } else {
            toast.error(
              "Pembayaran belum terdeteksi. Silakan lakukan transfer terlebih dahulu.",
            );
          }
        }
      } else {
        setError("Tagihan tidak ditemukan");
      }
    } catch (err: any) {
      console.error("Gagal mengambil data tagihan:", err);
      setError(err.message || "Gagal memuat rincian pembayaran.");
    } finally {
      setIsLoading(false);
      setIsChecking(false);
    }
  };

  const handleBayarSekarang = () => {
    if (!invoice || !invoice.payment_token) {
      toast.error("Token pembayaran tidak ditemukan.");
      return;
    }

    window.snap.pay(invoice.payment_token, {
      onSuccess: function (_result: any) {
        toast.success("Pembayaran berhasil! Sedang diproses oleh sistem.");
        fetchInvoiceDetails(true);
      },
      onPending: function (_result: any) {
        toast.success(
          "Menunggu pembayaran Anda! Silakan selesaikan pembayaran.",
        );
        fetchInvoiceDetails(true);
      },
      onError: function (_result: any) {
        toast.error("Pembayaran gagal atau kedaluwarsa!");
      },
      onClose: function () {
        toast.error("Anda menutup pop-up sebelum menyelesaikan pembayaran");
        fetchInvoiceDetails(false);
      },
    });
  };

  useEffect(() => {
    fetchInvoiceDetails();
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-transparent relative flex flex-col justify-center items-center p-4">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mb-4" />
        <p className="text-slate-600 font-medium">
          Memuat detail pembayaran...
        </p>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen bg-transparent relative flex flex-col justify-center items-center p-4 text-center">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
          <AlertCircle size={32} />
        </div>
        <h2 className="text-lg font-bold text-slate-800">
          Pembayaran Tidak Ditemukan
        </h2>
        <p className="text-sm text-slate-500 max-w-sm mt-1">
          {error ||
            "Maaf, tautan pembayaran ini tidak valid atau telah kedaluwarsa."}
        </p>
      </div>
    );
  }

  const isPaid = invoice.payment_status?.toUpperCase() === "PAID";

  // Format dates
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-transparent relative flex flex-col items-center justify-center p-4 py-8">
      <div className="max-w-md w-full space-y-6 relative z-10">
        {/* MERCHANT HEADER BANNER */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/60 flex flex-col items-center text-center space-y-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-blue-600 via-indigo-600 to-blue-500"></div>
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-1">
            <Building2 size={20} />
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            {officeProfile.office_name || "Biro Jasa DTerazz"}
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
            {officeProfile.full_address ||
              "Layanan Pengurusan Dokumen Kendaraan Resmi & Terpercaya"}
          </p>
          {officeProfile.phone_number && (
            <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 mt-1">
              CS: {officeProfile.phone_number}
            </span>
          )}
        </div>

        {/* MIDTRANS PAYMENT GATEWAY CARD */}
        <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200/60 flex flex-col items-center space-y-5">
          {/* STATUS & HEADER */}
          <div className="w-full flex items-center justify-between border-b pb-3 border-slate-100">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Tagihan Resmi
            </span>
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                isPaid
                  ? "bg-green-100 text-green-700 border border-green-200"
                  : "bg-blue-100 text-blue-700 border border-blue-200"
              }`}
            >
              {isPaid ? "Lunas" : "Menunggu Pembayaran"}
            </span>
          </div>

          {isPaid ? (
            <div className="w-full py-6 px-4 rounded-2xl bg-linear-to-b from-green-50 to-emerald-50/50 border border-green-200 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center shadow-inner">
                <CheckCircle2 size={36} />
              </div>
              <div>
                <h3 className="font-extrabold text-green-900 text-lg">
                  PEMBAYARAN LUNAS
                </h3>
                <p className="text-xs text-green-700 mt-1 max-w-xs">
                  Transaksi Anda berhasil diverifikasi oleh sistem Midtrans.
                  Pesanan sedang diproses oleh admin.
                </p>
              </div>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center text-center space-y-3 py-2">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-sm">
                <CreditCard size={28} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Pembayaran Online Midtrans
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 max-w-xs">
                  Pilih metode pembayaran aman dan instan dengan QRIS, Virtual
                  Account Bank, atau E-Wallet.
                </p>
              </div>

              {/* PAYMENT METHOD BADGES */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-bold text-slate-700 border border-slate-200">
                  QRIS
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-bold text-slate-700 border border-slate-200">
                  BCA VA
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-bold text-slate-700 border border-slate-200">
                  Mandiri
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-bold text-slate-700 border border-slate-200">
                  BNI
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-bold text-slate-700 border border-slate-200">
                  BRI
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-bold text-slate-700 border border-slate-200">
                  GoPay
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-bold text-slate-700 border border-slate-200">
                  ShopeePay
                </span>
              </div>
            </div>
          )}

          {/* TOTAL NOMINAL */}
          <div className="w-full text-center space-y-1 pt-2 border-t border-slate-100">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">
              Total Tagihan
            </span>
            <span className="text-3xl font-black text-blue-700">
              Rp{" "}
              {(invoice.qris_amount || invoice.total_cost || 0).toLocaleString(
                "id-ID",
              )}
            </span>
            <span className="text-[10px] text-slate-400 block">
              * Nominal sudah termasuk seluruh rincian biaya
            </span>
          </div>

          {/* ACTION BUTTONS */}
          {!isPaid && (
            <div className="w-full flex flex-col gap-2.5 pt-1">
              {/* NATIVE MIDTRANS PAY BUTTON */}
              <Button
                variant="primary"
                size="full"
                onClick={handleBayarSekarang}
                disabled={!invoice.payment_token || isChecking}
                className="py-3.5 text-sm font-bold bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/20 rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Zap size={18} className="fill-current" />
                Bayar Sekarang via Midtrans
              </Button>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <Button
                  variant="outline"
                  size="full"
                  onClick={() => fetchInvoiceDetails(true)}
                  disabled={isChecking}
                  className="py-2.5 text-xs text-slate-700 rounded-xl"
                >
                  <RefreshCw
                    size={14}
                    className={isChecking ? "animate-spin" : ""}
                  />
                  Cek Status
                </Button>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                    `Halo, saya ingin mengonfirmasi pembayaran untuk nomor invoice ${invoice.invoice_number} atas nama ${invoice.customer_name}.`,
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-xs transition text-center cursor-pointer"
                >
                  <PhoneCall size={14} />
                  Bantuan Admin
                </a>
              </div>
            </div>
          )}
        </div>

        {/* INVOICE & ORDER DETAILS ACCORDION/CARD */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/60 space-y-4">
          <div className="flex items-center gap-2 border-b pb-3 border-slate-100">
            <Receipt size={18} className="text-slate-500" />
            <h3 className="font-bold text-slate-800 text-sm">
              Rincian Dokumen & Biaya
            </h3>
          </div>

          {/* DOC / CLIENT DATA */}
          <div className="grid grid-cols-2 gap-y-3 text-xs leading-relaxed border-b pb-4 border-slate-100">
            <div>
              <span className="text-slate-400 block font-medium">
                Nomor Invoice
              </span>
              <span className="font-semibold text-slate-800">
                {invoice.invoice_number}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">
                Pelanggan
              </span>
              <span className="font-semibold text-slate-800">
                {invoice.customer_name}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Layanan</span>
              <span className="font-semibold text-slate-800 capitalize">
                {invoice.service_name}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">
                Plat Kendaraan
              </span>
              <span className="font-semibold text-slate-800 uppercase">
                {invoice.vehicle_plate || "-"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">
                Tanggal Jatuh Tempo
              </span>
              <span className="font-semibold text-slate-800">
                {formatDate(invoice.due_date)}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">
                Status Pembayaran
              </span>
              <span
                className={`font-bold inline-block px-2.5 py-0.5 rounded-full text-[10px] mt-0.5 uppercase ${
                  isPaid
                    ? "bg-green-50 border border-green-200 text-green-700"
                    : "bg-orange-50 border border-orange-200 text-orange-700"
                }`}
              >
                {invoice.payment_status}
              </span>
            </div>
          </div>

          {/* ITEM COST BREAKDOWN */}
          <div className="space-y-2 pt-1 text-xs">
            <span className="text-slate-400 font-bold block uppercase tracking-wider text-[9px] mb-2">
              Item Tagihan
            </span>

            {invoice.tax_amount > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>Nilai Pajak Resmi</span>
                <span className="font-medium text-slate-800">
                  Rp {invoice.tax_amount.toLocaleString("id-ID")}
                </span>
              </div>
            )}

            {invoice.service_fee > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>Biaya Jasa</span>
                <span className="font-medium text-slate-800">
                  Rp {invoice.service_fee.toLocaleString("id-ID")}
                </span>
              </div>
            )}

            {invoice.admin_fee > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>Biaya Admin</span>
                <span className="font-medium text-slate-800">
                  Rp {invoice.admin_fee.toLocaleString("id-ID")}
                </span>
              </div>
            )}

            {invoice.physical_check_fee > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>Biaya Cek Fisik</span>
                <span className="font-medium text-slate-800">
                  Rp {invoice.physical_check_fee.toLocaleString("id-ID")}
                </span>
              </div>
            )}

            {invoice.delivery_fee > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>Biaya Pengiriman Berkas</span>
                <span className="font-medium text-slate-800">
                  Rp {invoice.delivery_fee.toLocaleString("id-ID")}
                </span>
              </div>
            )}

            {invoice.express_fee > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>Layanan Express</span>
                <span className="font-medium text-slate-800">
                  Rp {invoice.express_fee.toLocaleString("id-ID")}
                </span>
              </div>
            )}

            <div className="border-t border-dashed pt-3 flex justify-between font-bold text-sm text-slate-900 mt-2">
              <span>Total Tagihan</span>
              <span className="text-blue-700">
                Rp {invoice.total_cost.toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        </div>

        {/* ORDER TRACKING (CUSTOMER VIEW) */}
        {invoice.order_id && <OrderTracking orderId={invoice.order_id} />}

        {/* FOOTER NOTICE */}
        <div className="text-center text-[10px] text-slate-400">
          <p>
            © 2026 {officeProfile.office_name || "Biro Jasa"}. Semua Hak
            Dilindungi.
          </p>
          <p className="mt-0.5">
            Layanan pembayaran online resmi dan aman terintegrasi Midtrans.
          </p>
        </div>
      </div>
    </div>
  );
}
