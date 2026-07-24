import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Service } from "../../data/services";
import type { Method } from "../services/hooks/useShipping";
import StepSelectService from "../services/components/steps/StepSelectService";
import StepShipping from "../services/components/steps/StepShipping";
import StepVehicleForm from "../services/components/steps/StepVehicleForm";
import StepSummary from "../services/components/steps/StepSummary";
import StepSuccess from "../services/components/steps/StepSuccess";
import Header from "../../shared/layout/Header";
import Footer from "../../shared/layout/Footer";

export default function CheckoutPage() {
  const navigate = useNavigate();
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

  const onClose = () => navigate("/");

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center py-12 px-4 sm:px-6">
        <div className="w-full max-w-3xl border border-slate-200 rounded-3xl shadow-2xl bg-white overflow-hidden">
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
                setPaymentMethod("qris");
                setPaymentDetail({ name: "QRIS" });
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
              onBack={() => setStep(3)}
              onNext={() => setStep(6)}
            />
          )}

          {/* STEP 6: PEMESANAN BERHASIL */}
          {step === 6 && (
            <StepSuccess
              shippingMethod={shippingMethod}
              onClose={onClose}
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
