import {
    Building2,
    Check,
    ChevronDown,
    ChevronUp,
    Edit3,
    Loader2,
    MapPin,
    Package,
    Plus,
    RotateCcw,
    Save,
    Search,
    Sliders,
    Trash2,
    Truck,
    UserCheck,
    X,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
    deleteDeliveryMethodApi,
    toggleDeliveryMethodApi,
} from "../../../../api/deliveryMethods";
import {
    getAdminCouriersApi,
    updateBackendShippingSettingsApi,
} from "../../../../api/shipping";
import Button from "../../../../shared/components/Button";
import { useDeliveryMethods } from "../../../../shared/hooks/useDeliveryMethods";
import {
    DEFAULT_SHIPPING_SETTINGS,
    useShippingSettings,
} from "../../../../shared/utils/shippingSettings";
import type { DeliveryMethod } from "../../../../types/deliveryMethod";
import type {
    CourierServiceItem,
    ShippingSettings,
} from "../../../../types/shippingSettings";
import { COURIER_PRESETS } from "../constants";
import AddDeliveryMethodModal from "./AddDeliveryMethodModal";
import EditDeliveryMethodModal from "./EditDeliveryMethodModal";

interface CourierDefinition {
  code: string;
  name: string;
  services: { code: string; label: string }[];
}

