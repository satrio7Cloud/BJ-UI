import { useState } from "react";
import type { Service } from "../../../data/services";
import type { Method } from "../hooks/useShipping";
import Modal from "../../../shared/components/Modal";
import StepSelectService from "./steps/StepSelectService";
import StepShipping from "./steps/StepShipping";
import StepVehicleForm from "./steps/StepVehicleForm";
import StepPaymentMethod from "./steps/StepPaymentMethod";
import StepSummary from "./steps/StepSummary";
import StepSuccess from "./steps/StepSuccess";

export default function ServiceModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);

  // Flow State
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedOption, setSelectedOption] = useState<Service["options"][0] | null>(null);
  const [basePrice, setBasePrice] = useState(0);
  const [shippingMethod, setShippingMethod] = useState<Method>("kurir");
  const [vehicleData, setVehicleData] = useState<any>(null);
  const [shippingFee, setShippingFee] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<string>("qris");
  const [paymentDetail, setPaymentDetail] = useState<any>({ name: "QRIS" });

  const totalPrice = basePrice + shippingFee;

  return (
    <Modal open onClose={onClose}>
      {/* STEP 1: PILIH LAYANAN */}
      {step === 1 && (
        <StepSelectService
          onClose={onClose}
          onNext={(service, option, price) => {
            setSelectedService(service);
            setSelectedOption(option);
            setBasePrice(price);
            setStep(2);
          }}
        />
      )}

      {/* STEP 2: PILIH PENGIRIMAN */}
      {step === 2 && selectedService && selectedOption && (
        <StepShipping
          service={selectedService}
          selectedOption={selectedOption}
          price={basePrice}
          onBack={() => setStep(1)}
          onNext={(method) => {
            setShippingMethod(method);
            // If they don't choose kurir, reset shipping fee
            if (method !== "kurir") {
              setShippingFee(0);
            }
            setStep(3);
          }}
        />
      )}

      {/* STEP 3: LENGKAPI DATA BERKAS & FORM */}
      {step === 3 && selectedService && selectedOption && (
        <StepVehicleForm
          service={selectedService}
          shippingMethod={shippingMethod}
          onBack={() => setStep(2)}
          onNext={(data, fee) => {
            setVehicleData(data);
            setShippingFee(fee);
            setStep(4);
          }}
        />
      )}

      {/* STEP 4: PILIH METODE PEMBAYARAN */}
      {step === 4 && selectedService && selectedOption && (
        <StepPaymentMethod
          price={totalPrice}
          onBack={() => setStep(3)}
          onNext={(method, detail) => {
            setPaymentMethod(method);
            setPaymentDetail(detail);
            setStep(5);
          }}
        />
      )}

      {/* STEP 5: RINGKASAN PEMESANAN & CHECKOUT PEMBAYARAN */}
      {step === 5 && selectedService && selectedOption && vehicleData && (
        <StepSummary
          service={selectedService}
          selectedOption={selectedOption}
          shippingMethod={shippingMethod}
          formData={vehicleData}
          shippingFee={shippingFee}
          paymentMethod={paymentMethod}
          paymentDetail={paymentDetail}
          onBack={() => setStep(4)}
          onNext={() => setStep(6)}
        />
      )}

      {/* STEP 6: PEMESANAN BERHASIL */}
      {step === 5 || step === 6 ? (
        step === 6 && (
          <StepSuccess
            shippingMethod={shippingMethod}
            onClose={onClose}
          />
        )
      ) : null}
    </Modal>
  );
}
