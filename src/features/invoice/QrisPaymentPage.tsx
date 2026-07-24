import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CheckCircle2, AlertCircle, RefreshCw, PhoneCall, Receipt, Building2 } from "lucide-react";
import toast from "react-hot-toast";
import { getInvoiceByOrderId, type InvoiceData } from "../../api/invoice";
import OrderTracking from "./OrderTracking";

export default function QrisPaymentPage() {
  const { orderId } = useParams<{ orderId: string }>();
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
            toast.error("Pembayaran belum terdeteksi. Silakan lakukan transfer terlebih dahulu.");
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

  useEffect(() => {
    fetchInvoiceDetails();

    // Auto-poll status every 10 seconds if unpaid
    const interval = setInterval(() => {
      if (invoice && invoice.payment_status?.toUpperCase() !== "PAID") {
        fetchInvoiceDetails();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [orderId, invoice?.payment_status]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-3"></div>
        <p className="text-sm text-slate-500 font-medium">Memuat rincian pembayaran...</p>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 text-center">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
          <AlertCircle size={32} />
        </div>
        <h2 className="text-lg font-bold text-slate-800">Pembayaran Tidak Ditemukan</h2>
        <p className="text-sm text-slate-500 max-w-sm mt-1">
          {error || "Maaf, tautan pembayaran ini tidak valid atau telah kedaluwarsa."}
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
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 py-8">
      <div className="max-w-md w-full space-y-6">
        
        {/* MERCHANT HEADER BANNER (DTerazz) */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/60 flex flex-col items-center text-center space-y-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-blue-600"></div>
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-1">
            <Building2 size={20} />
          </div>
          <h2 className="text-xl font-bold text-slate-900">DTerazz</h2>
          <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
            Jl. Hasan Saban No.59a, Rangkapan Jaya, Kec. Pancoran Mas, Kota Depok, Jawa Barat 16435, Indonesia
          </p>
          <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 mt-1">
            NMID: ID1025378878645
          </span>
        </div>

        {/* QRIS QR CODE CONTAINER CARD */}
        <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200/60 flex flex-col items-center space-y-5">
          
          {/* STYLIZED QRIS LOGO HEADER */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1">
              <span className="text-lg font-black tracking-wider text-slate-900">QRIS</span>
            </div>
            <div className="h-0.5 w-12 bg-slate-900 mt-0.5"></div>
          </div>

          {/* DYNAMIC QR CODE DISPLAY */}
          {isPaid ? (
            <div className="w-64 h-64 rounded-2xl bg-green-50 border border-green-200 flex flex-col items-center justify-center p-4 text-center space-y-3">
              <CheckCircle2 size={48} className="text-green-600" />
              <div>
                <p className="font-bold text-green-800 text-lg">PEMBAYARAN LUNAS</p>
                <p className="text-xs text-green-600 mt-1">Terima kasih, transaksi Anda telah berhasil diproses.</p>
              </div>
            </div>
          ) : (
            <div className="relative p-5 bg-white rounded-2xl border border-slate-200 shadow-inner flex items-center justify-center">
              {/* Decorative Red Corner Overlays (matching QRIS aesthetic) */}
              <div className="absolute top-2 left-2 w-8 h-8 border-t-[5px] border-l-[5px] border-red-600 rounded-tl-lg"></div>
              <div className="absolute top-2 right-2 w-8 h-8 border-t-[5px] border-r-[5px] border-red-600 rounded-tr-lg"></div>
              <div className="absolute bottom-2 left-2 w-8 h-8 border-b-[5px] border-l-[5px] border-red-600 rounded-bl-lg"></div>
              <div className="absolute bottom-2 right-2 w-8 h-8 border-b-[5px] border-r-[5px] border-red-600 rounded-br-lg"></div>

              {invoice.qris_payload ? (
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(invoice.qris_payload)}`}
                  alt="QRIS QR Code"
                  className="w-56 h-56 z-10"
                />
              ) : (
                <div className="w-56 h-56 bg-slate-100 flex items-center justify-center text-slate-400 z-10">
                  QR Code error
                </div>
              )}
            </div>
          )}

          {/* TOTAL PAYMENT & NOMINAL BADGE */}
          <div className="w-full text-center space-y-1">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Total Tagihan</span>
            <span className="text-3xl font-black text-blue-700">
              Rp {(invoice.qris_amount || invoice.total_cost || 0).toLocaleString("id-ID")}
            </span>
            <span className="text-[10px] text-slate-400 block">* Nominal sudah termasuk biaya admin sistem</span>
          </div>

          {/* ACTION BUTTONS */}
          {!isPaid && (
            <div className="w-full grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => fetchInvoiceDetails(true)}
                disabled={isChecking}
                className="w-full flex items-center justify-center gap-1.5 py-3 rounded-xl border border-slate-300 hover:bg-slate-50 font-bold text-slate-700 text-xs transition cursor-pointer disabled:opacity-50"
              >
                <RefreshCw size={14} className={isChecking ? "animate-spin" : ""} />
                Cek Pembayaran
              </button>
              <a
                href={`https://wa.me/628123456789?text=${encodeURIComponent(
                  `Halo, saya ingin mengonfirmasi pembayaran untuk nomor invoice ${invoice.invoice_number} atas nama ${invoice.customer_name}.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-1.5 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-xs transition text-center cursor-pointer"
              >
                <PhoneCall size={14} />
                Hubungi Admin
              </a>
            </div>
          )}
        </div>

        {/* INVOICE & ORDER DETAILS ACCORDION/CARD */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/60 space-y-4">
          <div className="flex items-center gap-2 border-b pb-3 border-slate-100">
            <Receipt size={18} className="text-slate-500" />
            <h3 className="font-bold text-slate-800 text-sm">Rincian Dokumen & Biaya</h3>
          </div>

          {/* DOC / CLIENT DATA */}
          <div className="grid grid-cols-2 gap-y-3 text-xs leading-relaxed border-b pb-4 border-slate-100">
            <div>
              <span className="text-slate-400 block font-medium">Nomor Invoice</span>
              <span className="font-semibold text-slate-800">{invoice.invoice_number}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Pelanggan</span>
              <span className="font-semibold text-slate-800">{invoice.customer_name}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Layanan</span>
              <span className="font-semibold text-slate-800 capitalize">{invoice.service_name}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Plat Kendaraan</span>
              <span className="font-semibold text-slate-800 uppercase">{invoice.vehicle_plate || "-"}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Tanggal Jatuh Tempo</span>
              <span className="font-semibold text-slate-800">{formatDate(invoice.due_date)}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Status Pembayaran</span>
              <span className={`font-bold inline-block px-2.5 py-0.5 rounded-full text-[10px] mt-0.5 uppercase ${
                isPaid ? "bg-green-50 border border-green-200 text-green-700" : "bg-orange-50 border border-orange-200 text-orange-700"
              }`}>
                {invoice.payment_status}
              </span>
            </div>
          </div>

          {/* ITEM COST BREAKDOWN */}
          <div className="space-y-2 pt-1 text-xs">
            <span className="text-slate-400 font-bold block uppercase tracking-wider text-[9px] mb-2">Item Tagihan</span>
            
            {invoice.tax_amount > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>Nilai Pajak Resmi</span>
                <span className="font-medium text-slate-800">Rp {invoice.tax_amount.toLocaleString("id-ID")}</span>
              </div>
            )}
            
            {invoice.service_fee > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>Biaya Jasa</span>
                <span className="font-medium text-slate-800">Rp {invoice.service_fee.toLocaleString("id-ID")}</span>
              </div>
            )}

            {invoice.admin_fee > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>Biaya Admin</span>
                <span className="font-medium text-slate-800">Rp {invoice.admin_fee.toLocaleString("id-ID")}</span>
              </div>
            )}

            {invoice.physical_check_fee > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>Biaya Cek Fisik</span>
                <span className="font-medium text-slate-800">Rp {invoice.physical_check_fee.toLocaleString("id-ID")}</span>
              </div>
            )}

            {invoice.delivery_fee > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>Biaya Pengiriman Berkas</span>
                <span className="font-medium text-slate-800">Rp {invoice.delivery_fee.toLocaleString("id-ID")}</span>
              </div>
            )}

            {invoice.express_fee > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>Layanan Express</span>
                <span className="font-medium text-slate-800">Rp {invoice.express_fee.toLocaleString("id-ID")}</span>
              </div>
            )}

            <div className="border-t border-dashed pt-3 flex justify-between font-bold text-sm text-slate-900 mt-2">
              <span>Total Tagihan</span>
              <span className="text-blue-700">Rp {invoice.total_cost.toLocaleString("id-ID")}</span>
            </div>
          </div>
        </div>

        {/* ORDER TRACKING (CUSTOMER VIEW) */}
        {invoice.order_id && (
          <OrderTracking orderId={invoice.order_id} />
        )}

        {/* FOOTER NOTICE */}
        <div className="text-center text-[10px] text-slate-400">
          <p>© 2026 DTerazz Biro Jasa. Semua Hak Dilindungi.</p>
          <p className="mt-0.5">Layanan pembayaran instan dan otomatis terintegrasi.</p>
        </div>

      </div>
    </div>
  );
}
