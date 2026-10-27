import {
    DashboardChartsSection,
    DashboardErrorAlerts,
    DashboardHeader,
    DashboardKpiSection,
    DashboardOrdersSection,
} from "./components/sections";
import { InvoiceTable } from "../invoice/components";
import { useDashboard } from "./hooks/useDashboard";

export default function Dashboard() {
    const {
        summary,
        ordersMeta,
        chartData,
        loading,
        errors,
        filterStatus,
        setFilterStatus,
        searchQuery,
        setSearchQuery,
        displayedOrders,
        displayedKtlOrders,
        fetchOrders,
        handleDashboardUpdate,
    } = useDashboard();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
            {/* Header */}
            <DashboardHeader />

            {/* Error Alerts */}
            <DashboardErrorAlerts errors={errors} />

            {/* Unified KPI Cards */}
            <DashboardKpiSection
                summary={summary}
                isLoading={loading.summary}
                filterStatus={filterStatus}
                onFilterChange={setFilterStatus}
            />

            {/* Charts Section */}
            <DashboardChartsSection
                chartData={chartData}
                summary={summary}
                isLoadingChart={loading.chart}
                isLoadingSummary={loading.summary}
            />

            {/* Orders & KTL Tables */}
            <DashboardOrdersSection
                displayedOrders={displayedOrders}
                displayedKtlOrders={displayedKtlOrders}
                isLoadingOrders={loading.orders}
                isLoadingKtlOrders={loading.ktlOrders}
                ordersMeta={ordersMeta}
                filterStatus={filterStatus}
                searchQuery={searchQuery}
                onFilterStatusChange={setFilterStatus}
                onSearchQueryChange={setSearchQuery}
                onPageChange={(page) => fetchOrders(page, filterStatus)}
                onDashboardUpdate={handleDashboardUpdate}
            />

            {/* Invoice Table Section */}
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 transition-colors">
                <InvoiceTable />
            </div>
        </div>
    );
}
