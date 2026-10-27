import { AlertTriangle, CheckCircle, Clock, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import type {
  DashboardChartData,
  DashboardOrder,
  DashboardSummary,
} from "../../../api/dashboard";
import {
  getDashboardChart,
  getDashboardOrders,
  getDashboardSummary,
} from "../../../api/dashboard";
import { getKTLOrders, type OrderKTLResponse } from "../../../api/order";
import DoughnutChart from "./components/DoughnutChart";
import InvoiceTable from "./components/InvoiceTable";
import LineChart from "./components/LineChart";
import ModernStatCard from "./components/ModernStatCard";
import RecentKtlTable from "./components/RecentKtlTable";
import RecentOrdersTable from "./components/RecentOrdersTable";

export default function Dashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [orders, setOrders] = useState<DashboardOrder[]>([]);
  const [ordersMeta, setOrdersMeta] = useState({
    page: 1,
    limit: 10,
    total_records: 0,
  });
  const [ktlOrders, setKtlOrders] = useState<OrderKTLResponse[]>([]);
  const [chartData, setChartData] = useState<DashboardChartData[]>([]);
  const [isLoadingSummary, setIsLoadingSummary] = useState(true);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [isLoadingKtlOrders, setIsLoadingKtlOrders] = useState(true);
  const [isLoadingChart, setIsLoadingChart] = useState(true);
  const [errorSummary, setErrorSummary] = useState<string | null>(null);
  const [errorOrders, setErrorOrders] = useState<string | null>(null);
  const [errorKtlOrders, setErrorKtlOrders] = useState<string | null>(null);
  const [errorChart, setErrorChart] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchSummary = async () => {
    try {
      setIsLoadingSummary(true);
      setErrorSummary(null);
      const data = await getDashboardSummary();
      setSummary(data);
    } catch (err: any) {
      console.error("Failed to fetch dashboard summary", err);
      setErrorSummary(err.message || "Gagal mengambil ringkasan dashboard");
    } finally {
      setIsLoadingSummary(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchOrders = async (page = 1, status = filterStatus) => {
    try {
      setIsLoadingOrders(true);
      setErrorOrders(null);
      const response = await getDashboardOrders(
        page,
        ordersMeta.limit,
        status || undefined,
      );
      setOrders(response.data);
      setOrdersMeta(response.meta);
    } catch (err: any) {
      console.error("Failed to fetch dashboard orders", err);
      setErrorOrders(err.message || "Gagal mengambil data pesanan terkini");
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const fetchKtlOrders = async () => {
    try {
      setIsLoadingKtlOrders(true);
      setErrorKtlOrders(null);
      const data = await getKTLOrders();
      setKtlOrders(data);
    } catch (err: any) {
      console.error("Failed to fetch ktl orders", err);
      setErrorKtlOrders(err.message || "Gagal mengambil data pesanan KTL");
    } finally {
      setIsLoadingKtlOrders(false);
    }
  };

  useEffect(() => {
    fetchOrders(1, filterStatus);
  }, [filterStatus]);

  useEffect(() => {
    fetchKtlOrders();
  }, []);

  const handleDashboardUpdate = () => {
    fetchOrders(ordersMeta.page, filterStatus);
    fetchKtlOrders();
    fetchSummary();
  };

  useEffect(() => {
    const handleOrderEvent = () => handleDashboardUpdate();
    window.addEventListener("orderUpdated", handleOrderEvent);
    return () => window.removeEventListener("orderUpdated", handleOrderEvent);
  }, [ordersMeta.page, filterStatus]);

  useEffect(() => {
    const fetch = async () => {
      try {
        setIsLoadingChart(true);
        setErrorChart(null);
        const data = await getDashboardChart();
        setChartData(data);
      } catch (err: any) {
        console.error("Failed to fetch dashboard chart", err);
        setErrorChart(err.message || "Gagal mengambil data grafik transaksi");
      } finally {
        setIsLoadingChart(false);
      }
    };
    fetch();
  }, []);

  const StatSkeleton = () => (
    <div className="rounded-xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 animate-pulse bg-slate-50 dark:bg-slate-800/50 h-24" />
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Dashboard Overview
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Selamat datang! Berikut ringkasan aktivitas layanan hari ini.
        </p>
      </div>

      {/* ERROR ALERTS */}
      {(errorSummary || errorOrders || errorChart || errorKtlOrders) && (
        <div className="space-y-3">
          {errorSummary && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <AlertTriangle
                size={18}
                className="text-red-600 dark:text-red-400 shrink-0"
              />
              <p className="text-sm text-red-700 dark:text-red-300">
                Gagal memuat ringkasan KPI: {errorSummary}
              </p>
            </div>
          )}
          {errorOrders && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <AlertTriangle
                size={18}
                className="text-red-600 dark:text-red-400 shrink-0"
              />
              <p className="text-sm text-red-700 dark:text-red-300">
                Gagal memuat daftar pesanan: {errorOrders}
              </p>
            </div>
          )}
          {errorKtlOrders && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <AlertTriangle
                size={18}
                className="text-red-600 dark:text-red-400 shrink-0"
              />
              <p className="text-sm text-red-700 dark:text-red-300">
                Gagal memuat daftar pesanan KTL: {errorKtlOrders}
              </p>
            </div>
          )}
          {errorChart && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <AlertTriangle
                size={18}
                className="text-red-600 dark:text-red-400 shrink-0"
              />
              <p className="text-sm text-red-700 dark:text-red-300">
                Gagal memuat data grafik: {errorChart}
              </p>
            </div>
          )}
        </div>
      )}

      {/* UNIFIED KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {isLoadingSummary ? (
          <>
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
          </>
        ) : (
          <>
            {/* 1. Pendapatan Total */}
            <ModernStatCard
              title="Total Pendapatan"
              value={`Rp ${((summary?.total_revenue ?? 0) + (summary?.total_revenue_ktls ?? 0)).toLocaleString("id-ID")}`}
              variant="info"
              icon={TrendingUp}
              breakdowns={[
                {
                  label: "Biro Jasa",
                  value: `Rp ${(summary?.total_revenue ?? 0).toLocaleString("id-ID")}`,
                },
                {
                  label: "Cetak KTL",
                  value: `Rp ${(summary?.total_revenue_ktls ?? 0).toLocaleString("id-ID")}`,
                },
              ]}
            />

            {/* 2. Menunggu Diproses */}
            <ModernStatCard
              title="Menunggu Diproses"
              value={
                (summary?.total_pending_orders ?? 0) +
                (summary?.total_pending_ktls ?? 0)
              }
              variant="warning"
              icon={Clock}
              breakdowns={[
                {
                  label: "Order Jasa",
                  value: summary?.total_pending_orders ?? 0,
                },
                { label: "Cetak KTL", value: summary?.total_pending_ktls ?? 0 },
              ]}
              onClick={() => {
                setFilterStatus(filterStatus === "Pending" ? null : "Pending");
                document
                  .getElementById("recent-orders-section")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            />

            {/* 3. Selesai */}
            <ModernStatCard
              title="Order Selesai"
              value={
                (summary?.total_completed_orders ?? 0) +
                (summary?.total_completed_ktls ?? 0)
              }
              variant="success"
              icon={CheckCircle}
              breakdowns={[
                {
                  label: "Order Jasa",
                  value: summary?.total_completed_orders ?? 0,
                },
                {
                  label: "Cetak KTL",
                  value: summary?.total_completed_ktls ?? 0,
                },
              ]}
              onClick={() => {
                setFilterStatus(
                  filterStatus === "Completed" ? null : "Completed",
                );
                document
                  .getElementById("recent-orders-section")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            />

            {/* 4. Butuh Perhatian (Alerts) */}
            {summary && (
              <ModernStatCard
                title="Butuh Perhatian Segera"
                value={
                  (summary.pending_actions?.unverified_documents || 0) +
                  (summary.pending_actions?.stuck_orders || 0) +
                  (summary.pending_actions?.stuck_ktls || 0)
                }
                variant="danger"
                icon={AlertTriangle}
                breakdowns={[
                  {
                    label: "Belum Verif",
                    value: summary.pending_actions?.unverified_documents || 0,
                    valueClass:
                      (summary.pending_actions?.unverified_documents || 0) > 0
                        ? "text-red-500 font-bold"
                        : "",
                  },
                  {
                    label: "Order Stuck",
                    value: summary.pending_actions?.stuck_orders || 0,
                    valueClass:
                      (summary.pending_actions?.stuck_orders || 0) > 0
                        ? "text-red-500 font-bold"
                        : "",
                  },
                  {
                    label: "KTL Stuck",
                    value: summary.pending_actions?.stuck_ktls || 0,
                    valueClass:
                      (summary.pending_actions?.stuck_ktls || 0) > 0
                        ? "text-red-500 font-bold"
                        : "",
                  },
                ]}
                onClick={() => {
                  setFilterStatus(
                    filterStatus === "Attention" ? null : "Attention",
                  );
                  document
                    .getElementById("recent-orders-section")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              />
            )}
          </>
        )}
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
          <h2 className="font-semibold mb-4 text-slate-800 dark:text-white">
            Pengajuan & Pendapatan Harian
          </h2>
          {isLoadingChart ? (
            <div className="flex justify-center items-center h-75">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
          ) : (
            <LineChart data={chartData} />
          )}
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
          <h2 className="font-semibold mb-4 text-slate-800 dark:text-white">
            Layanan Terpopuler
          </h2>
          {isLoadingSummary ? (
            <div className="flex justify-center items-center h-75">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
          ) : (
            <DoughnutChart data={summary?.top_services} />
          )}
        </div>
      </div>

      {/* RECENT ORDERS TABLE */}
      {(() => {
        const isOrderStuck = (order: DashboardOrder) => {
          if (order.status !== "Processing") return false;
          const orderTime = new Date(order.order_date).getTime();
          const diffDays = (Date.now() - orderTime) / (1000 * 60 * 60 * 24);
          return diffDays >= 3;
        };

        const isKtlStuck = (ktl: OrderKTLResponse) => {
          if (ktl.status !== "Processing") return false;
          const orderTime = new Date(ktl.order_date).getTime();
          const diffDays = (Date.now() - orderTime) / (1000 * 60 * 60 * 24);
          return diffDays >= 3;
        };

        const query = searchQuery.toLowerCase().trim();

        const displayedOrders = orders.filter((o) => {
          if (ktlOrders.some((ktl) => ktl.id === o.order_id)) return false;
          if (filterStatus) {
            if (filterStatus === "Attention") {
              const hasUnverified =
                typeof o.unverified_docs === "number"
                  ? o.unverified_docs > 0
                  : false;
              if (!hasUnverified && !isOrderStuck(o)) return false;
            } else if (o.status !== filterStatus) {
              return false;
            }
          }
          if (query) {
            const matchName = o.customer_name?.toLowerCase().includes(query);
            const matchPlate = o.plate_number?.toLowerCase().includes(query);
            const matchOrderId = o.order_id?.toLowerCase().includes(query);
            const matchPhone = o.phone_number?.toLowerCase().includes(query);
            const matchService = o.service_name?.toLowerCase().includes(query);
            if (!matchName && !matchPlate && !matchOrderId && !matchPhone && !matchService) {
              return false;
            }
          }
          return true;
        });

        const displayedKtlOrders = ktlOrders.filter((ktl) => {
          if (filterStatus) {
            if (filterStatus === "Attention") {
              if (!isKtlStuck(ktl)) return false;
            } else if (ktl.status !== filterStatus) {
              return false;
            }
          }
          if (query) {
            const matchName = ktl.customer_name?.toLowerCase().includes(query);
            const matchPhone = ktl.phone_number?.toLowerCase().includes(query);
            const matchId = ktl.id?.toLowerCase().includes(query);
            const matchVehicle = ktl.vehicle_type?.toLowerCase().includes(query);
            const matchRegion = ktl.region?.toLowerCase().includes(query);
            const matchRef = ktl.merchant_ref?.toLowerCase().includes(query);
            if (!matchName && !matchPhone && !matchId && !matchVehicle && !matchRegion && !matchRef) {
              return false;
            }
          }
          return true;
        });

        return (
          <>
            <div id="recent-orders-section" className="scroll-mt-8">
              {(filterStatus || searchQuery) && (
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3 px-4 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-blue-900 dark:text-blue-300">
                    {filterStatus && (
                      <span className="flex items-center gap-1.5">
                        Filter Status:{" "}
                        <b>
                          {filterStatus === "Attention"
                            ? "⚠️ Butuh Perhatian Segera"
                            : filterStatus === "Pending"
                            ? "⏳ Menunggu Diproses (Pending)"
                            : filterStatus === "Processing"
                            ? "🚀 Pengurusan Kilat (Processing)"
                            : filterStatus === "Completed"
                            ? "✅ Selesai (Completed)"
                            : filterStatus}
                        </b>
                      </span>
                    )}
                    {searchQuery && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200">
                        Pencarian: &quot;{searchQuery}&quot;
                      </span>
                    )}
                    <span className="text-slate-500 font-normal">
                      ({displayedOrders.length} pesanan jasa
                      {displayedKtlOrders.length > 0
                        ? `, ${displayedKtlOrders.length} KTL`
                        : ""}
                      )
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                      >
                        Reset Cari
                      </button>
                    )}
                    {filterStatus && (
                      <button
                        onClick={() => setFilterStatus(null)}
                        className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                      >
                        Hapus Filter Status
                      </button>
                    )}
                    {filterStatus && searchQuery && (
                      <button
                        onClick={() => {
                          setFilterStatus(null);
                          setSearchQuery("");
                        }}
                        className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline cursor-pointer"
                      >
                        Reset Semua
                      </button>
                    )}
                  </div>
                </div>
              )}

              <RecentOrdersTable
                orders={displayedOrders}
                isLoading={isLoadingOrders}
                onOrderUpdate={handleDashboardUpdate}
                meta={ordersMeta}
                onPageChange={(page) => fetchOrders(page, filterStatus)}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            </div>

            {/* RECENT KTL TABLE */}
            <div id="recent-ktl-section" className="scroll-mt-8 mt-6">
              <RecentKtlTable
                orders={displayedKtlOrders}
                isLoading={isLoadingKtlOrders}
                onOrderUpdate={handleDashboardUpdate}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            </div>
          </>
        );
      })()}

      {/* INVOICE TABLE */}
      <div className="pt-6 border-t border-slate-200 dark:border-slate-800 transition-colors">
        <InvoiceTable />
      </div>
    </div>
  );
}
