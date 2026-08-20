import {
    ArrowRight,
    Car,
    CheckCircle,
    CreditCard,
    FileText,
    Headphones,
    LayoutGrid,
    Loader2,
    Search,
    ShieldCheck,
    ShoppingCart,
    User,
    Zap
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getServices, type ApiService } from "../../api/services";
import heroImg from "../../assets/hero.png";
import Footer from "../../shared/layout/Footer";
import Header from "../../shared/layout/Header";

interface CategoryStyle {
    bg: string;
    text: string;
    badgeBg: string;
    badgeText: string;
    icon: any;
}

const getCategoryStyle = (category: string): CategoryStyle => {
    const cat = category.toLowerCase();
    if (cat.includes("payment")) {
        return {
            bg: "bg-emerald-50",
            text: "text-emerald-600",
            badgeBg: "bg-emerald-50",
            badgeText: "text-emerald-700",
            icon: CreditCard
        };
    }
    if (cat.includes("mutasi")) {
        return {
            bg: "bg-blue-50",
            text: "text-blue-600",
            badgeBg: "bg-blue-50",
            badgeText: "text-blue-700",
            icon: Car
        };
    }
    if (cat.includes("balik")) {
        return {
            bg: "bg-purple-50",
            text: "text-purple-600",
            badgeBg: "bg-purple-50",
            badgeText: "text-purple-700",
            icon: User
        };
    }
    // Default to Pajak/STNK
    return {
        bg: "bg-amber-50",
        text: "text-amber-600",
        badgeBg: "bg-amber-50",
        badgeText: "text-amber-700",
        icon: FileText
    };
};

const getCategoryFilterIcon = (category: string) => {
    const cat = category.toLowerCase();
    if (cat === "semua") return <LayoutGrid className="w-4 h-4" />;
    if (cat.includes("payment")) return <CreditCard className="w-4 h-4" />;
    if (cat.includes("mutasi")) return <Car className="w-4 h-4" />;
    if (cat.includes("balik")) return <User className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
};

