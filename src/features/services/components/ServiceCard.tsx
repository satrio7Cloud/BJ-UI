import { ShoppingCart, Clock, Zap } from "lucide-react";
import { useState } from "react";
import type { Service } from "../../../data/services";
import Button from "../../../shared/components/Button";

interface Props {
  service: Service;
  onSelect: (
    service: Service,
    option: Service["options"][0],
    totalPrice: number,
  ) => void;
}

export default function ServiceCard({ service, onSelect }: Props) {
  const [selectedOption, setSelectedOption] = useState(service.options[0]);
  const totalPrice = service.basePrice + selectedOption.extraPrice;

  return (
    <div className="border rounded-2xl p-4 sm:p-5 bg-gray-100 shadow-sm hover:shadow-md transition flex flex-col">
      {/* CATEGORY */}
      <span className="inline-block w-fit text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
        {service.category}
      </span>

      {/* TITLE */}
      <h3 className="font-semibold text-lg mt-4">{service.title}</h3>

      {service.description && (
        <p className="text-sm text-gray-500 mt-1">{service.description}</p>
      )}

      {/* OPTION BUTTONS */}
      <div className="grid grid-cols-2 gap-2 mt-4">
        {service.options.map((opt) => (
          <button
            key={opt.type}
            onClick={() => setSelectedOption(opt)}
            className={`flex-1 border rounded-lg py-2 text-sm transition cursor-pointer ${
              selectedOption.type === opt.type
                ? "border-blue-600 bg-blue-50 text-blue-600"
                : "border-gray-200 hover:border-blue-300"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* DURATION */}
      <div className="flex items-center text-sm text-gray-500 mt-3 gap-2">
        <Clock size={14} />
        {selectedOption.duration}
      </div>

      {/* PRICE */}
      <div className="mt-4 flex items-center justify-between">
        <div>
          {/* <p className="text-xs text-gray-400">Mulai dari</p> */}
          <p className="text-blue-600 text-xl font-bold">
            Rp {totalPrice.toLocaleString("id-ID")}
          </p>
        </div>

        {selectedOption.type === "express" && (
          <span className="flex items-center gap-1 text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
            <Zap size={12} />
            Cepat
          </span>
        )}
      </div>

      {/* BUTTON */}
      <Button
        className="
      mt-5 w-full
      bg-blue-600 hover:bg-blue-700
      active:scale-[0.98]
      transition
      text-white py-3
      rounded-xl
      flex items-center justify-center gap-2
      cursor-pointer
      "
        onClick={() => onSelect(service, selectedOption, totalPrice)}
      >
        <ShoppingCart size={16} />
        Pesan Sekarang
      </Button>
    </div>
  );
}
