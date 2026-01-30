import Contact from "../components/sections/Contact";
import CtaForm from "../components/cta/CtaForm";
import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";
import About from "../components/sections/About";
import Excellence from "../components/sections/Excellence";
import Hero from "../components/sections/Hero";
import Services from "../components/sections/Service";
import Testimonials from "../components/sections/Testimonial";

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