export default function ShippingSettingsTab() {
  const { settings, updateSettings, resetSettings } = useShippingSettings();
  const {
    deliveryMethods,
    isLoading: isLoadingMethods,
    refetch: refetchMethods,
  } = useDeliveryMethods(true);

  const [courierCatalog, setCourierCatalog] = useState<CourierDefinition[]>([]);
  const [isLoadingCatalog, setIsLoadingCatalog] = useState<boolean>(true);
  const [formData, setFormData] = useState<ShippingSettings>(settings);
  const [isSaving, setIsSaving] = useState(false);
  const [expandedCouriers, setExpandedCouriers] = useState<
    Record<string, boolean>
  >({});
  const [courierSearch, setCourierSearch] = useState("");
  const [courierFilterTab, setCourierFilterTab] = useState<
    "all" | "active" | "inactive"
  >("active");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedEditMethod, setSelectedEditMethod] =
    useState<DeliveryMethod | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Ambil katalog lengkap ekspedisi kurir dari backend: GET /api/v1/admin/couriers
  useEffect(() => {
    const fetchAdminCouriers = async () => {
      try {
        setIsLoadingCatalog(true);
        const res = await getAdminCouriersApi();
        if (res?.data && Array.isArray(res.data)) {
          const map = new Map<string, CourierDefinition>();

          for (const item of res.data) {
            const rawCode = (item.courier_code || "").trim();
            if (!rawCode) continue;
            const code = rawCode.toLowerCase();

            if (!map.has(code)) {
              map.set(code, {
                code,
                name: (item.courier_name || "").trim() || code.toUpperCase(),
                services: [],
              });
            }

            const courier = map.get(code)!;
            const rawServiceCode = (item.courier_service_code || "").trim();
            if (!rawServiceCode) continue;
            const serviceCode = rawServiceCode.toLowerCase();

            if (
              !courier.services.some(
                (s) => s.code.toLowerCase() === serviceCode,
              )
            ) {
              const label = item.courier_service_name
                ? `${serviceCode.toUpperCase()} (${item.courier_service_name.trim()})`
                : serviceCode.toUpperCase();

              courier.services.push({
                code: serviceCode,
                label,
              });
            }
          }

          const grouped = Array.from(map.values()).sort((a, b) =>
            a.name.localeCompare(b.name),
          );
          setCourierCatalog(grouped);
        }
      } catch (err: any) {
        console.error("Gagal memuat katalog kurir admin dari backend:", err);
        toast.error("Gagal memuat katalog kurir dari backend");
      } finally {
        setIsLoadingCatalog(false);
      }
    };

    fetchAdminCouriers();
  }, []);

  // Sinkronisasi data saat settings berhasil di-fetch dari backend
  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  // Cek apakah suatu pasangan courier_code & service_code aktif
  const isServiceActive = (courierCode: string, serviceCode: string) => {
    const cleanCourier = courierCode.trim().toLowerCase();
    const cleanService = serviceCode.trim().toLowerCase();
    return formData.enabled_couriers.some(
      (item) =>
        item.courier_code.trim().toLowerCase() === cleanCourier &&
        item.courier_service_code.trim().toLowerCase() === cleanService,
    );
  };

  // Cek apakah kurir memiliki minimal 1 layanan aktif
  const isCourierPartiallyOrFullyActive = (courierCode: string) => {
    const cleanCourier = courierCode.trim().toLowerCase();
    return formData.enabled_couriers.some(
      (item) => item.courier_code.trim().toLowerCase() === cleanCourier,
    );
  };

  // Toggle keseluruhan kurir (semua layanannya)
  const toggleCourierAll = (
    courier: CourierDefinition,
    e?: React.MouseEvent,
  ) => {
    if (e) {
      e.stopPropagation();
    }
    const cleanCode = courier.code.trim().toLowerCase();
    const isCurrentlyActive = isCourierPartiallyOrFullyActive(cleanCode);

    if (isCurrentlyActive) {
      const remaining = formData.enabled_couriers.filter(
        (item) => item.courier_code.trim().toLowerCase() !== cleanCode,
      );
      if (remaining.length === 0) {
        toast.error(
          "Minimal harus ada 1 ekspedisi & layanan kurir yang aktif.",
        );
        return;
      }
      setFormData((prev) => ({
        ...prev,
        enabled_couriers: remaining,
        enabledCouriers: Array.from(
          new Set(remaining.map((c) => c.courier_code.trim().toLowerCase())),
        ),
      }));
    } else {
      const newItems: CourierServiceItem[] = courier.services.map((s) => ({
        courier_code: cleanCode,
        courier_service_code: s.code.trim().toLowerCase(),
      }));
      const withoutThisCourier = formData.enabled_couriers.filter(
        (item) => item.courier_code.trim().toLowerCase() !== cleanCode,
      );
      const updated = [...withoutThisCourier, ...newItems];
      setFormData((prev) => ({
        ...prev,
        enabled_couriers: updated,
        enabledCouriers: Array.from(
          new Set(updated.map((c) => c.courier_code.trim().toLowerCase())),
        ),
      }));
    }
  };

  // Toggle spesifik layanan kurir
  const toggleCourierService = (
    courierCode: string,
    serviceCode: string,
    e?: React.MouseEvent,
  ) => {
    if (e) {
      e.stopPropagation();
    }
    const code = courierCode.trim().toLowerCase();
    const service = serviceCode.trim().toLowerCase();
    const exists = isServiceActive(code, service);

    if (exists) {
      if (formData.enabled_couriers.length <= 1) {
        toast.error("Minimal harus ada 1 layanan ekspedisi yang aktif.");
        return;
      }
      const updated = formData.enabled_couriers.filter(
        (item) =>
          !(
            item.courier_code.trim().toLowerCase() === code &&
            item.courier_service_code.trim().toLowerCase() === service
          ),
      );
      setFormData((prev) => ({
        ...prev,
        enabled_couriers: updated,
        enabledCouriers: Array.from(
          new Set(updated.map((c) => c.courier_code.trim().toLowerCase())),
        ),
      }));
    } else {
      const updated = [
        ...formData.enabled_couriers,
        { courier_code: code, courier_service_code: service },
      ];
      setFormData((prev) => ({
        ...prev,
        enabled_couriers: updated,
        enabledCouriers: Array.from(
          new Set(updated.map((c) => c.courier_code.trim().toLowerCase())),
        ),
      }));
    }
  };

  const selectAllServices = () => {
    const allItems: CourierServiceItem[] = [];
    courierCatalog.forEach((courier) => {
      courier.services.forEach((s) => {
        allItems.push({
          courier_code: courier.code.trim().toLowerCase(),
          courier_service_code: s.code.trim().toLowerCase(),
        });
      });
    });

    setFormData((prev) => ({
      ...prev,
      enabled_couriers: allItems,
      enabledCouriers: courierCatalog.map((c) => c.code.trim().toLowerCase()),
    }));
    toast.success("Semua kurir dan layanan diaktifkan.");
  };

  const selectPopularCouriers = () => {
    const popularCodes = COURIER_PRESETS.POPULAR;
    const popularCodesList = Array.from(popularCodes);
    const popularItems: CourierServiceItem[] = [];
    courierCatalog
      .filter((c) => popularCodesList.includes(c.code.trim().toLowerCase() as any))
      .forEach((c) => {
        c.services.forEach((s) => {
          popularItems.push({
            courier_code: c.code.trim().toLowerCase(),
            courier_service_code: s.code.trim().toLowerCase(),
          });
        });
      });

    setFormData((prev) => ({
      ...prev,
      enabled_couriers: popularItems,
      enabledCouriers: popularCodesList,
    }));
    toast.success(
      "Hanya kurir populer (JNE, SiCepat, J&T, Anteraja, Pos, TIKI) yang diaktifkan.",
    );
  };

  const toggleAccordion = (courierCode: string) => {
    setExpandedCouriers((prev) => ({
      ...prev,
      [courierCode]: !prev[courierCode],
    }));
  };

  const expandAllCouriers = () => {
    const allExpanded: Record<string, boolean> = {};
    courierCatalog.forEach((c) => {
      allExpanded[c.code] = true;
    });
    setExpandedCouriers(allExpanded);
  };

  const collapseAllCouriers = () => {
    setExpandedCouriers({});
  };

  // Toggle Delivery Method is_active via PATCH /api/v1/admin/delivery-methods/:id/toggle (No body)
  const handleToggleDeliveryMethod = async (method: DeliveryMethod) => {
    try {
      setTogglingId(method.id);
      const res = await toggleDeliveryMethodApi(method.id);
      toast.success(
        res?.message || "Status metode pengantaran berhasil diubah",
      );
      refetchMethods();
    } catch (err: any) {
      toast.error(err?.message || "Gagal mengubah status metode pengantaran");
    } finally {
      setTogglingId(null);
    }
  };

  // Delete Delivery Method via backend
  const handleDeleteDeliveryMethod = async (method: DeliveryMethod) => {
    if (
      !window.confirm(
        `Yakin ingin menghapus metode pengantaran "${method.method_name}"?`,
      )
    ) {
      return;
    }

    try {
      await deleteDeliveryMethodApi(method.id);
      toast.success(`Metode "${method.method_name}" berhasil dihapus`);
      refetchMethods();
    } catch (err: any) {
      toast.error(err?.message || "Gagal menghapus metode pengantaran");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.defaultItemWeight <= 0) {
      toast.error("Berat standar berkas harus lebih dari 0 gram.");
      return;
    }
    if (formData.doorToDoorMultiplier < 1) {
      toast.error("Multiplier Door-to-Door minimal bernilai 1.0.");
      return;
    }
    if (formData.enabled_couriers.length === 0) {
      toast.error("Minimal harus ada 1 kurir/layanan yang aktif.");
      return;
    }

    setIsSaving(true);
    try {
      const backendPayload = {
        enabled_couriers: formData.enabled_couriers,
        default_item_weight: formData.defaultItemWeight,
        default_item_value: formData.defaultItemValue,
      };

      const res = await updateBackendShippingSettingsApi(backendPayload);
      updateSettings(formData);

      toast.success(res?.message || "Pengaturan pengiriman berhasil disimpan");
    } catch (err: any) {
      console.error("Gagal simpan shipping settings:", err);
      updateSettings(formData);
      toast.error(
        err?.message ||
          "Gagal menyimpan ke server backend, pengaturan disimpan secara lokal.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    resetSettings();
    setFormData(DEFAULT_SHIPPING_SETTINGS);
    toast.success("Pengaturan kurir dikembalikan ke konfigurasi standar.");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Truck className="w-4 h-4" />
            <span>Manajemen Logistik & Ekspedisi Terpadu</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Pengaturan Ekspedisi & Metode Pengantaran
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Kelola kurir ekspedisi aktif, jenis layanan, parameter paket berkas,
            serta metode serah terima dan pengantaran dokumen yang
            tersinkronisasi.
          </p>
        </div>
      </div>

      {/* BAGIAN 1: Kurir & Layanan yang Diaktifkan */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                1. Daftar Ekspedisi & Layanan Kurir Terpadu
              </h3>
              {!isLoadingCatalog && courierCatalog.length > 0 && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  {
                    courierCatalog.filter((c) =>
                      isCourierPartiallyOrFullyActive(c.code),
                    ).length
                  }{" "}
                  dari {courierCatalog.length} Ekspedisi Aktif
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Aktifkan kurir dan pilih jenis layanan yang boleh digunakan
              customer saat checkout.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={selectAllServices}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Pilih Semua
            </button>
            <button
              type="button"
              onClick={selectPopularCouriers}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors cursor-pointer"
            >
              Hanya Populer
            </button>
            <button
              type="button"
              onClick={
                Object.keys(expandedCouriers).some((k) => expandedCouriers[k])
                  ? collapseAllCouriers
                  : expandAllCouriers
              }
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {Object.keys(expandedCouriers).some((k) => expandedCouriers[k])
                ? "Tutup Semua"
                : "Buka Semua"}
            </button>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        {!isLoadingCatalog && courierCatalog.length > 0 && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari kurir atau layanan (misal: JNE, SiCepat, Instant)..."
                value={courierSearch}
                onChange={(e) => setCourierSearch(e.target.value)}
                className="w-full pl-9.5 pr-8 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              />
              {courierSearch && (
                <button
                  type="button"
                  onClick={() => setCourierSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl self-start sm:self-auto text-xs">
              <button
                type="button"
                onClick={() => setCourierFilterTab("all")}
                className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  courierFilterTab === "all"
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Semua ({courierCatalog.length})
              </button>
              <button
                type="button"
                onClick={() => setCourierFilterTab("active")}
                className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  courierFilterTab === "active"
                    ? "bg-emerald-600 text-white shadow-2xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Aktif (
                {
                  courierCatalog.filter((c) =>
                    isCourierPartiallyOrFullyActive(c.code),
                  ).length
                }
                )
              </button>
              <button
                type="button"
                onClick={() => setCourierFilterTab("inactive")}
                className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  courierFilterTab === "inactive"
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Nonaktif (
                {
                  courierCatalog.filter(
                    (c) => !isCourierPartiallyOrFullyActive(c.code),
                  ).length
                }
                )
              </button>
            </div>
          </div>
        )}

        {isLoadingCatalog ? (
          <div className="py-16 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-7 h-7 animate-spin text-emerald-600" />
            <span>Memuat katalog kurir & layanan dari database backend...</span>
          </div>
        ) : courierCatalog.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 text-xs text-slate-500">
            Tidak ada ekspedisi kurir yang terdaftar di database backend.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            {courierCatalog
              .filter((courier) => {
                const isActive = isCourierPartiallyOrFullyActive(courier.code);
                if (courierFilterTab === "active" && !isActive) return false;
                if (courierFilterTab === "inactive" && isActive) return false;

                if (!courierSearch.trim()) return true;
                const q = courierSearch.toLowerCase().trim();
                return (
                  courier.name.toLowerCase().includes(q) ||
                  courier.code.toLowerCase().includes(q) ||
                  courier.services.some(
                    (s) =>
                      s.label.toLowerCase().includes(q) ||
                      s.code.toLowerCase().includes(q),
                  )
                );
              })
              .map((courier) => {
                const isPartiallyOrFullyActive =
                  isCourierPartiallyOrFullyActive(courier.code);
                const isExpanded = !!expandedCouriers[courier.code];
                const activeServicesCount = courier.services.filter((s) =>
                  isServiceActive(courier.code, s.code),
                ).length;

                return (
                  <div
                    key={courier.code}
                    className={`rounded-2xl border transition-all overflow-hidden ${
                      isPartiallyOrFullyActive
                        ? "bg-emerald-50/20 dark:bg-emerald-950/20 border-emerald-500/50 shadow-2xs"
                        : "bg-slate-50/60 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 opacity-75"
                    }`}
                  >
                    {/* Courier Card Header */}
                    <div className="p-4 flex items-center justify-between gap-3">
                      {/* Checkbox Toggle Aktif/Nonaktif */}
                      <button
                        type="button"
                        onClick={(e) => toggleCourierAll(courier, e)}
                        className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                          isPartiallyOrFullyActive
                            ? "bg-emerald-600 text-white shadow-2xs hover:bg-emerald-700"
                            : "bg-slate-200 dark:bg-slate-800 text-transparent hover:bg-slate-300 dark:hover:bg-slate-700"
                        }`}
                        title={
                          isPartiallyOrFullyActive
                            ? "Klik untuk menonaktifkan seluruh layanan kurir ini"
                            : "Klik untuk mengaktifkan seluruh layanan kurir ini"
                        }
                      >
                        <Check className="w-3.5 h-3.5 stroke-3" />
                      </button>

                      {/* Header Click Area (HANYA Buka/Tutup Accordion) */}
                      <div
                        className="flex items-center justify-between gap-2 flex-1 cursor-pointer select-none"
                        onClick={() => toggleAccordion(courier.code)}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                              {courier.name}
                            </h4>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase">
                              {courier.code}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            <span
                              className={
                                activeServicesCount > 0
                                  ? "font-semibold text-emerald-700 dark:text-emerald-400"
                                  : "text-slate-400"
                              }
                            >
                              {activeServicesCount} dari{" "}
                              {courier.services.length} layanan aktif
                            </span>
                          </p>
                        </div>

                        <div className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Sub-services Collapsible list */}
                    {isExpanded && (
                      <div className="px-4 pb-4 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/50 space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                            Pilih jenis layanan yang diizinkan untuk{" "}
                            {courier.name}:
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {courier.services.map((service) => {
                            const active = isServiceActive(
                              courier.code,
                              service.code,
                            );
                            return (
                              <button
                                key={`${courier.code}-${service.code}`}
                                type="button"
                                onClick={(e) =>
                                  toggleCourierService(
                                    courier.code,
                                    service.code,
                                    e,
                                  )
                                }
                                className={`flex items-center justify-between gap-2 px-3 py-2 rounded-xl border text-xs cursor-pointer select-none transition-all text-left ${
                                  active
                                    ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500/80 font-bold text-emerald-800 dark:text-emerald-300 shadow-2xs"
                                    : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                                }`}
                              >
                                <div className="flex items-center gap-2 truncate">
                                  <div
                                    className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 ${
                                      active
                                        ? "bg-emerald-600 text-white"
                                        : "border border-slate-300 dark:border-slate-600"
                                    }`}
                                  >
                                    {active && (
                                      <Check className="w-2.5 h-2.5 stroke-3" />
                                    )}
                                  </div>
                                  <span className="truncate">
                                    {service.label}
                                  </span>
                                </div>
                                <span className="text-[10px] font-mono opacity-60 uppercase shrink-0">
                                  {service.code}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* BAGIAN 2: Metode Pengantaran & Penyerahan Berkas (Dinamis dari Backend API) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                2. Metode Penyerahan & Pengembalian Dokumen (Delivery Methods)
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Kelola opsi penyerahan berkas awal (Pickup) dan pengembalian
              dokumen (Delivery) langsung ke database backend.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-900/10 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Metode Baru</span>
          </button>
        </div>

        {isLoadingMethods ? (
          <div className="p-8 text-center text-xs text-slate-400">
            Memuat daftar metode pengantaran dari backend...
          </div>
        ) : deliveryMethods.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Belum ada metode pengantaran yang terdaftar di database.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {deliveryMethods.map((method) => {
              const isPickup = method.direction === "PICKUP";
              const isBoth = method.direction === "BOTH";
              const isToggling = togglingId === method.id;

              return (
                <div
                  key={method.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    method.is_active
                      ? isBoth
                        ? "bg-purple-50/30 dark:bg-purple-950/20 border-purple-500/50"
                        : isPickup
                          ? "bg-emerald-50/30 dark:bg-emerald-950/20 border-emerald-500/50"
                          : "bg-blue-50/30 dark:bg-blue-950/20 border-blue-500/50"
                      : "bg-slate-50/60 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 opacity-60"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                          isBoth
                            ? "bg-purple-600 text-white"
                            : isPickup
                              ? "bg-emerald-600 text-white"
                              : "bg-blue-600 text-white"
                        }`}
                      >
                        {method.provider_type === "SELF" ? (
                          <Building2 className="w-5 h-5" />
                        ) : method.provider_type === "INTERNAL" ? (
                          <UserCheck className="w-5 h-5" />
                        ) : (
                          <Truck className="w-5 h-5" />
                        )}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-1.5 mb-1">
                          <span
                            className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                              isBoth
                                ? "bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-300"
                                : isPickup
                                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300"
                                  : "bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300"
                            }`}
                          >
                            {isBoth
                              ? "Dua Arah (Serah & Kirim Selesai)"
                              : isPickup
                                ? "Serah Berkas Awal (PICKUP)"
                                : "Kirim Dokumen Selesai (RETURN)"}
                          </span>
                          <span className="text-[9px] font-mono font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md">
                            {method.method_code}
                          </span>
                        </div>

                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                          {method.method_name}
                        </h4>
                      </div>
                    </div>

                    {/* Action Buttons: Toggle, Edit, Delete */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleToggleDeliveryMethod(method)}
                        disabled={isToggling}
                        className={`w-11 h-6 rounded-full relative transition-colors cursor-pointer ${
                          method.is_active
                            ? isBoth
                              ? "bg-purple-600"
                              : isPickup
                                ? "bg-emerald-600"
                                : "bg-blue-600"
                            : "bg-slate-300 dark:bg-slate-700"
                        } ${isToggling ? "opacity-50" : ""}`}
                        title={
                          method.is_active
                            ? "Klik untuk Sembunyikan (Hide)"
                            : "Klik untuk Tampilkan (Unhide)"
                        }
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${
                            method.is_active ? "left-6" : "left-1"
                          }`}
                        />
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedEditMethod(method)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors cursor-pointer"
                        title="Edit Metode"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteDeliveryMethod(method)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                        title="Hapus Metode"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2.5 leading-relaxed">
                    {method.description || "Tidak ada deskripsi tambahan."}
                  </p>

                  <div className="mt-3.5 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        {method.flat_fee > 0
                          ? `Tarif Flat: Rp ${method.flat_fee.toLocaleString("id-ID")}`
                          : method.provider_type === "COURIER"
                            ? "Tarif Dihitung Kurir"
                            : "Rp 0 (Bebas Biaya)"}
                      </span>
                      <span>
                        Tipe:{" "}
                        <b>
                          {method.provider_type === "SELF"
                            ? "Mandiri"
                            : method.provider_type === "INTERNAL"
                              ? "Internal Kantor"
                              : "Ekspedisi Mitra"}
                        </b>
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[10px]">
                      {method.requires_address && (
                        <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                          <MapPin className="w-3 h-3" /> Wajib Alamat
                        </span>
                      )}
                      {method.requires_courier && (
                        <span className="flex items-center gap-1 text-blue-600 font-semibold">
                          <Truck className="w-3 h-3" /> Pilih Kurir
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* BAGIAN 3: Default Paket Dokumen & Multiplier */}
      <form onSubmit={handleSave} className="space-y-8">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Package className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              3. Pengaturan Default Paket Berkas & Multiplier Door-to-Door
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Parameter ini dikirimkan ke backend dan API ekspedisi untuk
              menghitung tarif ongkos kirim.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {/* Berat Standar Berkas */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Berat Standar Dokumen (Gram){" "}
                <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="50"
                  step="50"
                  value={formData.defaultItemWeight}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      defaultItemWeight: parseInt(e.target.value, 10) || 0,
                    }))
                  }
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none transition-all bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm font-semibold"
                />
                <span className="absolute right-4 top-3.5 text-xs text-slate-400 font-bold">
                  gram
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Default: 200 gram (STNK + BPKB + Map pelindung)
              </p>
            </div>

            {/* Nilai Pertanggungan Asuransi */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Nilai Pertanggungan Berkas (Rp){" "}
                <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3.5 text-xs text-slate-400 font-bold">
                  Rp
                </span>
                <input
                  type="number"
                  min="0"
                  step="10000"
                  value={formData.defaultItemValue}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      defaultItemValue: parseInt(e.target.value, 10) || 0,
                    }))
                  }
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none transition-all bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm font-semibold"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Nilai pertanggungan/asuransi dokumen saat di perjalanan kurir
              </p>
            </div>

            {/* Multiplier Door-to-Door */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Multiplier Door-to-Door (PP){" "}
                <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  value={formData.doorToDoorMultiplier}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      doorToDoorMultiplier: parseFloat(e.target.value) || 1,
                    }))
                  }
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none transition-all bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm font-semibold"
                />
                <span className="absolute right-4 top-3.5 text-xs text-emerald-600 font-bold">
                  × tarif
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Default: 2.0x (tarif 2 arah: jemput berkas + kirim kembali)
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={handleReset}
            disabled={isSaving}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Kembalikan Default Kurir
          </button>

          <Button
            type="submit"
            variant="primary"
            isLoading={isSaving}
            className="px-6 py-2.5 text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-900/20"
          >
            <Save className="w-4 h-4" />
            Simpan Pengaturan Ekspedisi
          </Button>
        </div>
      </form>

      {/* Modal Tambah Metode Pengantaran */}
      <AddDeliveryMethodModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => refetchMethods()}
        nextOrder={deliveryMethods.length + 1}
      />

      {/* Modal Edit Metode Pengantaran */}
      <EditDeliveryMethodModal
        open={!!selectedEditMethod}
        method={selectedEditMethod}
        onClose={() => setSelectedEditMethod(null)}
        onSuccess={() => refetchMethods()}
      />
    </div>
  );
}
