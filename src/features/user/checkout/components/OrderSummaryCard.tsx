import { ArrowRight, ShieldCheck } from "lucide-react";
import { type ShippingRate } from "../../../../api/shipping";
import Button from "../../../../shared/components/Button";
import type { DeliveryMethod } from "../../../../types/deliveryMethod";
import { type CheckoutData, type ShippingScenario } from "../types";

interface OrderSummaryCardProps {
  checkoutData: CheckoutData;
  estimasiPajakTotal: number;
  adminFee: number;
  physicalCheckFee: number;
  deliveryFee: number;
  selectedRate: ShippingRate | null;
  shippingScenario?: ShippingScenario;
  selectedDeliveryMethod?: DeliveryMethod;
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
  selectedDeliveryMethod,
  isExpedisi,
  totalDisplayPrice,
  isSubmitting,
  onSubmit,
}: OrderSummaryCardProps) {
  return (
    <div className="bg-slate-900 rounded-3xl p-6 shadow-xl sticky top-24 text-white">
      <h3 className="text-lg font-bold mb-4 border-b border-slate-700 pb-4 flex items-center justify-between">
        <span>Ringkasan Estimasi</span>
        <span className="text-xs font-normal text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-800">
          Langkah 1/2
        </span>
      </h3>

      <div className="space-y-4 mb-6">
        <div>
          <p className="text-slate-400 text-xs mb-1 uppercase tracking-wider font-semibold">
            Layanan Terpilih
          </p>
          <p className="font-bold text-base leading-snug">
            {checkoutData.service.service_name}
          </p>
        </div>

        <div>
          <p className="text-slate-400 text-xs mb-1 uppercase tracking-wider font-semibold">
            Tingkat Layanan
          </p>
          <div className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            Paket {checkoutData.pkg}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-700 space-y-2.5 text-sm">
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

          {selectedDeliveryMethod?.requires_courier || isExpedisi ? (
            <div className="flex justify-between items-center text-sm pt-1">
              <div className="flex flex-col">
                <span className="text-slate-400">
                  Ongkos Kirim {selectedDeliveryMethod?.direction === "BOTH" ? "(Antar-Jemput)" : "(Pengiriman)"}
                </span>
                {selectedRate ? (
                  <span className="text-[11px] text-emerald-400 font-medium truncate max-w-[150px]">
                    {selectedRate.courier_name} ({selectedRate.courier_service_name})
                  </span>
                ) : (
                  <span className="text-[11px] text-amber-400 font-medium">
                    Belum Pilih Kurir
                  </span>
                )}
              </div>
              <span
                className={`font-semibold ${
                  deliveryFee > 0 ? "text-emerald-400" : "text-amber-300"
                }`}
              >
                {deliveryFee > 0
                  ? `Rp ${deliveryFee.toLocaleString("id-ID")}`
                  : "Pilih Kurir"}
              </span>
            </div>
          ) : selectedDeliveryMethod?.flat_fee && selectedDeliveryMethod.flat_fee > 0 ? (
            <div className="flex justify-between items-center text-sm pt-1">
              <div className="flex flex-col">
                <span className="text-slate-400">Biaya Pengantaran</span>
                <span className="text-[11px] text-emerald-400 font-medium truncate max-w-[150px]">
                  {selectedDeliveryMethod.method_name}
                </span>
              </div>
              <span className="font-semibold text-emerald-400">
                Rp {selectedDeliveryMethod.flat_fee.toLocaleString("id-ID")}
              </span>
            </div>
          ) : (
            <div className="flex justify-between items-center text-sm pt-1">
              <div className="flex flex-col">
                <span className="text-slate-400">Ongkos Kirim</span>
                <span className="text-[11px] text-emerald-400 font-medium">
                  {selectedDeliveryMethod?.method_name || "Datang ke Kantor (Walk-in)"}
                </span>
              </div>
              <span className="font-semibold text-emerald-400">
                Bebas Ongkir (Rp 0)
              </span>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-slate-700">
          <p className="text-slate-400 text-xs uppercase tracking-wider mb-1 font-semibold">
            Estimasi Total Biaya
          </p>
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
        className="mt-4 flex items-center justify-center gap-2 py-3.5 text-sm font-bold shadow-lg shadow-emerald-900/30 cursor-pointer"
      >
        <span>Lanjut ke Tinjau Pesanan</span>
        <ArrowRight className="w-4 h-4" />
      </Button>

      <p className="text-center text-[11px] text-slate-400 mt-3 leading-relaxed">
        Anda dapat meninjau semua rincian data dan kurir sebelum pesanan dibuat secara resmi.
      </p>
    </div>
  );
}
