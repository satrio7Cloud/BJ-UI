import { useState, useEffect, useCallback } from "react";
import type { DeliveryMethod } from "../../types/deliveryMethod";
import { getDeliveryMethodsApi, getAdminDeliveryMethodsApi } from "../../api/deliveryMethods";

export function useDeliveryMethods(isAdmin: boolean = false) {
  const [deliveryMethods, setDeliveryMethods] = useState<DeliveryMethod[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMethods = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = isAdmin
        ? await getAdminDeliveryMethodsApi()
        : await getDeliveryMethodsApi();

      if (res?.data && Array.isArray(res.data)) {
        setDeliveryMethods(res.data);
      } else {
        setDeliveryMethods([]);
      }
    } catch (err: any) {
      console.error("Gagal memuat metode pengantaran dari backend:", err);
      setError(err?.message || "Gagal memuat metode pengantaran");
      setDeliveryMethods([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    fetchMethods();
  }, [fetchMethods]);

  const activeMethods = deliveryMethods.filter((m) => (isAdmin ? true : m.is_active));

  const pickupMethods = activeMethods
    .filter((m) => m.direction === "PICKUP" || m.direction === "BOTH")
    .sort((a, b) => a.display_order - b.display_order);

  const returnDeliveryMethods = activeMethods
    .filter((m) => m.direction === "RETURN" || m.direction === "BOTH")
    .sort((a, b) => a.display_order - b.display_order);

  return {
    deliveryMethods,
    activeMethods,
    pickupMethods,
    returnDeliveryMethods,
    isLoading,
    error,
    refetch: fetchMethods,
  };
}
