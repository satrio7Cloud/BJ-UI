import {
  ArrowRight,
  Car,
  CreditCard,
  FileText,
  ShoppingCart,
  User,
  Zap,
} from "lucide-react";
import type { ApiService } from "../../../../api/services";
import Button from "../../../../shared/components/Button";

interface CategoryStyle {
  bg: string;
  text: string;
  badgeBg: string;
  badgeText: string;
  icon: any;
}

export const getCategoryStyle = (category: string): CategoryStyle => {
  const cat = category.toLowerCase();
  if (cat.includes("payment")) {
    return {
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      badgeBg: "bg-emerald-50",
      badgeText: "text-emerald-700",
      icon: CreditCard,
    };
  }
  if (cat.includes("mutasi")) {
    return {
      bg: "bg-blue-50",
      text: "text-blue-600",
      badgeBg: "bg-blue-50",
      badgeText: "text-blue-700",
      icon: Car,
    };
  }
  if (cat.includes("balik")) {
    return {
      bg: "bg-purple-50",
      text: "text-purple-600",
      badgeBg: "bg-purple-50",
      badgeText: "text-purple-700",
      icon: User,
    };
  }
  return {
    bg: "bg-amber-50",
    text: "text-amber-600",
    badgeBg: "bg-amber-50",
    badgeText: "text-amber-700",
    icon: FileText,
  };
};

interface Props {
  service: ApiService;
  selectedPkg: "reguler" | "express";
  onSelectPackage: (pkg: "reguler" | "express") => void;
  onCheckout: () => void;
  estimasiPajakTotal?: number;
}

export default function ServiceCardItem({
  service,
  selectedPkg,
  onSelectPackage,
  onCheckout,
  estimasiPajakTotal = 0,
}: Props) {
  const styles = getCategoryStyle(service.category);
  const hasExpress = service.express_fee > 0;

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full group">
      <div className="mb-4">
        {/* Dynamic Category Icon Container */}
        <div
          className={`w-12 h-12 rounded-2xl ${styles.bg} ${styles.text} flex items-center justify-center mb-4`}
        >
          <styles.icon className="w-6 h-6" />
        </div>

        <span
          className={`inline-block px-3 py-1.5 ${styles.bg} ${styles.text} text-[10px] font-extrabold uppercase tracking-wider rounded-lg mb-3`}
        >
          {service.category}
        </span>

        <h3 className="text-lg font-bold text-slate-800 leading-tight group-hover:text-emerald-700 transition-colors">
          {service.service_name}
        </h3>

        <p className="text-sm text-slate-500 mt-2 line-clamp-2">
          {service.description ||
            `Layanan pengurusan ${service.service_name.toLowerCase()}`}
        </p>
      </div>

      <div className="mt-auto space-y-4">
        <div className="bg-slate-50 p-1.5 border border-slate-200/50 rounded-2xl space-y-1">
          {/* Reguler Option */}
          <button
            type="button"
            onClick={() => onSelectPackage("reguler")}
            className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition-all text-left cursor-pointer ${
              selectedPkg === "reguler"
                ? "bg-white border-emerald-500 shadow-xs"
                : "border-transparent hover:bg-slate-100/60"
            }`}
          >
            <div className="flex items-center gap-2">
              <div
                className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                  selectedPkg === "reguler"
                    ? "border-emerald-500 bg-emerald-500"
                    : "border-slate-300"
                }`}
              >
                {selectedPkg === "reguler" && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </div>
              <span
                className={`text-xs font-bold ${
                  selectedPkg === "reguler"
                    ? "text-emerald-700"
                    : "text-slate-600"
                }`}
              >
                Reguler
              </span>
            </div>
            <span
              className={`text-sm font-bold ${
                selectedPkg === "reguler"
                  ? "text-emerald-700"
                  : "text-slate-500"
              }`}
            >
              Rp{" "}
              {(service.service_fee + estimasiPajakTotal).toLocaleString(
                "id-ID",
              )}
            </span>
          </button>

          {/* Express Option */}
          {hasExpress && (
            <button
              type="button"
              onClick={() => onSelectPackage("express")}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition-all text-left cursor-pointer ${
                selectedPkg === "express"
                  ? "bg-white border-[#007A53] shadow-xs"
                  : "border-transparent hover:bg-slate-100/60"
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                    selectedPkg === "express"
                      ? "border-[#007A53] bg-[#007A53]"
                      : "border-slate-300"
                  }`}
                >
                  {selectedPkg === "express" && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-xs font-bold ${
                      selectedPkg === "express"
                        ? "text-[#007A53]"
                        : "text-slate-600"
                    }`}
                  >
                    Express
                  </span>
                  <span className="flex items-center gap-0.5 text-[9px] font-extrabold text-orange-600 bg-orange-100 px-1 py-0.2 rounded">
                    <Zap className="w-2.5 h-2.5" /> Prioritas
                  </span>
                </div>
              </div>
              <span
                className={`text-sm font-bold ${
                  selectedPkg === "express"
                    ? "text-[#007A53]"
                    : "text-slate-500"
                }`}
              >
                Rp{" "}
                {(service.express_fee + estimasiPajakTotal).toLocaleString(
                  "id-ID",
                )}
              </span>
            </button>
          )}
        </div>

        <p className="text-[10px] text-slate-400 text-center -mt-2">
          * Harga belum termasuk biaya admin{" "}
          {(service.admin_fee || 0) > 0
            ? `Rp ${service.admin_fee.toLocaleString("id-ID")}`
            : ""}{" "}
          &amp; cek fisik (jika ada)
        </p>

        <Button
          variant="primary"
          size="full"
          onClick={onCheckout}
          className="bg-[#007A53] hover:bg-[#006846] justify-between shadow-emerald-950/10 hover:shadow-emerald-950/20 group-hover:scale-[1.01] cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-emerald-200" />
            <span>Pesan Sekarang</span>
          </div>
          <ArrowRight className="w-4 h-4 text-emerald-200 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
}

