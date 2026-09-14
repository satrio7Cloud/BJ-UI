import {
    Car,
    CheckCircle2,
    MapPin,
    Phone,
    ShieldCheck,
    Store,
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
        merchant_ref: "",
        fee: "",
    });
    const [buktiKtlFile, setBuktiKtlFile] = useState<File | null>(null);
    const [buktiPembayaranFile, setBuktiPembayaranFile] = useState<File | null>(
        null,
    );

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

        if (
            !formData.customer_name ||
            !formData.phone_number ||
            !formData.merchant_ref
        ) {
            toast.error(
                "Nama lengkap, nomor WhatsApp, dan nama merchant harus diisi",
            );
            return;
        }

        if (!buktiKtlFile || !buktiPembayaranFile) {
            toast.error("Bukti KTL/STNK dan Bukti Pembayaran harus dilampirkan");
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
            payload.append("merchant_ref", formData.merchant_ref);
            payload.append("bukti_ktl", buktiKtlFile);
            payload.append("bukti_pembayaran", buktiPembayaranFile);

            await createOrderKTL(payload);
            toast.success("Permintaan KTL berhasil dibuat!");
            setIsSuccess(true);
        } catch (error: unknown) {
            const err = error as Error;
            toast.error(err.message || "Gagal membuat permintaan KTL");
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
                <div className="max-w-2xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 mb-6">
                        <CheckCircle2 size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                        Permintaan Cetak KTL Berhasil!
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-6 text-base">
                        Terima kasih! Kami akan segera memproses cetak Kartu Tanda Lunas
                        (KTL) STNK Anda. Mohon siapkan bukti pembayaran merchant jika
                        diminta oleh tim kami.
                    </p>
                    <Button variant="primary" onClick={() => setIsSuccess(false)}>
                        Buat Permintaan Lainnya
                    </Button>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 relative overflow-hidden bg-white dark:bg-slate-950">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row gap-12 items-center">
                    {/* Left Column: Context */}
                    <div className="flex-1 text-center lg:text-left">
                        <span className="inline-flex items-center px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider rounded-lg mb-4">
                            Layanan Khusus
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">
                            Cetak Resi KTL STNK
                        </h2>
                        <p className="text-base text-slate-600 dark:text-slate-400 mb-8 max-w-xl mx-auto lg:mx-0">
                            Bagi Anda yang sudah melakukan pembayaran pajak STNK melalui
                            merchant (seperti Indomaret, Alfamart, dll), kami bantu cetak
                            Kartu Tanda Lunas (KTL) aslinya.
                        </p>

                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-slate-800 flex items-center justify-center shrink-0">
                                <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div className="text-left">
                                <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                                    Resmi & Aman
                                </h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Proses pencetakan dijamin valid dan resmi.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-slate-800 flex items-center justify-center shrink-0">
                                <div className="text-emerald-600 dark:text-emerald-400 font-bold">
                                    Rp
                                </div>
                            </div>
                            <div className="text-left">
                                <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                                    Biaya Seikhlasnya
                                </h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Bayar jasa kami sesuai dengan keikhlasan Anda.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Form */}
                    <div className="flex-1 w-full max-w-xl">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                                Nama Lengkap <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="customer_name"
                                                value={formData.customer_name}
                                                onChange={handleChange}
                                                placeholder="Sesuai STNK"
                                                className="w-full px-3 py-2.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                                                <Phone size={14} className="text-slate-400" />
                                                Nomor WhatsApp <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone_number"
                                                value={formData.phone_number}
                                                onChange={handleChange}
                                                placeholder="08123456789"
                                                className="w-full px-3 py-2.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                                            <Car size={14} className="text-slate-400" />
                                            Kendaraan <span className="text-red-500">*</span>
                                        </label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <label
                                                className={`flex items-center justify-center p-2 rounded-lg border cursor-pointer transition-all ${formData.vehicle_type === "Motor"
                                                        ? "bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                                                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
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
                                                <span className="font-medium text-xs">Motor</span>
                                            </label>
                                            <label
                                                className={`flex items-center justify-center p-2 rounded-lg border cursor-pointer transition-all ${formData.vehicle_type === "Mobil"
                                                        ? "bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                                                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
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
                                                <span className="font-medium text-xs">Mobil</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                                            <MapPin size={14} className="text-slate-400" />
                                            Wilayah <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="region"
                                            value={formData.region}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                                            required
                                        >
                                            <option value="Jakarta">Jakarta</option>
                                            <option value="Tangerang">Tangerang</option>
                                            <option value="Depok">Depok</option>
                                        </select>
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                                            <Store size={14} className="text-slate-400" />
                                            Merchant Bayar <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="merchant_ref"
                                            value={formData.merchant_ref}
                                            onChange={handleChange}
                                            placeholder="Indomaret, Alfamart, dll"
                                            className="w-full px-3 py-2.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400"
                                            required
                                        />
                                    </div>

                                    <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                                                <Upload size={14} className="text-slate-400" />
                                                Bukti KTL/STNK <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="file"
                                                accept="image/*,.pdf"
                                                onChange={(e) =>
                                                    setBuktiKtlFile(e.target.files?.[0] || null)
                                                }
                                                className="w-full px-3 py-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-emerald-100 file:text-emerald-700 hover:file:bg-emerald-200 dark:file:bg-emerald-900/30 dark:file:text-emerald-400"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                                                <Upload size={14} className="text-slate-400" />
                                                Bukti Pembayaran <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="file"
                                                accept="image/*,.pdf"
                                                onChange={(e) =>
                                                    setBuktiPembayaranFile(e.target.files?.[0] || null)
                                                }
                                                className="w-full px-3 py-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-emerald-100 file:text-emerald-700 hover:file:bg-emerald-200 dark:file:bg-emerald-900/30 dark:file:text-emerald-400"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="sm:col-span-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                                        <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                                            Biaya Jasa (Seikhlasnya){" "}
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <span className="text-slate-500 font-semibold text-sm">
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
                                                className="w-full pl-9 pr-3 py-3 rounded-lg border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-900/10 text-slate-900 dark:text-white text-base font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-2 mt-2">
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        size="lg"
                                        className="w-full py-3 text-sm bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30 text-white"
                                        isLoading={isLoading}
                                    >
                                        Kirim Permintaan
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
