import { createWhatsappLink } from "../../utils/whatsaap";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold text-white">
              Jasa Pengurus Kendaraan
            </h3>
            <p className="text-sm mt-3 text-gray-400">
              Solusi cepat & terpercaya untuk pengurusan STNK, BPKB, mutasi, dan
              administrasi kendaraan Anda.
            </p>
          </div>

          {/* Menu */}
          <div>
            <h4 className="font-semibold text-white mb-3">Menu</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#beranda" className="hover:text-white">
                  Beranda
                </a>
              </li>
              <li>
                <a href="#layanan" className="hover:text-white">
                  Layanan
                </a>
              </li>
              <li>
                <a href="#keunggulan" className="hover:text-white">
                  Keunggulan
                </a>
              </li>
              <li>
                <a href="#kontak" className="hover:text-white">
                  Kontak
                </a>
              </li>
            </ul>
          </div>

          {/* Layanan */}
          <div>
            <h4 className="font-semibold text-white mb-3">Layanan</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Perpanjang STNK</li>
              <li>Balik Nama BPKB</li>
              <li>Mutasi Kendaraan</li>
              <li>Blokir Kendaraan</li>
              <li>STNK Hilang</li>
              <li>Request Plat Nomor</li>
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h4 className="font-semibold text-white mb-3">Kontak</h4>
            <p className="text-sm text-gray-400">WhatsApp Resmi</p>

            <a
              href={createWhatsappLink("Halo, saya ingin mengurus kendaraan")}
              target="_blank"
              className="inline-block mt-3 bg-green-500 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-green-600 transition"
            >
              Chat WhatsApp
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} Urus Kendaraan. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
