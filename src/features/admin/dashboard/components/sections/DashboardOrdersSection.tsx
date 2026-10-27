import type { DashboardOrder } from "../../../../../api/dashboard";
import type { OrderKTLResponse } from "../../../../../api/order";
import RecentKtlTable from "../orders/RecentKtlTable";
import RecentOrdersTable from "../orders/RecentOrdersTable";

interface DashboardOrdersSectionProps {
  displayedOrders: DashboardOrder[];
  displayedKtlOrders: OrderKTLResponse[];
  isLoadingOrders: boolean;
  isLoadingKtlOrders: boolean;
  ordersMeta: {
    page: number;
    limit: number;
    total_records: number;
  };
  filterStatus: string | null;
  searchQuery: string;
  onFilterStatusChange: (status: string | null) => void;
  onSearchQueryChange: (query: string) => void;
  onPageChange: (page: number) => void;
  onDashboardUpdate: () => void;
}

export default function DashboardOrdersSection({
  displayedOrders,
  displayedKtlOrders,
  isLoadingOrders,
  isLoadingKtlOrders,
  ordersMeta,
  filterStatus,
  searchQuery,
  onFilterStatusChange,
  onSearchQueryChange,
  onPageChange,
  onDashboardUpdate,
}: DashboardOrdersSectionProps) {
  const hasActiveFilter = Boolean(filterStatus || searchQuery);

  const getFilterStatusLabel = (status: string) => {
    switch (status) {
      case "Attention":
        return "⚠️ Butuh Perhatian Segera";
      case "Pending":
        return "⏳ Menunggu Diproses (Pending)";
      case "Processing":
        return "🚀 Pengurusan Kilat (Processing)";
      case "Completed":
        return "✅ Selesai (Completed)";
      default:
        return status;
    }
  };

  return (
    <>
      <div id="recent-orders-section" className="scroll-mt-8">
        {/* Active Filter Banner */}
        {hasActiveFilter && (
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3 px-4 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-blue-900 dark:text-blue-300">
              {filterStatus && (
                <span className="flex items-center gap-1.5">
                  Filter Status: <b>{getFilterStatusLabel(filterStatus)}</b>
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
                  onClick={() => onSearchQueryChange("")}
                  className="text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                >
                  Reset Cari
                </button>
              )}
              {filterStatus && (
                <button
                  onClick={() => onFilterStatusChange(null)}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  Hapus Filter Status
                </button>
              )}
              {filterStatus && searchQuery && (
                <button
                  onClick={() => {
                    onFilterStatusChange(null);
                    onSearchQueryChange("");
                  }}
                  className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline cursor-pointer"
                >
                  Reset Semua
                </button>
              )}
            </div>
          </div>
        )}

        {/* Recent Orders Table */}
        <RecentOrdersTable
          orders={displayedOrders}
          isLoading={isLoadingOrders}
          onOrderUpdate={onDashboardUpdate}
          meta={ordersMeta}
          onPageChange={onPageChange}
          searchQuery={searchQuery}
          onSearchChange={onSearchQueryChange}
        />
      </div>

      {/* Recent KTL Table */}
      <div id="recent-ktl-section" className="scroll-mt-8 mt-6">
        <RecentKtlTable
          orders={displayedKtlOrders}
          isLoading={isLoadingKtlOrders}
          onOrderUpdate={onDashboardUpdate}
          searchQuery={searchQuery}
          onSearchChange={onSearchQueryChange}
        />
      </div>
    </>
  );
}
