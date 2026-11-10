import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../../../shared/layout/Footer";
import Header from "../../../shared/layout/Header";
import CheckoutForm from "./components/CheckoutForm";
import CheckoutHeader from "./components/CheckoutHeader";
import { type CheckoutStep } from "./types";

export default function CheckoutPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [step, setStep] = useState<CheckoutStep>(1);

    // We expect the checkoutData to be passed from the ServicesPage
    const checkoutData = location.state?.checkoutData;

    useEffect(() => {
        // If there is no checkout data, redirect back to services page
        if (!checkoutData) {
            navigate("/layanan", { replace: true });
        }
    }, [checkoutData, navigate]);

    if (!checkoutData) {
        return null; // Will redirect in useEffect
    }

    return (
        <div className="flex-1 flex flex-col bg-transparent relative">
            <Header />

            <main className="flex-1 pt-4 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <button
                        onClick={() => {
                            if (step === 3) {
                                setStep(2);
                                window.scrollTo({ top: 0, behavior: "smooth" });
                            } else if (step === 2) {
                                setStep(1);
                                window.scrollTo({ top: 0, behavior: "smooth" });
                            } else {
                                if (location.state?.prefill) {
                                    navigate("/#cek-pajak");
                                } else {
                                    navigate("/layanan");
                                }
                            }
                        }}
                        className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors mb-4 cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {step === 3
                            ? "Kembali ke Tinjauan Pesanan"
                            : step === 2
                            ? "Kembali ke Formulir Data"
                            : location.state?.prefill
                            ? "Kembali ke Beranda"
                            : "Kembali ke Daftar Layanan"}
                    </button>

                    <CheckoutHeader
                        serviceName={checkoutData.service.service_name}
                        pkg={checkoutData.pkg}
                        step={step}
                        onStepChange={(s) => setStep(s)}
                        checkoutData={checkoutData}
                    />

                    <div className="space-y-6">
                        <CheckoutForm
                            checkoutData={checkoutData}
                            step={step}
                            setStep={setStep}
                            onBack={() => navigate("/layanan", { state: { prefill: location.state?.prefill } })}
                        />
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
