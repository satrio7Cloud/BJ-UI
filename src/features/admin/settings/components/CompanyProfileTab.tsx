import {
  Building2,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  MapPin,
  Phone,
  RotateCcw,
  Save,
  Truck,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  DEFAULT_OFFICE_PROFILE,
  getCompanyProfile,
  updateCompanyProfile,
  type CompanyProfile,
} from "../../../../api/companyProfile";
import Button from "../../../../shared/components/Button";
import { clearCompanyProfileCache } from "../../../../shared/hooks/useCompanyProfile";

export default function CompanyProfileTab() {
  const [formData, setFormData] = useState<CompanyProfile>(
    DEFAULT_OFFICE_PROFILE,
  );
  const [originalData, setOriginalData] = useState<CompanyProfile>(
    DEFAULT_OFFICE_PROFILE,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fetch initial data
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await getCompanyProfile();
      if (res?.data) {
        setFormData(res.data);
        setOriginalData(res.data);
      }
    } catch (err: any) {
      console.warn("Gagal memuat profil kantor:", err);
      toast.error(
        "Gagal memuat profil kantor dari server, menampilkan data default.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (field: keyof CompanyProfile, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setFormData(originalData);
    toast.success("Formulir dikembalikan ke data sebelumnya.");
  };

  const handleCopyAddress = () => {
    const text = `${formData.full_address}${formData.post_code ? `, ${formData.post_code}` : ""}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Alamat kantor berhasil disalin!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi input
    if (!formData.office_name.trim()) {
      toast.error("Nama kantor tidak boleh kosong.");
      return;
    }
    if (!formData.full_address.trim()) {
      toast.error("Alamat lengkap kantor tidak boleh kosong.");
      return;
    }
    const cleanPostal = (
      formData.post_code ||
      formData.postal_code ||
      ""
    ).trim();
    if (
      !cleanPostal ||
      cleanPostal.length !== 5 ||
      !/^\d{5}$/.test(cleanPostal)
    ) {
      toast.error("Kode Pos harus tepat 5 digit angka.");
      return;
    }
    const cleanPhone = formData.phone_number.replace(/\D/g, "");
    if (!cleanPhone || cleanPhone.length < 9) {
      toast.error("Nomor WhatsApp/Telepon kantor tidak valid.");
      return;
    }

    try {
      setIsSaving(true);
      const payload: Partial<CompanyProfile> = {
        office_name: formData.office_name.trim(),
        full_address: formData.full_address.trim(),
        post_code: cleanPostal,
        phone_number: formData.phone_number.trim(),
        operational_hours: formData.operational_hours.trim(),
      };

      const res = await updateCompanyProfile(payload);
      if (res?.data) {
        setFormData(res.data);
        setOriginalData(res.data);
      } else {
        setOriginalData({ ...formData, post_code: cleanPostal });
      }

      // Bersihkan in-memory cache agar frontend langsung merefleksikan perubahan
      clearCompanyProfileCache();
      toast.success("Profil kantor & titik logistik berhasil diperbarui!");
    } catch (err: any) {
      console.error("Gagal menyimpan profil kantor:", err);
      toast.error(err?.message || "Gagal menyimpan perubahan ke server.");
    } finally {
      setIsSaving(false);
    }
  };

  const cleanPhone = formData.phone_number.replace(/\D/g, "");
  const waLink = cleanPhone.startsWith("0")
    ? `https://wa.me/62${cleanPhone.slice(1)}`
    : `https://wa.me/${cleanPhone}`;

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 text-center space-y-3">
        <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Memuat data profil kantor...
        </p>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-12 gap-8 items-start">
      {/* Kolom Kiri: Formulir Pengaturan (7 Cols) */}
      <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
        <div>
          <div className="flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Building2 className="w-4 h-4" />
            <span>Master Data Kantor</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Profil Kantor & Titik Logistik (Origin)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Informasi ini digunakan sebagai titik asal (*origin*) kalkulasi
            ongkir ekspedisi, tujuan paket berkas fisik masuk, dan kontak
            bantuan WhatsApp pelanggan.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 1. Nama Kantor */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Nama Kantor / Usaha Biro Jasa{" "}
              <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Contoh: Urus Berkas Kendaraan"
              value={formData.office_name}
              onChange={(e) => handleChange("office_name", e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none transition-all bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm"
            />
          </div>

          {/* 2. Nomor WhatsApp CS & Kode Pos */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                No. WhatsApp Resmi / CS <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  placeholder="085156419062"
                  value={formData.phone_number}
                  onChange={(e) => handleChange("phone_number", e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none transition-all bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Tujuan pesan bantuan & konfirmasi resi customer
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Kode Pos Kantor (Origin){" "}
                <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  maxLength={5}
                  placeholder="16435"
                  value={formData.post_code || formData.postal_code || ""}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 5);
                    handleChange("post_code", val);
                  }}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none transition-all bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm font-mono font-bold tracking-widest text-center"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Kunci kalkulasi tarif kurir ekspedisi (5 digit)
              </p>
            </div>
          </div>

          {/* 3. Jam Operasional */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Hari & Jam Operasional <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Clock className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Senin – Sabtu (08:00 – 17:00 WIB)"
                value={formData.operational_hours}
                onChange={(e) =>
                  handleChange("operational_hours", e.target.value)
                }
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none transition-all bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Ditampilkan kepada customer yang memilih Walk-in atau kirim berkas
              sendiri
            </p>
          </div>

          {/* 4. Alamat Lengkap Kantor */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Alamat Fisik Kantor Lengkap{" "}
              <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="Contoh: Jl. Hasan Saban Kp.Pulo Kota Depok No. 04, Rt.03/09, Pancoran Mas"
              value={formData.full_address}
              onChange={(e) => handleChange("full_address", e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none transition-all bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm leading-relaxed"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Tulis detail jalan, RT/RW, kelurahan, kecamatan, dan patokan agar
              kurir atau customer mudah menemukan kantor.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={handleReset}
              disabled={isSaving}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>

            <Button
              type="submit"
              variant="primary"
              isLoading={isSaving}
              className="px-6 py-2.5 text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-900/20"
            >
              <Save className="w-4 h-4" />
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </div>

      {/* Kolom Kanan: Live Preview & Penjelasan Logistik (5 Cols) */}
      <div className="lg:col-span-5 space-y-6">
        {/* Live Customer Preview Card */}
        <div className="bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-800 text-white space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Pratinjau Kartu di Sisi Pelanggan
              </h3>
            </div>
            <span className="text-[10px] bg-slate-800 text-emerald-400 px-2 py-0.5 rounded-full font-mono">
              Live Preview
            </span>
          </div>

          {/* Kartu Pratinjau Alamat Kantor */}
          <div className="bg-slate-800/80 rounded-2xl p-4.5 border border-slate-700/80 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                  Alamat Kantor Penerima
                </span>
                <h4 className="font-extrabold text-base text-white mt-0.5">
                  {formData.office_name || "Nama Kantor Biro Jasa"}
                </h4>
              </div>
              <button
                type="button"
                onClick={handleCopyAddress}
                className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
                title="Salin Alamat"
              >
                {copied ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            <div className="space-y-1.5 text-xs text-slate-300">
              <p className="leading-relaxed flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  {formData.full_address ||
                    "Alamat lengkap kantor akan tampil di sini..."}
                  {formData.post_code && (
                    <span className="font-mono font-bold text-white ml-1">
                      (Kode Pos: {formData.post_code})
                    </span>
                  )}
                </span>
              </p>

              <p className="flex items-center gap-2 text-slate-300">
                <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>
                  {formData.operational_hours ||
                    "Senin – Sabtu (08:00 – 17:00 WIB)"}
                </span>
              </p>
            </div>

            <div className="pt-3 border-t border-slate-700/80 flex items-center justify-between text-xs">
              <span className="text-slate-400">WhatsApp Bantuan:</span>
              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                className="font-bold text-emerald-400 hover:underline flex items-center gap-1"
              >
                {formData.phone_number || "08xxxx"}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed italic">
            *Kartu di atas adalah tampilan persis yang dilihat customer saat
            memilih opsi penyerahan berkas ke kantor (Drop-off / Walk-in) atau
            di halaman konfirmasi sukses checkout.
          </p>
        </div>

        {/* Informasi Logistik & Integrasi */}
        <div className="bg-emerald-50 dark:bg-emerald-950/40 rounded-3xl p-6 border border-emerald-200 dark:border-emerald-900/50 space-y-3">
          <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-300 font-bold text-sm">
            <Truck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Bagaimana Titik Logistik Bekerja?</span>
          </div>

          <ul className="text-xs text-emerald-800 dark:text-emerald-300 space-y-2 leading-relaxed">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <b>Kode Pos ({formData.post_code || "16435"}):</b> Digunakan
                oleh sistem sebagai titik koordinat asal pengiriman berkas ke
                customer.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <b>Skenario Antar-Jemput (Door-to-Door):</b> Ongkir dihitung 2x
                tarif ekspedisi pulang-pergi dari kode pos kantor ini ke alamat
                customer.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <b>Integrasi Otomatis:</b> Setiap kali disimpan, cache profil di
                browser langsung dibersihkan sehingga perubahan langsung live
                tanpa restart aplikasi.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
