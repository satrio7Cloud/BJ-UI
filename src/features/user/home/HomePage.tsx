import { useNavigate } from "react-router-dom";
// import CtaForm from "../../../shared/cta/CtaForm";
import Footer from "../../../shared/layout/Footer";
import Header from "../../../shared/layout/Header";
import ServicePrice from "../services/ServicePrice";
import TaxCalculatorSection from "../services/components/TaxCalculatorSection";
import About from "./sections/About";
import CetakKtlSection from "./sections/CetakKtlSection";
import Excellence from "./sections/Excellence";
import Hero from "./sections/Hero";
import HowItWorks from "./sections/HowItWorks";
import Services from "./sections/Service";
import Testimonials from "./sections/Testimonial";

export default function Home() {
    const navigate = useNavigate();
    return (
        <>
            <Header />
            <main id="beranda" className="bg-transparent relative">
                {/* HERO */}
                <Hero />
                {/* SIMULASI & CEK PAJAK KENDARAAN */}
                <TaxCalculatorSection />
                {/* LAYANAN */}
                <Services />
                <Excellence />
                <HowItWorks />
                <ServicePrice onOpenServices={() => navigate("/layanan")} />
                {/* CETAK KTL STNK */}
                <CetakKtlSection />
                {/* TESTIMONIAL */}
                <Testimonials />
                {/* TENTANG KAMI */}
                <About />
                <Footer />
            </main>
        </>
    );
}
