import { ArrowLeft, Loader2, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getServices, type ApiService } from "../../api/services";
import Footer from "../../shared/layout/Footer";
import Header from "../../shared/layout/Header";
import CheckoutForm from "./components/CheckoutForm";

export default function CheckoutPage() {
    const navigate = useNavigate();
    const [services, setServices] = useState<ApiService[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Semua");
    const [selectedPackages, setSelectedPackages] = useState<Record<string, "reguler" | "express">>({});

    // Checkout flow state
    const [checkoutData, setCheckoutData] = useState<{ service: ApiService, pkg: "reguler" | "express", price: number } | null>(null);

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
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Header />

            <main className="flex-1 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">

                    {/* Page Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div>
                            <button
                                onClick={() => checkoutData ? setCheckoutData(null) : navigate("/")}
                                className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-emerald-600 transition-colors mb-4 cursor-pointer"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                {checkoutData ? "Kembali Pilih Layanan" : "Kembali ke Beranda"}
                            </button>
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                                {checkoutData ? "Lengkapi Data Pesanan" : "Pilih Layanan Anda"}
                            </h1>
                            <p className="text-slate-500 mt-2 text-lg">
                                {checkoutData 
                                    ? `Silakan lengkapi data diri dan kendaraan Anda untuk layanan ${checkoutData.service.service_name}.`
                                    : "Temukan layanan administrasi kendaraan yang sesuai dengan kebutuhan Anda."
                                }
                            </p>
                        </div>
                    </div>

                    {/* Checkout Form View */}
                    {checkoutData ? (
                        <CheckoutForm
                            checkoutData={checkoutData}
                            onBack={() => setCheckoutData(null)}
                        />
                    ) : (
                        <>
                            {/* Search and Filter */}
                            <div className="mb-10 space-y-6">
                                <div className="relative max-w-xl">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Search className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Cari layanan (mis: STNK, Mutasi)..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="block w-full pl-11 pr-4 py-3.5 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 bg-white shadow-sm transition-all"
                                    />
                                </div>

                                <div className="flex flex-wrap gap-2 ">
                                    {categories.map((category) => (
                                        <button
                                            key={category}
                                            onClick={() => setSelectedCategory(category)}
                                            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer ${selectedCategory === category
                                                    ? "bg-emerald-600 text-white shadow-md"
                                                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                                                }`}
                                        >
                                            {category}
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
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {filteredServices.map((service) => (
                                        <div
                                            key={service.id}
                                            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-emerald-900/10 transition-all duration-300 flex flex-col h-full group"
                                        >
                                            <div className="mb-4">
                                                <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider rounded-full mb-4">
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
                                                <div className="bg-slate-50 p-2 rounded-2xl space-y-1">
                                                    <button
                                                        onClick={() => handleSelectPackage(service.id, "reguler")}
                                                        className={`w-full flex justify-between items-center p-2 rounded-xl transition-all  ${(selectedPackages[service.id] || "reguler") === "reguler"
                                                                ? "bg-white shadow-[0_2px_8px_-4px_rgba(0,0,0,0.1)] border border-emerald-200"
                                                                : "border border-transparent hover:bg-slate-200/50"
                                                            }`}
                                                    >
                                                        <span className={`text-xs font-semibold cursor-pointer ${(selectedPackages[service.id] || "reguler") === "reguler" ? "text-emerald-700" : "text-slate-500"
                                                            }`}>Reguler</span>
                                                        <span className={`text-sm font-bold cursor-pointer ${(selectedPackages[service.id] || "reguler") === "reguler" ? "text-slate-900" : "text-slate-500"
                                                            }`}>
                                                            Rp {service.service_fee.toLocaleString("id-ID")}
                                                        </span>
                                                    </button>

                                                    <button
                                                        onClick={() => handleSelectPackage(service.id, "express")}
                                                        className={`w-full flex justify-between items-center p-2 rounded-xl transition-all ${selectedPackages[service.id] === "express"
                                                                ? "bg-white shadow-[0_2px_8px_-4px_rgba(0,0,0,0.1)] border border-emerald-200"
                                                                : "border border-transparent hover:bg-slate-200/50"
                                                            }`}
                                                    >
                                                        <span className={`text-xs font-semibold cursor-pointer ${selectedPackages[service.id] === "express" ? "text-emerald-700" : "text-slate-500"
                                                            }`}>Express</span>
                                                        <span className={`text-sm font-bold cursor-pointer ${selectedPackages[service.id] === "express" ? "text-emerald-700" : "text-slate-500"
                                                            }`}>
                                                            Rp {service.express_fee.toLocaleString("id-ID")}
                                                        </span>
                                                    </button>
                                                </div>

                                                <button
                                                    onClick={() => {
                                                        const pkg = selectedPackages[service.id] || "reguler";
                                                        const price = pkg === "reguler" ? service.service_fee : service.express_fee;
                                                        setCheckoutData({ service, pkg, price });
                                                    }}
                                                    className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-sm font-bold transition-colors cursor-pointer"
                                                >
                                                    Pesan Sekarang
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
