import { ShieldCheck } from "lucide-react";
import { type ShippingRate } from "../../../../api/shipping";
import Button from "../../../../shared/components/Button";
import { type CheckoutData } from "../types";

interface OrderSummaryCardProps {
  checkoutData: CheckoutData;
  estimasiPajakTotal: number;
  adminFee: number;
  physicalCheckFee: number;
  deliveryFee: number;
  selectedRate: ShippingRate | null;
  isExpedisi: boolean;
  totalDisplayPrice: number;
  isSubmitting: boolean;
  onSubmit: () => void;
}

export default function OrderSummaryCard({
  checkoutData,
  estimasiPajakTotal,
  adminFee,
  physicalCheckFee,
  deliveryFee,
  selectedRate,
  isExpedisi,
  totalDisplayPrice,
  isSubmitting,
  onSubmit,
}: OrderSummaryCardProps) {
  return (
    <div className="bg-slate-900 rounded-3xl p-6 shadow-xl sticky top-24 text-white">
      <h3 className="text-lg font-bold mb-4 border-b border-slate-700 pb-4">
        Ringkasan Pesanan Anda
      </h3>

      <div className="space-y-4 mb-6">
        <div>
          <p className="text-slate-400 text-sm mb-1">Layanan</p>
          <p className="font-semibold text-lg">
            {checkoutData.service.service_name}
          </p>
        </div>
        <div>
          <p className="text-slate-400 text-sm mb-1">Paket Pilihan</p>
          <div className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3 h-3" />
            {checkoutData.pkg}
          </div>
        </div>
        <div className="pt-4 border-t border-slate-700 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-400">Biaya Layanan</span>
            <span className="font-semibold">
              Rp{" "}
              {(checkoutData.pkg === "reguler"
                ? checkoutData.service.service_fee
                : checkoutData.service.express_fee
              ).toLocaleString("id-ID")}
            </span>
          </div>
          {estimasiPajakTotal > 0 && (
            <div className="flex justify-between">
              <span className="text-slate-400">
                Estimasi Pajak (PKB + SWDKLLJ)
              </span>
              <span className="font-semibold">
                Rp {estimasiPajakTotal.toLocaleString("id-ID")}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-slate-400">Biaya Admin</span>
            <span className="font-semibold">
              Rp {adminFee.toLocaleString("id-ID")}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Biaya Cek Fisik</span>
            <span
              className={`font-semibold ${
                physicalCheckFee > 0 ? "text-emerald-400" : ""
              }`}
            >
              Rp {physicalCheckFee.toLocaleString("id-ID")}
            </span>
          </div>
          {isExpedisi && (
            <div className="flex justify-between items-center text-sm">
              <div className="flex flex-col">
                <span className="text-slate-400">Ongkos Kirim</span>
                {selectedRate && (
                  <span className="text-[11px] text-emerald-400 font-medium">
                    {selectedRate.courier_name} (
                    {selectedRate.courier_service_name})
                  </span>
                )}
              </div>
              <span
                className={`font-semibold ${
                  deliveryFee > 0 ? "text-emerald-400" : "text-slate-400"
                }`}
              >
                {deliveryFee > 0
                  ? `Rp ${deliveryFee.toLocaleString("id-ID")}`
                  : "Pilih Kurir"}
              </span>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-slate-700">
          <p className="text-slate-400 text-sm mb-1">Total Biaya</p>
          <p className="text-3xl font-extrabold text-emerald-400">
            Rp {totalDisplayPrice.toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      <Button
        size="full"
        variant="primary"
        onClick={onSubmit}
        isLoading={isSubmitting}
        className="mt-4"
      >
        Pilih Metode Pembayaran
      </Button>
      <p className="text-center text-xs text-slate-400 mt-4">
        Data Anda aman dan dienkripsi dengan standar keamanan tinggi.
      </p>
    </div>
  );
}
