import { useState } from "react";
import { MessageCircle } from "lucide-react";

export default function Header() {
  const [open, setOpen] = useState(false);

  const menu = [
    { label: "Beranda", href: "#beranda" },
    { label: "Layanan", href: "#layanan" },
    { label: "Tentang", href: "#tentang" },
    { label: "Keunggulan", href: "#keunggulan" },
    { label: "Kontak", href: "#kontak" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <a href="#beranda" className="flex flex-col">
          <span className="text-lg font-bold text-blue-600 leading-none">
            Urus Kendaraan
          </span>
        </a>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {menu.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="
                relative text-gray-600 hover:text-blue-600 transition
                after:absolute after:-bottom-1 after:left-0
                after:h-[2px] after:w-0 after:bg-blue-600
                after:transition-all after:duration-300
                hover:after:w-full
              "
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Mobile Toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-gray-600 hover:bg-gray-100"
          aria-label="Toggle Menu"
        >
          <span className="text-xl">{open ? "✕" : "☰"}</span>
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white shadow-sm">
          <nav className="flex flex-col px-4 py-4 space-y-4 text-sm font-medium text-gray-700">
            {menu.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="hover:text-blue-600 transition"
              >
                {item.label}
              </a>
            ))}

            {/* Mobile CTA */}
            <a
              href="#kontak"
              onClick={() => setOpen(false)}
              className="
                mt-2
                bg-green-500
                text-white
                flex
                items-center
                justify-center
                gap-2
                px-4
                py-3
                rounded-xl
                font-semibold
                hover:bg-green-600
                transition
                "
            >
              <MessageCircle className="w-5 h-5" />
              Hubungi Kami
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
