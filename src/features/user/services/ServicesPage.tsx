import {
  Car,
  CheckCircle,
  CreditCard,
  FileText,
  Headphones,
  LayoutGrid,
  Loader2,
  Search,
  ShieldCheck,
  User,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getServices, type ApiService } from "../../../api/services";
import heroImg from "../../../assets/hero.png";
import Footer from "../../../shared/layout/Footer";
import Header from "../../../shared/layout/Header";
import ServiceCardItem from "./components/ServiceCardItem";

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
  const vehicleType = prefill?.jenisKendaraan;
  const serviceId = prefill?.serviceId;
  const estimasiPajakTotal = prefill?.estimasiPajakTotal || 0;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedPackages, setSelectedPackages] = useState<
    Record<string, "reguler" | "express">
  >({});

  const handleSelectPackage = (id: string, pkg: "reguler" | "express") => {
    setSelectedPackages((prev) => ({ ...prev, [id]: pkg }));
  };

  useEffect(() => {
    let isMounted = true;
    getServices()
      .then((response) => {
        if (isMounted) setServices(response.data || []);
      })
      .catch((err: any) => {
        if (isMounted) setError(err.message || "Gagal memuat layanan");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const categories = [
    "Semua",
    ...Array.from(new Set(services.map((s) => s.category))),
  ];

  const filteredServices = services.filter((service) => {
    const matchesSearch = service.service_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "Semua" || service.category === selectedCategory;

    let matchesVehicle = true;
    if (vehicleType === "mobil") {
      matchesVehicle = !service.service_name.toLowerCase().includes("motor");
    } else if (vehicleType === "motor") {
      matchesVehicle = !service.service_name.toLowerCase().includes("mobil");
    }

    if (serviceId) {
      return service.id === serviceId;
    }

    return matchesSearch && matchesCategory && matchesVehicle;
  });

  const handleCheckout = (service: ApiService) => {
    const pkg = selectedPackages[service.id] || "reguler";
    const price =
      (pkg === "reguler" ? service.service_fee : service.express_fee) +
      estimasiPajakTotal;
    navigate("/checkout", {
      state: {
        checkoutData: { service, pkg, price },
        prefill,
      },
    });
  };

  return (
    <div className="flex-1 flex flex-col bg-transparent relative">
      <Header />

      <main className="flex-1 pt-4 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Banner Section */}
          <div className="relative bg-linear-to-r bg-from-[#031E15] via-[#042C20] to-[#0A3D2F] rounded-3xl overflow-hidden px-8 py-12 md:py-16 text-white mb-10 shadow-lg">
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
                Temukan layanan administrasi kendaraan yang sesuai dengan
                kebutuhan Anda.
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
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer border ${
                    selectedCategory === category
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
              <p className="text-slate-500 text-lg">
                Tidak ada layanan yang ditemukan.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredServices.map((service) => (
                <ServiceCardItem
                  key={service.id}
                  service={service}
                  selectedPkg={selectedPackages[service.id] || "reguler"}
                  onSelectPackage={(pkg) =>
                    handleSelectPackage(service.id, pkg)
                  }
                  onCheckout={() => handleCheckout(service)}
                  estimasiPajakTotal={estimasiPajakTotal}
                />
              ))}
            </div>
          )}

          {/* Bottom Highlights Trust Banner */}
          <div className="mt-16 bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">
                  Aman &amp; Terpercaya
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Data Anda terlindungi
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">
                  Proses Cepat
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Layanan cepat dan efisien
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Headphones className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">
                  Dukungan 24/7
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tim kami siap membantu
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#ECFDF5] text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">
                  100% Transparan
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tanpa biaya tersembunyi
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
