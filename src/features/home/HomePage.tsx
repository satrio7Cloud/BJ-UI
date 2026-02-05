import Contact from "./sections/Contact";
import CtaForm from "../../shared/cta/CtaForm";
import About from "./sections/About";
import Excellence from "./sections/Excellence";
import Hero from "./sections/Hero";
import Services from "./sections/Service";
import Testimonials from "./sections/Testimonial";
import Header from "../../shared/layout/Header";
import Footer from "../../shared/layout/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main id="beranda" className="space-y-16">
        {/* HERO */}
        <Hero />

        {/* LAYANAN */}
        <Services />

        {/* TENTANG KAMI */}
        <About />

        {/* KEUNGGULAN */}
        <Excellence />

        {/* CTA FORM */}
        <CtaForm />

        {/* TESTIMONIAL */}
        <Testimonials />

        <Contact />

        {/* FOOTER */}
        <Footer />
      </main>
    </>
  );
}
