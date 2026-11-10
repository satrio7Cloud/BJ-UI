import {
  Car,
  CheckCircle2,
  MapPin,
  Phone,
  ShieldCheck,
  Upload,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { createOrderKTL } from "../../../../api/order";
import Button from "../../../../shared/components/Button";

export default function CetakKtlSection() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    customer_name: "",
    phone_number: "",
    vehicle_type: "Motor",
    region: "Jakarta",

    fee: "",
  });
  const [buktiKtlFile, setBuktiKtlFile] = useState<File | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setFormData({ ...formData, fee: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.customer_name || !formData.phone_number) {
      toast.error("Nama lengkap dan nomor WhatsApp harus diisi");
      return;
    }

    if (!buktiKtlFile) {
      toast.error("Bukti KTL/STNK harus dilampirkan");
      return;
    }

    const feeNum = Number(formData.fee);
    if (feeNum <= 0) {
      toast.error("Biaya seikhlasnya harus lebih dari Rp 0");
      return;
    }
    try {
      setIsLoading(true);
      const payload = new FormData();
      payload.append("customer_name", formData.customer_name);
      payload.append("phone_number", formData.phone_number);
      payload.append("vehicle_type", formData.vehicle_type);
      payload.append("region", formData.region);
      payload.append("fee", feeNum.toString());
      payload.append("bukti_ktl", buktiKtlFile);

      const response = await createOrderKTL(payload);

      if (response.data.snap_token) {
        // Jangan matikan loading dulu, tunggu sampai popup ditutup atau selesai
        (window as any).snap.pay(response.data.snap_token, {
          onSuccess: function (_result: any) {
            toast.success("Pembayaran berhasil! Sedang diproses oleh sistem.");
            setIsSuccess(true);
            setIsLoading(false);
          },
          onPending: function (_result: any) {
            toast.success(
              "Menunggu pembayaran Anda! Silakan selesaikan pembayaran.",
            );
            setIsSuccess(true);
            setIsLoading(false);
          },
          onError: function (_result: any) {
            toast.error("Pembayaran gagal!");
            setIsLoading(false);
          },
          onClose: function () {
            toast.error("Anda belum menyelesaikan pembayaran.");
            setIsLoading(false);
          },
        });
      } else {
        toast.success("Permintaan KTL berhasil dibuat!");
        setIsSuccess(true);
        setIsLoading(false);
      }
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err.message || "Gagal membuat permintaan KTL");
      setIsLoading(false);
    }
    // Catatan: Tidak menggunakan finally { setIsLoading(false) } karena
    // kita ingin tombol tetap loading/disabled selama popup Midtrans terbuka.
  };

  if (isSuccess) {
    return (
      <section className="py-20 bg-transparent">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
            Permintaan Cetak KTL Berhasil!
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6 text-base">
            Terima kasih! Pembayaran Anda sedang diproses oleh sistem. Kami akan
            segera mencetak Kartu Tanda Lunas (KTL) STNK Anda.
          </p>
          <Button variant="primary" onClick={() => setIsSuccess(false)}>
            Buat Permintaan Lainnya
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section id="cetak-ktl" className="py-12 sm:py-20 relative overflow-hidden bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-12 items-center">
          {/* Left Column: Context */}
          <div className="flex-1 text-center lg:text-left">
            <span className="inline-block text-emerald-800 text-xs font-bold tracking-widest uppercase mb-3 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100">
              Layanan Khusus
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              Cetak Resi KTL STNK Resmi
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Bagi Anda yang sudah melakukan pembayaran pajak STNK via online/minimarket (Indomaret, Alfamart, Tokopedia, dll), kami bantu cetak fisik Kartu Tanda Lunas (KTL) aslinya tanpa perlu antre ke Samsat.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 max-w-lg mx-auto lg:mx-0 text-left">
              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white sm:bg-transparent border border-slate-100 sm:border-none shadow-xs sm:shadow-none">
                <div className="w-11 h-11 rounded-xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-emerald-800" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    Resmi & Sah Hukum
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    Proses pencetakan legal dan langsung divalidasi ke Samsat.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white sm:bg-transparent border border-slate-100 sm:border-none shadow-xs sm:shadow-none">
                <div className="w-11 h-11 rounded-xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center shrink-0">
                  <span className="text-emerald-800 font-extrabold text-base">Rp</span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    Biaya Jasa Seikhlasnya
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    Tentukan sendiri nilai apresiasi jasa sesuai kenyamanan Anda.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="flex-1 w-full max-w-xl">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-slate-200/80 shadow-xl shadow-slate-200/50">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                        Nama Lengkap <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="customer_name"
                        value={formData.customer_name}
                        onChange={handleChange}
                        placeholder="Sesuai nama STNK"
                        className="w-full px-3.5 py-3 text-sm rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all placeholder:text-slate-400 font-medium"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5 uppercase tracking-wide">
                        <Phone size={13} className="text-slate-400" />
                        Nomor WhatsApp <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        placeholder="08123456789"
                        className="w-full px-3.5 py-3 text-sm rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all placeholder:text-slate-400 font-medium"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5 uppercase tracking-wide">
                      <Car size={13} className="text-slate-400" />
                      Jenis Kendaraan <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <label
                        className={`flex items-center justify-center py-2.5 px-3 rounded-xl border cursor-pointer transition-all active:scale-95 ${
                          formData.vehicle_type === "Motor"
                            ? "bg-emerald-900 border-emerald-900 text-white shadow-xs font-bold"
                            : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 font-medium"
                        }`}
                      >
                        <input
                          type="radio"
                          name="vehicle_type"
                          value="Motor"
                          checked={formData.vehicle_type === "Motor"}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <span className="text-xs">Motor</span>
                      </label>
                      <label
                        className={`flex items-center justify-center py-2.5 px-3 rounded-xl border cursor-pointer transition-all active:scale-95 ${
                          formData.vehicle_type === "Mobil"
                            ? "bg-emerald-900 border-emerald-900 text-white shadow-xs font-bold"
                            : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 font-medium"
                        }`}
                      >
                        <input
                          type="radio"
                          name="vehicle_type"
                          value="Mobil"
                          checked={formData.vehicle_type === "Mobil"}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <span className="text-xs">Mobil</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5 uppercase tracking-wide">
                      <MapPin size={13} className="text-slate-400" />
                      Wilayah Samsat <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="region"
                      value={formData.region}
                      onChange={handleChange}
                      className="w-full px-3.5 py-3 text-sm rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-semibold"
                      required
                    >
                      <option value="Jakarta">Jakarta</option>
                      <option value="Tangerang">Tangerang</option>
                      <option value="Depok">Depok</option>
                      <option value="Bekasi">Bekasi</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <div>
                      <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5 uppercase tracking-wide">
                        <Upload size={13} className="text-slate-400" />
                        Bukti Bayar / Foto STNK <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) =>
                          setBuktiKtlFile(e.target.files?.[0] || null)
                        }
                        className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-100 file:text-emerald-800 hover:file:bg-emerald-200 cursor-pointer"
                        required
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2 pt-3 border-t border-slate-100">
                    <label className="block text-xs font-bold text-slate-800 mb-1.5 uppercase tracking-wide">
                      Nominal Biaya Jasa (Seikhlasnya){" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <span className="text-slate-400 font-bold text-sm">
                          Rp
                        </span>
                      </div>
                      <input
                        type="text"
                        value={
                          formData.fee
                            ? Number(formData.fee).toLocaleString("id-ID")
                            : ""
                        }
                        onChange={handleFeeChange}
                        placeholder="0"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-emerald-300 bg-emerald-50/40 text-slate-900 text-lg font-black focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 transition-all"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full py-3.5 text-sm sm:text-base font-bold bg-emerald-900 hover:bg-emerald-800 shadow-lg shadow-emerald-900/20 text-white rounded-xl sm:rounded-2xl active:scale-[0.98]"
                    isLoading={isLoading}
                  >
                    Kirim Permintaan & Bayar
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
