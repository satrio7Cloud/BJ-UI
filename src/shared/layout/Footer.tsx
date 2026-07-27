import { ShieldCheck, MapPin, Phone, Calendar } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#052e16] text-emerald-100/70 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-12">
          
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-emerald-800/50 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Biro Jasa Prima
              </h3>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              Partner terpercaya untuk perpanjangan pajak dan administrasi kendaraan Anda.
            </p>
          </div>

          {/* Layanan */}
          <div>
            <h4 className="font-bold text-white mb-6">Layanan</h4>
            <ul className="space-y-4 text-sm">
              <li>
                <a href="#layanan" className="hover:text-white transition-colors">
                  Perpanjang Pajak Motor
                </a>
              </li>
              <li>
                <a href="#layanan" className="hover:text-white transition-colors">
                  Perpanjang Pajak Mobil
                </a>
              </li>
              <li>
                <a href="#layanan" className="hover:text-white transition-colors">
                  Pengurusan STNK
                </a>
              </li>
              <li>
                <a href="#layanan" className="hover:text-white transition-colors">
                  Balik Nama & Mutasi
                </a>
              </li>
            </ul>
          </div>

          {/* Informasi */}
          <div>
            <h4 className="font-bold text-white mb-6">Informasi</h4>
            <ul className="space-y-4 text-sm">
              <li>
                <a href="#harga" className="hover:text-white transition-colors">
                  Daftar Harga
                </a>
              </li>
              <li>
                <a href="#beranda" className="hover:text-white transition-colors">
                  Beranda
                </a>
              </li>
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h4 className="font-bold text-white mb-6">Kontak</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Jl. Sudirman No. 123, Jakarta</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>0812-3456-7890</span>
              </li>
              <li className="flex items-center gap-3">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span>Senin - Sabtu: 08.00 - 17.00</span>
              </li>
            </ul>
          </div>

          {/* Jam Operasional */}
          <div>
            <h4 className="font-bold text-white mb-6">Jam Operasional</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex justify-between items-center gap-4">
                <span>Senin - Jumat</span>
                <span>08.00 - 17.00</span>
              </li>
              <li className="flex justify-between items-center gap-4">
                <span>Sabtu</span>
                <span>08.00 - 14.00</span>
              </li>
              <li className="flex justify-between items-center gap-4">
                <span>Minggu</span>
                <span>Tutup</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider & Copyright */}
        <div className="border-t border-emerald-900/50 pt-8 text-center text-sm">
          © {new Date().getFullYear()} Biro Jasa Prima. Seluruh hak cipta dilindungi.
        </div>
      </div>
    </footer>
  );
}
