import { useState } from "react";
import type { Service } from "../../../data/services";
import Modal from "../../../shared/components/Modal";
import StepSelectService from "./steps/StepSelectService";
import StepVehicleForm from "./steps/StepVehicleForm";

interface Props {
  onClose: () => void;
}

export default function ServiceModal({ onClose }: Props) {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  return (
    <Modal open onClose={onClose}>
      {step === 1 && (
        <StepSelectService
          onClose={onClose}
          onNext={(service) => {
            setSelectedService(service);
            setStep(2);
          }}
        />
      )}

      {step === 2 && selectedService && (
        <StepVehicleForm
          service={selectedService!}
          onBack={() => setStep(1)}
          onNext={() => setStep(3)}
        />
      )}

      {step === 3 && selectedService && (
        <StepSummary
          service={selectedService!}
          onBack={() => setStep(2)}
          onNext={() => setStep(4)}
        />
      )}

      {step === 4 && <StepSuccess onClose={onClose} />}
    </Modal>
  );
}
