import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { getInvoices, type InvoiceData } from "../../../../api/invoice";

export function useInvoices() {
    const [invoices, setInvoices] = useState<InvoiceData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState("all");
    const [search, setSearch] = useState("");
    const [openAction, setOpenAction] = useState<string | null>(null);
    const [selectedInvoice, setSelectedInvoice] = useState<InvoiceData | null>(null);
    const actionRef = useRef<HTMLTableCellElement>(null);

    const fetchInvoices = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const res = await getInvoices(1, 100);
            if (res?.data) {
                setInvoices(res.data);
            }
        } catch (err: unknown) {
            console.error("Failed to load invoices", err);
            const msg = err instanceof Error ? err.message : "Gagal memuat data tagihan.";
            setError(msg);
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchInvoices();
    }, [fetchInvoices]);

    // Handle click outside untuk menutup dropdown action
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (actionRef.current && !actionRef.current.contains(event.target as Node)) {
                setOpenAction(null);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Perhitungan ringkasan KPI secara ter-memoize
    const { totalAmount, paidAmount, pendingAmount, overdueAmount } = useMemo(() => {
        const total = invoices.reduce((sum, inv) => sum + (inv.total_cost || 0), 0);
        const paid = invoices
            .filter((inv) => inv.payment_status?.toLowerCase() === "paid")
            .reduce((sum, inv) => sum + (inv.total_cost || 0), 0);
        const pending = invoices
            .filter((inv) => inv.payment_status?.toLowerCase() === "unpaid")
            .reduce((sum, inv) => sum + (inv.total_cost || 0), 0);
        const overdue = invoices
            .filter((inv) => inv.payment_status?.toLowerCase() === "overdue")
            .reduce((sum, inv) => sum + (inv.total_cost || 0), 0);

        return {
            totalAmount: total,
            paidAmount: paid,
            pendingAmount: pending,
            overdueAmount: overdue,
        };
    }, [invoices]);

    // Filter daftar invoice berdasarkan pencarian dan status pembayaran
    const filteredInvoices = useMemo(() => {
        const query = search.toLowerCase().trim();

        return invoices.filter((invoice) => {
            const matchSearch =
                !query ||
                (invoice.invoice_number || "").toLowerCase().includes(query) ||
                (invoice.customer_name || "").toLowerCase().includes(query) ||
                (invoice.service_name || "").toLowerCase().includes(query);

            const mappedStatus =
                invoice.payment_status?.toLowerCase() === "paid" ? "lunas" : "menunggu";
            const matchStatus = status === "all" ? true : mappedStatus === status;

            return matchSearch && matchStatus;
        });
    }, [invoices, search, status]);

    return {
        invoices,
        filteredInvoices,
        isLoading,
        error,
        status,
        setStatus,
        search,
        setSearch,
        openAction,
        setOpenAction,
        selectedInvoice,
        setSelectedInvoice,
        actionRef,
        totalAmount,
        paidAmount,
        pendingAmount,
        overdueAmount,
        refetch: fetchInvoices,
    };
}
