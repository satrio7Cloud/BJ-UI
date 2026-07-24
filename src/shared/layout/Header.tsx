import { MessageCircle } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const menu = [
    { label: "Beranda", href: "#beranda" },
    { label: "Layanan", href: "#layanan" },
    { label: "Tentang", href: "#tentang" },
    { label: "Keunggulan", href: "#keunggulan" },
    { label: "Garasi Saya", href: "/my-vehicles" },
    { label: "Kontak", href: "#kontak" },
  ];

  const getHref = (href: string) => {
    if (href.startsWith("#")) {
      return location.pathname === "/" ? href : `/${href}`;
    }
    return href;
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-white shadow-sm transform-gpu">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex flex-col leading-tight">
          <span className="text-lg font-bold text-blue-600">
            Urus Kendaraan
          </span>
          <span className="text-xs text-gray-400">
            Cepat • Legal • Transparan
          </span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {menu.map((item) => {
            const isHash = item.href.startsWith("#");
            const className = "relative text-gray-600 hover:text-blue-600 transition after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-0 after:bg-blue-600 after:transition-all hover:after:w-full";
            
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
          className="hidden md:flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition"
        >
          <MessageCircle className="w-4 h-4" />
          Konsultasi
        </a>

        {/* Mobile Toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden rounded-lg p-2 text-gray-600 hover:bg-gray-100"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden px-6 pb-4">
          <div className="bg-white rounded-2xl shadow-xl p-4 space-y-4">
            {menu.map((item) => {
              const isHash = item.href.startsWith("#");
              const className = "block text-gray-700 hover:text-blue-600 font-medium py-1";
              
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

            <a
              href="#kontak"
              onClick={() => setOpen(false)}
              className="bg-green-500 text-white flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold hover:bg-green-600 transition"
            >
              <MessageCircle className="w-5 h-5" />
              Hubungi Kami
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
