import { AlertCircle, CheckCircle2, Clock, MapPin, Search, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { getOrderActivity, type OrderActivity, type OrderStatusHistory } from "../../api/order";

interface Props {
  orderId: string;
}

export default function OrderTracking({ orderId }: Props) {
  const [activity, setActivity] = useState<OrderActivity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTracking = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await getOrderActivity(orderId);
        if (res?.data) {
          setActivity(res.data);
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Gagal memuat status pelacakan pesanan.");
      } finally {
        setIsLoading(false);
      }
    };

    if (orderId) {
      fetchTracking();
    }
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-10 bg-white rounded-2xl shadow-sm border border-slate-100">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-3"></div>
        <p className="text-sm text-slate-500 font-medium">Memuat rincian pelacakan...</p>
      </div>
    );
  }

  if (error || !activity) {
    return (
      <div className="p-8 text-center text-red-500 bg-white rounded-2xl shadow-sm border border-red-100">
        <AlertCircle className="mx-auto mb-3 w-10 h-10 text-red-400" />
        <h3 className="text-lg font-bold text-slate-800 mb-1">Data Tidak Ditemukan</h3>
        <p className="text-sm text-slate-500">{error || "Data pelacakan untuk nomor pesanan ini tidak tersedia."}</p>
      </div>
    );
  }

  const getIconForStatus = (status: string) => {
    switch (status) {
      case "Pending":
        return <Clock className="w-5 h-5" />;
      case "Ready":
      case "Processing":
        return <Search className="w-5 h-5" />;
      case "Pick-up":
        return <Truck className="w-5 h-5" />;
      case "Completed":
        return <CheckCircle2 className="w-5 h-5" />;
      default:
        return <MapPin className="w-5 h-5" />;
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200/60 max-w-2xl mx-auto w-full">
      <div className="border-b border-slate-100 pb-5 mb-6 text-center">
        <h2 className="text-xl font-bold text-slate-900 mb-1">Pelacakan Status Pesanan</h2>
        <p className="text-sm text-slate-500">Pantau proses pengerjaan layanan Anda</p>
      </div>

      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-6.5 sm:left-6.75 top-4 bottom-4 w-0.5 bg-slate-100" />

        <div className="space-y-8 relative">
          {activity.history && activity.history.length > 0 ? (
            activity.history.map((hist: OrderStatusHistory, idx: number) => {
              const isLatest = idx === 0;
              return (
                <div key={idx} className="flex gap-4 items-start relative">
                  {/* Status Icon Indicator */}
                  <div className={`relative z-10 flex items-center justify-center w-14 h-14 rounded-full shrink-0 border-4 border-white ${
                    isLatest 
                      ? "bg-blue-100 text-blue-600 shadow-sm" 
                      : "bg-slate-100 text-slate-400"
                  }`}>
                    {getIconForStatus(hist.status)}
                  </div>
                  
                  {/* Status Content */}
                  <div className={`pt-2 ${isLatest ? "opacity-100" : "opacity-60"}`}>
                    <h4 className={`text-base font-bold ${isLatest ? "text-slate-900" : "text-slate-700"}`}>
                      {hist.status}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium mb-1.5 flex items-center gap-1.5 mt-1">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(hist.created_at).toLocaleString("id-ID", {
                        weekday: 'long', day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
                      })}
                    </p>
                    {hist.notes && (
                      <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl mt-2 text-sm text-slate-700">
                        {hist.notes}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-6 text-slate-500">
              Belum ada pembaruan status untuk pesanan ini.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