export default function ServicesPage() {
    const [services, setServices] = useState<ApiService[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const location = useLocation();
    const navigate = useNavigate();
    const prefill = location.state?.prefill;
    const vehicleType = prefill?.jenisKendaraan; // 'motor' or 'mobil'
    const tipeLayanan = prefill?.tipeLayanan; // 'tahunan' | '5tahunan' | 'baliknama' | 'mutasi'
    const estimasiPajakTotal = prefill?.estimasiPajakTotal || 0;

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Semua");
    const [selectedPackages, setSelectedPackages] = useState<Record<string, "reguler" | "express">>({});

    const handleSelectPackage = (serviceId: string, pkg: "reguler" | "express") => {
        setSelectedPackages((prev) => ({ ...prev, [serviceId]: pkg }));
    };

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await getServices();
                setServices(response.data);
            } catch (err: any) {
                setError(err.message || "Gagal memuat layanan");
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    const categories = ["Semua", ...Array.from(new Set(services.map(s => s.category)))];

    const filteredServices = services.filter((service) => {
        const matchesSearch = service.service_name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "Semua" || service.category === selectedCategory;

        let matchesVehicle = true;
        if (vehicleType === 'mobil') {
            matchesVehicle = !service.service_name.toLowerCase().includes('motor');
        } else if (vehicleType === 'motor') {
            matchesVehicle = !service.service_name.toLowerCase().includes('mobil');
        }

        let matchesTipeLayanan = true;
        if (tipeLayanan) {
            const name = service.service_name.toLowerCase();
            if (tipeLayanan === 'tahunan') {
                matchesTipeLayanan = name.includes('tahunan') && !name.includes('5 tahunan');
            } else if (tipeLayanan === '5tahunan') {
                matchesTipeLayanan = name.includes('5 tahunan');
            } else if (tipeLayanan === 'baliknama') {
                matchesTipeLayanan = name.includes('balik nama') && !name.includes('mutasi');
            } else if (tipeLayanan === 'mutasi') {
                matchesTipeLayanan = name.includes('mutasi');
            }
        }

        return matchesSearch && matchesCategory && matchesVehicle && matchesTipeLayanan;
    });

    const handleCheckout = (service: ApiService) => {
        const pkg = selectedPackages[service.id] || "reguler";
        const price = (pkg === "reguler" ? service.service_fee : service.express_fee) + estimasiPajakTotal;
        navigate("/checkout", {
            state: {
                checkoutData: { service, pkg, price },
                prefill
            }
        });
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Header />

            <main className="flex-1 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Hero Banner Section */}
                    <div className="relative bg-linear-to-r bg-from-[#031E15] via-[#042C20] to-[#0A3D2F] rounded-3xl overflow-hidden px-8 py-12 md:py-16 text-white mb-10 shadow-lg">
                        {/* Silhouette Image */}
                        <img
                            src={heroImg}
                            alt="Car Banner Outline"
                            className="absolute right-0 bottom-0 top-0 h-full w-[45%] object-cover pointer-events-none opacity-20 mix-blend-overlay hidden md:block"
                        />

                        <div className="relative z-10 max-w-xl">
                            <span className="inline-block bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase mb-4">
                                Layanan Administrasi Kendaraan
                            </span>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
                                Pilih Layanan Anda
                            </h1>
                            <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-8">
                                Temukan layanan administrasi kendaraan yang sesuai dengan kebutuhan Anda.
                            </p>

                            {/* Search Input */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Cari layanan (mis: STNK, Mutasi)..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="block w-full pl-12 pr-4 py-4 border border-transparent rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 bg-white shadow-md transition-all placeholder:text-slate-400"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Category Filter Chips */}
                    <div className="mb-10">
                        <div className="flex flex-wrap gap-3">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer border ${selectedCategory === category
                                        ? "bg-[#007A53] border-[#007A53] text-white shadow-md shadow-emerald-900/15"
                                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                                        }`}
                                >
                                    {getCategoryFilterIcon(category)}
                                    <span>{category}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Services Grid */}
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center">
                            {error}
                        </div>
                    ) : filteredServices.length === 0 ? (
                        <div className="bg-slate-50 border border-slate-200 p-8 rounded-3xl text-center">
                            <p className="text-slate-500 text-lg">Tidak ada layanan yang ditemukan.</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredServices.map((service) => {
                                const styles = getCategoryStyle(service.category);
                                return (
                                    <div
                                        key={service.id}
                                        className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full group"
                                    >
                                        <div className="mb-4">
                                            {/* Dynamic Category Icon Container */}
                                            <div className={`w-12 h-12 rounded-2xl ${styles.bg} ${styles.text} flex items-center justify-center mb-4`}>
                                                <styles.icon className="w-6 h-6" />
                                            </div>

                                            <span className={`inline-block px-3 py-1.5 ${styles.bg} ${styles.text} text-[10px] font-extrabold uppercase tracking-wider rounded-lg mb-3`}>
                                                {service.category}
                                            </span>

                                            <h3 className="text-lg font-bold text-slate-800 leading-tight group-hover:text-emerald-700 transition-colors">
                                                {service.service_name}
                                            </h3>

                                            <p className="text-sm text-slate-500 mt-2 line-clamp-2">
                                                {service.description || `Layanan pengurusan ${service.service_name.toLowerCase()}`}
                                            </p>
                                        </div>

                                        <div className="mt-auto space-y-4">
                                            <div className="bg-slate-50 p-1.5 border border-slate-200/50 rounded-2xl space-y-1">
                                                <button
                                                    onClick={() => handleSelectPackage(service.id, "reguler")}
                                                    className={`w-full flex justify-between items-center py-2.5 px-3 rounded-xl border transition-all duration-200 ${(selectedPackages[service.id] || "reguler") === "reguler"
                                                        ? "bg-[#E8F5E9]/60 border-[#2BB673]/30 text-emerald-800 font-semibold"
                                                        : "border-transparent text-slate-500 hover:bg-slate-100/50"
                                                        }`}
                                                >
                                                    <span className={`text-xs font-semibold cursor-pointer ${(selectedPackages[service.id] || "reguler") === "reguler" ? "text-emerald-700" : "text-slate-500"
                                                        }`}>Reguler</span>
                                                    <span className={`text-sm font-bold cursor-pointer ${(selectedPackages[service.id] || "reguler") === "reguler" ? "text-[#007A53]" : "text-slate-500"
                                                        }`}>
                                                        Rp {(service.service_fee + estimasiPajakTotal).toLocaleString("id-ID")}
                                                    </span>
                                                </button>

                                                <button
                                                    onClick={() => handleSelectPackage(service.id, "express")}
                                                    className={`w-full flex justify-between items-center py-2.5 px-3 rounded-xl border transition-all duration-200 ${selectedPackages[service.id] === "express"
                                                        ? "bg-[#E8F5E9]/60 border-[#2BB673]/30 text-emerald-800 font-semibold"
                                                        : "border-transparent text-slate-500 hover:bg-slate-100/50"
                                                        }`}
                                                >
                                                    <span className={`text-xs font-semibold cursor-pointer ${selectedPackages[service.id] === "express" ? "text-emerald-700" : "text-slate-500"
                                                        }`}>Express</span>
                                                    <span className={`text-sm font-bold cursor-pointer ${selectedPackages[service.id] === "express" ? "text-[#007A53]" : "text-slate-500"
                                                        }`}>
                                                        Rp {(service.express_fee + estimasiPajakTotal).toLocaleString("id-ID")}
                                                    </span>
                                                </button>
                                            </div>
                                            
                                            <p className="text-[10px] text-slate-400 text-center -mt-2">
                                                * Harga belum termasuk biaya admin Rp 25.000 & cek fisik (jika ada)
                                            </p>

                                            <button
                                                onClick={() => handleCheckout(service)}
                                                className="w-full py-3.5 px-4 rounded-xl bg-[#007A53] hover:bg-[#006846] text-white text-sm font-bold transition-all duration-200 flex items-center justify-between shadow-lg shadow-emerald-950/10 hover:shadow-emerald-950/20 group-hover:scale-[1.01] cursor-pointer"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <ShoppingCart className="w-4 h-4 text-emerald-200" />
                                                    <span>Pesan Sekarang</span>
                                                </div>
                                                <ArrowRight className="w-4 h-4 text-emerald-200 group-hover:translate-x-1 transition-transform" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Bottom Highlights Trust Banner */}
                    <div className="mt-16 bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-800">Aman & Terpercaya</h4>
                                <p className="text-xs text-slate-500 mt-0.5">Data Anda terlindungi</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                                <Zap className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-800">Proses Cepat</h4>
                                <p className="text-xs text-slate-500 mt-0.5">Layanan cepat dan efisien</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                <Headphones className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-800">Dukungan 24/7</h4>
                                <p className="text-xs text-slate-500 mt-0.5">Tim kami siap membantu</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-[#ECFDF5] text-emerald-600 flex items-center justify-center shrink-0">
                                <CheckCircle className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-800">100% Transparan</h4>
                                <p className="text-xs text-slate-500 mt-0.5">Tanpa biaya tersembunyi</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
