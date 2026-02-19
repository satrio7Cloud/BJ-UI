import { useState } from "react";
import type { Service } from "../../../data/services";
import Modal from "../../../shared/components/Modal";
import StepSelectService from "./steps/StepSelectService";
import StepVehicleForm from "./steps/StepVehicleForm";

export default function ServiceModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedOption, setSelectedOption] = useState<
    Service["options"][0] | null
  >(null);
  const [totalPrice, setTotalPrice] = useState(0);

  return (
    <Modal open onClose={onClose}>
      {step === 1 && (
        <StepSelectService
          onClose={onClose}
          onNext={(service, option, price) => {
            setSelectedService(service);
            setSelectedOption(option);
            setTotalPrice(price);
            setStep(2);
          }}
        />
      )}

      {step === 2 && selectedService && selectedOption && (
        <StepVehicleForm
          service={selectedService}
          selectedOption={selectedOption}
          price={totalPrice}
          onBack={() => setStep(1)}
          onNext={() => setStep(3)}
        />
      )}

      {step === 3 && selectedService && selectedOption && (
        <StepVehicleForm
          service={selectedService}
          selectedOption={selectedOption}
          price={totalPrice}
          onBack={() => setStep(2)}
          onNext={() => setStep(4)}
        />
      )}
    </Modal>
  );
}
