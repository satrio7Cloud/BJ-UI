import { Menu, Phone, ShieldCheck, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menu = [
    { label: "Layanan", href: "#layanan" },
    { label: "Mengapa Kami", href: "#keunggulan" },
    { label: "Proses", href: "#proses" },
    { label: "Testimoni", href: "#testimoni" },
  ];

  const getHref = (href: string) => {
    if (href.startsWith("#")) {
      return location.pathname === "/" ? href : `/${href}`;
    }
    return href;
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 transform-gpu ${scrolled ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100" : "bg-[#FDFBF7] border-b border-transparent"}`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="bg-emerald-900 p-2 rounded-xl text-white group-hover:scale-105 transition-transform">
            <ShieldCheck size={20} />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-xl font-bold text-slate-800 tracking-tight">
              {/* Biro Jasa Prima */} X
            </span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-8">
          {menu.map((item) => {
            const isHash = item.href.startsWith("#");
            const className = "text-sm font-medium text-slate-500 hover:text-emerald-800 transition-colors duration-200";
            
            if (isHash) {
              return (
                <a key={item.label} href={getHref(item.href)} className={className}>
                  {item.label}
                </a>
              );
            }
            return (
              <Link key={item.label} to={item.href} className={className}>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA */}
        <a
          href="#kontak"
          className="hidden md:flex items-center gap-2 bg-transparent border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-semibold px-5 py-2.5 rounded-full transition-all"
        >
          <Phone className="w-4 h-4 text-emerald-800" />
          Hubungi Kami
        </a>

        {/* Mobile Toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden flex items-center justify-center p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden absolute top-full left-0 w-full px-4 pt-2 pb-6 bg-transparent">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 p-3 flex flex-col gap-1">
            {menu.map((item) => {
              const isHash = item.href.startsWith("#");
              const className = "block text-slate-700 hover:text-emerald-800 hover:bg-emerald-50/80 font-semibold py-3 px-4 rounded-xl transition-all";
              
              if (isHash) {
                return (
                  <a
                    key={item.label}
                    href={getHref(item.href)}
                    onClick={() => setOpen(false)}
                    className={className}
                  >
                    {item.label}
                  </a>
                );
              }
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={() => setOpen(false)}
                  className={className}
                >
                  {item.label}
                </Link>
              );
            })}

            <div className="pt-2 mt-2 border-t border-gray-100">
              <a
                href="#kontak"
                onClick={() => setOpen(false)}
                className="bg-emerald-900 text-white flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-bold hover:bg-emerald-800 transition-all shadow-md shadow-emerald-900/20"
              >
                <Phone className="w-5 h-5" />
                Hubungi Kami
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
