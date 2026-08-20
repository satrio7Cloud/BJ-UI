import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../../../shared/layout/Footer";
import Header from "../../../shared/layout/Header";
import CheckoutForm from "./components/CheckoutForm";
import CheckoutHeader from "./components/CheckoutHeader";

export default function CheckoutPage() {
    const location = useLocation();
    const navigate = useNavigate();
    
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
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Header />

            <main className="flex-1 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <button
                        onClick={() => navigate("/layanan", { state: { prefill: location.state?.prefill } })}
                        className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors mb-4 cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Kembali ke Daftar Layanan
                    </button>
                    <CheckoutHeader 
                        serviceName={checkoutData.service.service_name} 
                        pkg={checkoutData.pkg} 
                    />
                    <div className="space-y-6">
                        <CheckoutForm
                            checkoutData={checkoutData}
                            onBack={() => navigate("/layanan", { state: { prefill: location.state?.prefill } })}
                        />
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
