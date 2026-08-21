import {
    AlertCircle,
    ArrowRight,
    Calculator,
    Car,
    CheckCircle2,
    FileText,
    HelpCircle,
    Sparkles,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function TaxCalculatorSection() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        pajakStnk: "",
        nopol: "",
        tahunKendaraan: new Date().getFullYear().toString(),
        nik: "",
        noRangkaMesin: "",
        jenisKendaraan: "motor" as "motor" | "mobil",
        tipeLayanan: "tahunan" as "tahunan" | "5tahunan" | "baliknama" | "mutasi",
    });

    const [nopolParts, setNopolParts] = useState({ p1: "", p2: "", p3: "" });

    const [calculatedResult, setCalculatedResult] = useState<{
        pkb: number;
        swdkllj: number;
        biayaJasa: number;
        biayaAdmStnkPlat: number;
        totalEstimasi: number;
        isValidated: boolean;
    } | null>(null);

    const handleCalculate = (e: React.FormEvent) => {
        e.preventDefault();

        // Validasi input
        const pkb = parseFloat(formData.pajakStnk.replace(/\D/g, "")) || 0;
        if (pkb <= 0) {
            toast.error(
                "Masukkan nilai harga pajak tahunan yang tertera di STNK Anda",
            );
            return;
        }

        if (
            !formData.nopol.trim() ||
            !/^[A-Z]{1,2}\s?[0-9]{1,4}\s?[A-Z]{1,3}$/i.test(formData.nopol.trim())
        ) {
            toast.error(
                "Format Nomor Polisi (Nopol) tidak valid. Contoh: B 1234 ABC",
            );
            return;
        }

        if (!formData.nik.trim() || formData.nik.trim().length !== 16) {
            toast.error("NIK / Nomor KTP harus 16 digit angka");
            return;
        }

        if (!formData.noRangkaMesin.trim()) {
            toast.error(
                "Nomor Rangka / Nomor Mesin wajib diisi untuk validasi tambahan",
            );
            return;
        }

        const yearInt = parseInt(formData.tahunKendaraan, 10);
        if (
            isNaN(yearInt) ||
            yearInt < 1990 ||
            yearInt > new Date().getFullYear()
        ) {
            toast.error(
                `Tahun kendaraan harus antara 1990 dan ${new Date().getFullYear()}`,
            );
            return;
        }

        // Kalkulasi
        // SWDKLLJ: Motor ~ Rp 35.000, Mobil ~ Rp 143.000
        const swdkllj = formData.jenisKendaraan === "motor" ? 35000 : 153000;

        // Estimasi Biaya Jasa DTerazz
        let biayaJasa = 50000; // Pajak Tahunan
        if (formData.tipeLayanan === "5tahunan") {
            biayaJasa = 100000;
        } else if (formData.tipeLayanan === "baliknama") {
            biayaJasa = 130000;
        } else if (formData.tipeLayanan === "mutasi") {
            biayaJasa = 200000;
        }

        // Biaya Penerbitan Plat/STNK Resmi (Khusus 5 Tahunan / Balik Nama)
        let biayaAdmStnkPlat = 0;
        if (
            formData.tipeLayanan === "5tahunan" ||
            formData.tipeLayanan === "baliknama" ||
            formData.tipeLayanan === "mutasi"
        ) {
            biayaAdmStnkPlat = formData.jenisKendaraan === "motor" ? 185000 : 350000;
        }

        const totalEstimasi = pkb + swdkllj + biayaJasa + biayaAdmStnkPlat;

        setCalculatedResult({
            pkb,
            swdkllj,
            biayaJasa,
            biayaAdmStnkPlat,
            totalEstimasi,
            isValidated: true,
        });

        toast.success("Berhasil dihitung! Yuk, cek estimasi biaya kendaraan Anda.");
    };

    const handleProceedToCheckout = () => {
        if (!calculatedResult) return;

        // Navigasi ke halaman layanan dengan membawa state pre-filled data
        navigate("/layanan", {
            state: {
                prefill: {
                    nopol: formData.nopol.toUpperCase(),
                    nik: formData.nik,
                    tahun: formData.tahunKendaraan,
                    noRangkaMesin: formData.noRangkaMesin,
                    pajakStnk: calculatedResult.pkb,
                    jenisKendaraan: formData.jenisKendaraan,
                    tipeLayanan: formData.tipeLayanan,
                    estimasiPajakTotal: calculatedResult.totalEstimasi - calculatedResult.biayaJasa,
                },
            },
        });
    };

    return (
        <section
            id="cek-pajak"
            className="py-16 md:py-24 relative overflow-hidden"
        >
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
                        <Calculator className="w-4 h-4 text-emerald-600" />
                        Cek Kendaraan anda
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
                        Cek Estimasi Pajak & Biaya Layanan
                    </h2>
                    <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                        Sebelum memilih layanan kami, hitung estimasi total biaya
                        perpanjangan pajak kendaraan Anda berdasarkan data di STNK dan
                        validasi data Anda secara transparan.
                    </p>
                </div>

                <div className="grid lg:grid-cols-12 gap-8 items-start">
                    {/* Left Column: Form Input Manual STNK & Validasi */}
                    <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xl shadow-slate-200/50 relative">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-lg">
                                        Estimasi Pajak Kendaraan
                                    </h3>
                                    <p className="text-xs text-slate-500">
                                        Masukkan nilai sesuai dengan lembar pajak STNK Anda
                                    </p>
                                </div>
                            </div>
                            <span className="hidden sm:inline-flex text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                                Estimasi Biaya
                            </span>
                        </div>

                        <form onSubmit={handleCalculate} className="space-y-5">
                            {/* Jenis Kendaraan Toggle */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                                    Jenis Kendaraan
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setFormData({ ...formData, jenisKendaraan: "motor" })
                                        }
                                        className={`py-3 px-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${formData.jenisKendaraan === "motor"
                                            ? "bg-emerald-900 text-white border-emerald-900 shadow-md shadow-emerald-900/20"
                                            : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                                            }`}
                                    >
                                        <Car className="w-4 h-4" />
                                        Sepeda Motor
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setFormData({ ...formData, jenisKendaraan: "mobil" })
                                        }
                                        className={`py-3 px-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${formData.jenisKendaraan === "mobil"
                                            ? "bg-emerald-900 text-white border-emerald-900 shadow-md shadow-emerald-900/20"
                                            : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                                            }`}
                                    >
                                        <Car className="w-4 h-4" />
                                        Mobil / Roda 4
                                    </button>
                                </div>
                            </div>

                            {/* Tipe Layanan */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                                    Tipe Pengurusan Pajak
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { key: "tahunan", label: "Pajak Tahunan" },
                                        { key: "5tahunan", label: "5 Tahunan / Ganti Plat" },
                                        { key: "baliknama", label: "Balik Nama (1 Wilayah)" },
                                        { key: "mutasi", label: "Mutasi (Beda Wilayah)" },
                                    ].map((t) => (
                                        <button
                                            key={t.key}
                                            type="button"
                                            onClick={() =>
                                                setFormData({ ...formData, tipeLayanan: t.key as any })
                                            }
                                            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer border ${formData.tipeLayanan === t.key
                                                ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                                                : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                                                }`}
                                        >
                                            {t.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Info Box untuk Balik Nama / Mutasi */}
                            {(formData.tipeLayanan === "baliknama" || formData.tipeLayanan === "mutasi") && (
                                <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4 mt-3">
                                    <div className="flex gap-3">
                                        <div className="mt-0.5 shrink-0">
                                            <HelpCircle className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-blue-900 mb-1">Dokumen yang Harus Disiapkan:</h4>
                                            <ul className="text-xs text-blue-800 space-y-1 list-disc ml-4">
                                                <li>KTP asli & fotokopi pemilik baru.</li>
                                                <li>STNK asli beserta fotokopinya.</li>
                                                <li>BPKB asli beserta fotokopinya.</li>
                                                <li>Kwitansi pembelian/jual beli kendaraan bermaterai Rp10.000.</li>
                                            </ul>
                                            {formData.tipeLayanan === "mutasi" && (
                                                <p className="text-xs text-blue-800 mt-2 font-semibold">
                                                    * Untuk proses Mutasi, Anda wajib melakukan proses cabut berkas di Samsat asal terlebih dahulu.
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Main Input: Harga Pajak Tahunan STNK */}
                            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="block text-xs font-bold text-amber-900 uppercase tracking-wide">
                                        Harga Pajak Tahunan di STNK (PKB Pokok) *
                                    </label>
                                    <div className="group relative cursor-pointer">
                                        <HelpCircle className="w-4 h-4 text-amber-600" />
                                        <div className="absolute bottom-full right-0 mb-2 w-64 p-3 bg-slate-900 text-white text-xs rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30">
                                            Lihat di lembar Pajak STNK pada kolom <b>PKB Pokok</b>{" "}
                                            (biasanya di sisi kanan atas lembar STNK).
                                        </div>
                                    </div>
                                </div>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center font-bold text-slate-500 text-sm">
                                        Rp
                                    </span>
                                    <input
                                        type="text"
                                        placeholder="Contoh: 350.000"
                                        value={formData.pajakStnk}
                                        onChange={(e) => {
                                            const raw = e.target.value.replace(/\D/g, "");
                                            const formatted = raw
                                                ? parseInt(raw, 10).toLocaleString("id-ID")
                                                : "";
                                            setFormData({ ...formData, pajakStnk: formatted });
                                        }}
                                        className="w-full pl-12 pr-4 py-3 bg-white border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-slate-900 font-extrabold text-lg"
                                    />
                                </div>
                            </div>

                            {/* Grid 3 Columns: Nopol (span 2) & Tahun (span 1) */}
                            <div className="grid sm:grid-cols-3 gap-4">
                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                                        Nomor Polisi (Nopol) *
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            placeholder="B"
                                            value={nopolParts.p1}
                                            maxLength={2}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/[^A-Za-z]/g, "").toUpperCase();
                                                const newParts = { ...nopolParts, p1: val };
                                                setNopolParts(newParts);
                                                setFormData({ ...formData, nopol: `${newParts.p1} ${newParts.p2} ${newParts.p3}`.trim().replace(/\s+/g, ' ') });
                                            }}
                                            className="w-16 px-2 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none text-slate-900 font-bold uppercase text-center text-sm"
                                        />
                                        <span className="text-slate-400 font-bold">-</span>
                                        <input
                                            type="text"
                                            placeholder="1234"
                                            value={nopolParts.p2}
                                            maxLength={4}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/[^0-9]/g, "");
                                                const newParts = { ...nopolParts, p2: val };
                                                setNopolParts(newParts);
                                                setFormData({ ...formData, nopol: `${newParts.p1} ${newParts.p2} ${newParts.p3}`.trim().replace(/\s+/g, ' ') });
                                            }}
                                            className="flex-1 px-2 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none text-slate-900 font-bold uppercase text-center text-sm tracking-widest"
                                        />
                                        <span className="text-slate-400 font-bold">-</span>
                                        <input
                                            type="text"
                                            placeholder="ABC"
                                            value={nopolParts.p3}
                                            maxLength={3}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/[^A-Za-z]/g, "").toUpperCase();
                                                const newParts = { ...nopolParts, p3: val };
                                                setNopolParts(newParts);
                                                setFormData({ ...formData, nopol: `${newParts.p1} ${newParts.p2} ${newParts.p3}`.trim().replace(/\s+/g, ' ') });
                                            }}
                                            className="w-20 px-2 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none text-slate-900 font-bold uppercase text-center text-sm"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                                        Tahun Kendaraan *
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="Contoh: 2020"
                                        value={formData.tahunKendaraan}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                tahunKendaraan: e.target.value,
                                            })
                                        }
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none text-slate-900 font-semibold text-sm"
                                    />
                                </div>
                            </div>

                            {/* Validasi Tambahan: NIK & No Rangka / Mesin */}
                            <div className="pt-2 border-t border-slate-100 space-y-4">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                                            NIK / Nomor KTP Pemilik *
                                        </label>
                                        <input
                                            type="text"
                                            maxLength={16}
                                            placeholder="16 Digit NIK KTP"
                                            value={formData.nik}
                                            onChange={(e) => {
                                                const val = e.target.value
                                                    .replace(/\D/g, "")
                                                    .slice(0, 16);
                                                setFormData({ ...formData, nik: val });
                                            }}
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none text-slate-900 text-sm font-mono"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                                            No. Rangka / No. Mesin *
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Contoh: MH1JM1110KK12345"
                                            value={formData.noRangkaMesin}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    noRangkaMesin: e.target.value.toUpperCase(),
                                                })
                                            }
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none text-slate-900 text-sm uppercase font-mono"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-4 bg-emerald-900 hover:bg-emerald-800 text-white font-extrabold rounded-2xl transition-all shadow-lg shadow-emerald-950/15 flex items-center justify-center gap-2 text-base cursor-pointer mt-4"
                            >
                                <Calculator className="w-5 h-5" />
                                Hitung Estimasi Biaya Pajak
                            </button>
                        </form>
                    </div>

                    {/* Right Column: Calculations Breakdown & Proceed CTA */}
                    <div className="lg:col-span-5">
                        <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-2xl sticky top-24 border border-slate-800">
                            <div className="flex items-center justify-between border-b border-slate-800 pb-5 mb-6">
                                <h3 className="text-xl font-extrabold flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-emerald-400" />
                                    Hasil Estimasi Biaya
                                </h3>
                                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full">
                                    Transparan
                                </span>
                            </div>

                            {calculatedResult ? (
                                <div className="space-y-6">
                                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-start gap-3 text-emerald-300 text-xs leading-relaxed">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-bold text-sm text-emerald-200">
                                                Validasi Data Berhasil!
                                            </p>
                                            <p className="mt-0.5 text-slate-300">
                                                Plat: <b>{formData.nopol}</b> | NIK:{" "}
                                                <b>{formData.nik}</b>
                                            </p>
                                        </div>
                                    </div>

                                    {/* Breakdown List */}
                                    <div className="space-y-3 border-b border-slate-800 pb-5 text-sm">
                                        <div className="flex justify-between items-center text-slate-300">
                                            <span>PKB (Pajak Pokok STNK)</span>
                                            <span className="font-bold text-white">
                                                Rp {calculatedResult.pkb.toLocaleString("id-ID")}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center text-slate-300">
                                            <div className="flex items-center gap-1.5">
                                                <span>SWDKLLJ</span>
                                                <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">
                                                    {formData.jenisKendaraan === "motor"
                                                        ? "Motor"
                                                        : "Mobil"}
                                                </span>
                                            </div>
                                            <span className="font-bold text-white">
                                                Rp {calculatedResult.swdkllj.toLocaleString("id-ID")}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center text-slate-300">
                                            <span>Biaya Jasa</span>
                                            <span className="font-bold text-white">
                                                Rp {calculatedResult.biayaJasa.toLocaleString("id-ID")}
                                            </span>
                                        </div>

                                        {calculatedResult.biayaAdmStnkPlat > 0 && (
                                            <div className="flex justify-between items-center text-slate-300">
                                                <span>Penerbitan STNK & Plat Baru</span>
                                                <span className="font-bold text-white">
                                                    Rp{" "}
                                                    {calculatedResult.biayaAdmStnkPlat.toLocaleString(
                                                        "id-ID",
                                                    )}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Total Highlight */}
                                    <div className="pt-2">
                                        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
                                            Total Estimasi Keseluruhan
                                        </p>
                                        <p className="text-4xl font-extrabold text-emerald-400 tracking-tight">
                                            Rp{" "}
                                            {calculatedResult.totalEstimasi.toLocaleString("id-ID")}
                                        </p>
                                        <p className="text-[11px] text-slate-400 mt-2">
                                            * Estimasi dapat menyesuaikan jika ada denda keterlambatan
                                            pajak dari Samsat.
                                        </p>
                                    </div>

                                    <button
                                        onClick={handleProceedToCheckout}
                                        className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-2xl transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 text-base cursor-pointer"
                                    >
                                        <span>Lanjutkan Pemesanan Layanan</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                </div>
                            ) : (
                                <div className="py-12 text-center space-y-4">
                                    <div className="w-16 h-16 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center mx-auto">
                                        <AlertCircle className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-300">
                                            Belum Ada Kalkulasi
                                        </h4>
                                        <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
                                            Isi form harga pajak STNK, Nopol, Tahun, NIK, dan Nomor
                                            Rangka di sebelah kiri untuk melihat rincian biaya.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
