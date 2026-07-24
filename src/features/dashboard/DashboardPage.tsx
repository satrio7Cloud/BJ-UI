import { AlertTriangle, CheckCircle, Clock, FileText, TrendingUp, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import type { DashboardChartData, DashboardOrder, DashboardSummary } from "../../api/dashboard";
import { getDashboardChart, getDashboardOrders, getDashboardSummary } from "../../api/dashboard";
import HorizontalBarChart from "./components/HorizontalBarChart";
import InvoiceTable from "./components/InvoiceTable";
import LineChart from "./components/LineChart";
import RecentOrdersTable from "./components/RecentOrdersTable";
import StatCard from "./components/StatCard";

export default function Dashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [orders, setOrders] = useState<DashboardOrder[]>([]);
  const [chartData, setChartData] = useState<DashboardChartData[]>([]);
  const [isLoadingSummary, setIsLoadingSummary] = useState(true);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [isLoadingChart, setIsLoadingChart] = useState(true);
  const [errorSummary, setErrorSummary] = useState<string | null>(null);
  const [errorOrders, setErrorOrders] = useState<string | null>(null);
  const [errorChart, setErrorChart] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
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
    fetch();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoadingOrders(true);
      setErrorOrders(null);
      const data = await getDashboardOrders();
      setOrders(data);
    } catch (err: any) {
      console.error("Failed to fetch dashboard orders", err);
      setErrorOrders(err.message || "Gagal mengambil data pesanan terkini");
    } finally {
      setIsLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

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
      {(errorSummary || errorOrders || errorChart) && (
        <div className="space-y-3">
          {errorSummary && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <AlertTriangle size={18} className="text-red-600 dark:text-red-400 shrink-0" />
              <p className="text-sm text-red-700 dark:text-red-300">
                Gagal memuat ringkasan KPI: {errorSummary}
              </p>
            </div>
          )}
          {errorOrders && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <AlertTriangle size={18} className="text-red-600 dark:text-red-400 shrink-0" />
              <p className="text-sm text-red-700 dark:text-red-300">
                Gagal memuat daftar pesanan: {errorOrders}
              </p>
            </div>
          )}
          {errorChart && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <AlertTriangle size={18} className="text-red-600 dark:text-red-400 shrink-0" />
              <p className="text-sm text-red-700 dark:text-red-300">
                Gagal memuat data grafik: {errorChart}
              </p>
            </div>
          )}
        </div>
      )}

      {/* KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoadingSummary ? (
          <>
            <StatSkeleton /><StatSkeleton /><StatSkeleton /><StatSkeleton />
          </>
        ) : (
          <>
            <StatCard
              title="Pending Orders"
              value={summary?.total_pending_orders ?? 0}
              description="Menunggu diproses"
              variant="warning"
              icon={Clock}
            />
            <StatCard
              title="Express Orders"
              value={summary?.total_express_orders ?? 0}
              description="Layanan ekspres aktif"
              variant="info"
              icon={Zap}
            />
            <StatCard
              title="Selesai"
              value={summary?.total_completed_orders ?? 0}
              description="Order berhasil diselesaikan"
              variant="success"
              icon={CheckCircle}
            />
            <StatCard
              title="Total Pendapatan"
              value={`Rp ${(summary?.total_revenue ?? 0).toLocaleString("id-ID")}`}
              description="Total dari semua order"
              variant="info"
              icon={TrendingUp}
            />
          </>
        )}
      </div>

      {/* PENDING ACTIONS */}
      {!isLoadingSummary && summary && (summary.pending_actions.unverified_documents > 0 || summary.pending_actions.stuck_orders > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {summary.pending_actions.unverified_documents > 0 && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
              <FileText size={18} className="text-orange-600 dark:text-orange-400 shrink-0" />
              <p className="text-sm text-orange-700 dark:text-orange-300">
                <span className="font-bold">{summary.pending_actions.unverified_documents}</span> dokumen belum diverifikasi
              </p>
            </div>
          )}
          {summary.pending_actions.stuck_orders > 0 && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <AlertTriangle size={18} className="text-red-600 dark:text-red-400 shrink-0" />
              <p className="text-sm text-red-700 dark:text-red-300">
                <span className="font-bold">{summary.pending_actions.stuck_orders}</span> order tertahan / stuck
              </p>
            </div>
          )}
        </div>
      )}

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
          <h2 className="font-semibold mb-4 text-slate-800 dark:text-white">Pengajuan & Pendapatan Harian</h2>
          {isLoadingChart ? (
            <div className="flex justify-center items-center h-75">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
          ) : (
            <LineChart data={chartData} />
          )}
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
          <h2 className="font-semibold mb-4 text-slate-800 dark:text-white">Layanan Terpopuler</h2>
          {isLoadingSummary ? (
            <div className="flex justify-center items-center h-75">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
          ) : (
            <HorizontalBarChart data={summary?.top_services} />
          )}
        </div>
      </div>

      {/* RECENT ORDERS TABLE */}
      <RecentOrdersTable orders={orders} isLoading={isLoadingOrders} onOrderUpdate={fetchOrders} />

      {/* INVOICE TABLE */}
      <div className="pt-6 border-t border-slate-200 dark:border-slate-800 transition-colors">
        <InvoiceTable />
      </div>
    </div>
  );
}
