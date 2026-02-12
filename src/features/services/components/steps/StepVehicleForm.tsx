import { Truck, MapPin, Bike, ArrowLeft, Clock, Wallet } from "lucide-react";

import type { Service } from "../../../../data/services";
import Button from "../../../../shared/components/Button";
import ShippingOption from "../ShippingOption";
import Badge from "../Badge";

import { useShipping, type Method } from "../../hooks/useShipping";

interface Props {
  service: Service;
  onNext: (method: Method) => void;
  onBack: () => void;
}

const iconMap = {
  kurir: Truck,
  datang: MapPin,
  ojol: Bike,
};

export default function StepShipping({ service, onNext, onBack }: Props) {
  const { method, setMethod, shippingMethods, shippingDetails } = useShipping();

  return (
    <div className="flex flex-col h-[90vh] max-w-3xl w-full bg-white rounded-2xl">
      {/* HEADER */}
      <div className="flex items-center gap-3 p-5 border-b">
        <ArrowLeft onClick={onBack} className="cursor-pointer" />

        <div>
          <h2 className="text-lg font-semibold">Pilih Pengiriman</h2>
          <p className="text-sm text-gray-500">{service.title}</p>
        </div>
      </div>

      {/* BODY */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {/* SERVICE INFO */}
        <div className="border rounded-2xl p-4 flex gap-4 bg-gray-50">
          <div className="flex-1">
            <p className="font-semibold">{service.title}</p>

            <p className="text-sm text-gray-500 mt-1">{service.description}</p>

            <div className="flex gap-4 mt-3 text-sm">
              <div className="flex items-center gap-1 text-blue-600 font-semibold">
                <Wallet size={14} />
                Rp {service.basePrice.toLocaleString("id-ID")}
              </div>

              <div className="flex items-center gap-1 text-gray-500">
                <Clock size={14} />
                {service.options[0].duration}
              </div>
            </div>
          </div>
        </div>

        {/* SHIPPING OPTIONS */}
        <div className="space-y-4">
          {shippingMethods.map((m) => {
            const Icon = iconMap[m.id];

            return (
              <ShippingOption
                key={m.id}
                active={method === m.id}
                icon={<Icon size={18} />}
                title={m.title}
                subtitle={m.subtitle}
                onClick={() => setMethod(m.id)}
              />
            );
          })}
        </div>

        {/* DETAIL */}
        <div className="bg-orange-50 rounded-xl p-4 text-sm">
          {shippingDetails[method]}

          {method === "ojol" && (
            <div className="flex gap-2 mt-3">
              <Badge>Gojek</Badge>
              <Badge>Grab</Badge>
              <Badge>Maxim</Badge>
            </div>
          )}
        </div>
      </div>

      <div className="p-5 border-t">
        <Button
          onClick={() => onNext(method)}
          className="w-full bg-blue-600 text-white py-3 rounded-xl"
        >
          Lanjutkan
        </Button>
      </div>
    </div>
  );
}
