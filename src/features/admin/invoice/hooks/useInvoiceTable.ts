import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getInvoices, type InvoiceData } from "../../../../api/invoice";

export function useInvoiceTable(itemsPerPage = 5) {
    const [invoices, setInvoices] = useState<InvoiceData[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

    const fetchInvoices = useCallback(async (page = currentPage) => {
        try {
            setIsLoading(true);
            setError(null);
            const res = await getInvoices(page, itemsPerPage);
            if (res?.data) {
                setInvoices(res.data);
                setTotalItems(res.meta?.total || 0);
            }
        } catch (err: unknown) {
            console.error("Failed to fetch invoices", err);
            const msg = err instanceof Error ? err.message : "Gagal memuat invoice";
            setError(msg);
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, itemsPerPage]);

    useEffect(() => {
        fetchInvoices(currentPage);
    }, [currentPage, fetchInvoices]);

    return {
        invoices,
        currentPage,
        totalItems,
        totalPages,
        isLoading,
        error,
        setCurrentPage,
        refetch: fetchInvoices,
    };
}
