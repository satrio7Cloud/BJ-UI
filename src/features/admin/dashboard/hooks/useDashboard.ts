import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
    getDashboardChart,
    getDashboardOrders,
    getDashboardSummary,
    type DashboardChartData,
    type DashboardOrder,
    type DashboardSummary,
} from "../../../../api/dashboard";
import { getKTLOrders, type OrderKTLResponse } from "../../../../api/order";

export interface DashboardLoadingState {
    summary: boolean;
    orders: boolean;
    ktlOrders: boolean;
    chart: boolean;
}

export interface DashboardErrorState {
    summary: string | null;
    orders: string | null;
    ktlOrders: string | null;
    chart: string | null;
}

export function useDashboard() {
    const [summary, setSummary] = useState<DashboardSummary | null>(null);
    const [orders, setOrders] = useState<DashboardOrder[]>([]);
    const [ordersMeta, setOrdersMeta] = useState({
        page: 1,
        limit: 10,
        total_records: 0,
    });
    const [ktlOrders, setKtlOrders] = useState<OrderKTLResponse[]>([]);
    const [chartData, setChartData] = useState<DashboardChartData[]>([]);

    const [loading, setLoading] = useState<DashboardLoadingState>({
        summary: true,
        orders: true,
        ktlOrders: true,
        chart: true,
    });

    const [errors, setErrors] = useState<DashboardErrorState>({
        summary: null,
        orders: null,
        ktlOrders: null,
        chart: null,
    });

    const [filterStatus, setFilterStatus] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    // 1. Fetch Summary
    const fetchSummary = useCallback(async () => {
        try {
            setLoading((prev) => ({ ...prev, summary: true }));
            setErrors((prev) => ({ ...prev, summary: null }));
            const data = await getDashboardSummary();
            setSummary(data);
        } catch (err: unknown) {
            toast.error("Gagal mengambil data summary");
            const msg = err instanceof Error ? err.message : "Gagal mengambil ringkasan dashboard";
            setErrors((prev) => ({ ...prev, summary: msg }));
        } finally {
            setLoading((prev) => ({ ...prev, summary: false }));
        }
    }, []);

    // 2. Fetch Orders
    const fetchOrders = useCallback(
        async (page = 1, status = filterStatus) => {
            try {
                setLoading((prev) => ({ ...prev, orders: true }));
                setErrors((prev) => ({ ...prev, orders: null }));
                const response = await getDashboardOrders(
                    page,
                    ordersMeta.limit,
                    status || undefined
                );
                setOrders(response.data);
                setOrdersMeta(response.meta);
            } catch (err: unknown) {
                toast.error("Gagal mengambil data pesanan terkini");
                const msg = err instanceof Error ? err.message : "Gagal mengambil data pesanan terkini";
                setErrors((prev) => ({ ...prev, orders: msg }));
            } finally {
                setLoading((prev) => ({ ...prev, orders: false }));
            }
        },
        [filterStatus, ordersMeta.limit]
    );

    // 3. Fetch KTL Orders
    const fetchKtlOrders = useCallback(async () => {
        try {
            setLoading((prev) => ({ ...prev, ktlOrders: true }));
            setErrors((prev) => ({ ...prev, ktlOrders: null }));
            const data = await getKTLOrders();
            setKtlOrders(data);
        } catch (err: unknown) {
            toast.error("Gagal mengambil data pesanan KTL");
            const msg = err instanceof Error ? err.message : "Gagal mengambil data pesanan KTL";
            setErrors((prev) => ({ ...prev, ktlOrders: msg }));
        } finally {
            setLoading((prev) => ({ ...prev, ktlOrders: false }));
        }
    }, []);

    // 4. Fetch Chart Data
    const fetchChart = useCallback(async () => {
        try {
            setLoading((prev) => ({ ...prev, chart: true }));
            setErrors((prev) => ({ ...prev, chart: null }));
            const data = await getDashboardChart();
            setChartData(data);
        } catch (err: unknown) {
            toast.error("Gagal mengambil data grafik transaksi");
            const msg = err instanceof Error ? err.message : "Gagal mengambil data grafik transaksi";
            setErrors((prev) => ({ ...prev, chart: msg }));
        } finally {
            setLoading((prev) => ({ ...prev, chart: false }));
        }
    }, []);

    // Initial loading
    useEffect(() => {
        fetchSummary();
        fetchKtlOrders();
        fetchChart();
    }, [fetchSummary, fetchKtlOrders, fetchChart]);

    // Re-fetch orders saat filterStatus berubah
    useEffect(() => {
        fetchOrders(1, filterStatus);
    }, [filterStatus, fetchOrders]);

    // Handle update trigger terpusat
    const handleDashboardUpdate = useCallback(() => {
        fetchOrders(ordersMeta.page, filterStatus);
        fetchKtlOrders();
        fetchSummary();
    }, [fetchOrders, ordersMeta.page, filterStatus, fetchKtlOrders, fetchSummary]);

    // Global orderUpdated event listener
    useEffect(() => {
        const handleOrderEvent = () => handleDashboardUpdate();
        window.addEventListener("orderUpdated", handleOrderEvent);
        return () => window.removeEventListener("orderUpdated", handleOrderEvent);
    }, [handleDashboardUpdate]);

    // Helper functions
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

    // Filtered orders memoized
    const displayedOrders = useMemo(() => {
        const query = searchQuery.toLowerCase().trim();

        return orders.filter((o) => {
            if (ktlOrders.some((ktl) => ktl.id === o.order_id)) return false;
            if (filterStatus) {
                if (filterStatus === "Attention") {
                    const hasUnverified =
                        typeof o.unverified_docs === "number" ? o.unverified_docs > 0 : false;
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
    }, [orders, ktlOrders, filterStatus, searchQuery]);

    // Filtered KTL orders memoized
    const displayedKtlOrders = useMemo(() => {
        const query = searchQuery.toLowerCase().trim();

        return ktlOrders.filter((ktl) => {
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
    }, [ktlOrders, filterStatus, searchQuery]);

    return {
        summary,
        orders,
        ordersMeta,
        ktlOrders,
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
        fetchKtlOrders,
        fetchSummary,
        fetchChart,
        handleDashboardUpdate,
    };
}
