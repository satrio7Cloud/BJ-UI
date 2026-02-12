import { Truck, MapPin, Bike, Clock } from "lucide-react";
import { useState } from "react";
import type { Service, ServiceOption } from "../../../data/services";

type Method = "courier" | "office" | "ojol";

interface Props {
  service: Service;
  option: ServiceOption;
  onBack: () => void;
  onNext: () => void;
}

export default function ShippingModal({
  service,
  option,
  onBack,
  onNext,
}: Props) {
  const [method, setMethod] = useState<Method>("courier");

  const total = service.basePrice + option.extraPrice;

  return (
    <div>
      <button onClick={onBack} className="text-blue-600 mb-4">
        ← Kembali
      </button>

      <div className="border rounded-xl p-4 bg-gray-50">
        <p className="font-medium">{service.title}</p>

        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
          Paket {option.label}
          <Clock size={14} />
          {option.duration}
        </div>

        <p className="text-blue-600 font-semibold mt-2">
          Rp {total.toLocaleString("id-ID")}
        </p>
      </div>

      <div className="space-y-3 mt-6">
        <Radio
          active={method === "courier"}
          onClick={() => setMethod("courier")}
          icon={<Truck />}
          title="Jemput Kurir Kami"
        />

        <Radio
          active={method === "office"}
          onClick={() => setMethod("office")}
          icon={<MapPin />}
          title="Datang Langsung"
        />

        <Radio
          active={method === "ojol"}
          onClick={() => setMethod("ojol")}
          icon={<Bike />}
          title="Kirim via Ojol"
        />
      </div>

      <div className="mt-5 bg-blue-50 p-4 rounded-xl text-sm">
        {method === "courier" && (
          <>
            🚚 Kurir kami akan hubungi Anda untuk penjemputan (Depok & sekitar)
          </>
        )}

        {method === "office" && (
          <>
            📍 Jln Hasan Saban Kp.Pulo Depok no.04
            <p>08:00 – 21:00</p>
          </>
        )}

        {method === "ojol" && (
          <>🏍️ Kirim via Gojek / Grab / Maxim (Instant / Same Day)</>
        )}
      </div>

      <button
        onClick={onNext}
        className="mt-6 w-full bg-blue-600 text-white py-3 rounded-xl"
      >
        Lanjutkan
      </button>
    </div>
  );
}

function Radio({ active, onClick, icon, title }: any) {
  return (
    <label
      onClick={onClick}
      className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer ${
        active ? "border-blue-600 bg-blue-50" : ""
      }`}
    >
      <input type="radio" checked={active} readOnly />
      {icon}
      <span className="font-medium">{title}</span>
    </label>
  );
}
