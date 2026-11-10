import { useState, useEffect, useCallback } from "react";
import type { ShippingSettings, CourierServiceItem } from "../../types/shippingSettings";
import { getBackendShippingSettingsApi } from "../../api/shipping";

export const DEFAULT_ENABLED_COURIERS: CourierServiceItem[] = [
    { courier_code: "jne", courier_service_code: "reg" },
    { courier_code: "jne", courier_service_code: "yes" },
    { courier_code: "sicepat", courier_service_code: "reg" },
    { courier_code: "sicepat", courier_service_code: "best" },
    { courier_code: "jnt", courier_service_code: "ez" },
    { courier_code: "anteraja", courier_service_code: "reg" },
    { courier_code: "ninja", courier_service_code: "standard" },
    { courier_code: "lalamove", courier_service_code: "motorcycle" },
];

export const DEFAULT_SHIPPING_SETTINGS: ShippingSettings = {
    enabled_couriers: DEFAULT_ENABLED_COURIERS,
    enabledCouriers: Array.from(new Set(DEFAULT_ENABLED_COURIERS.map((c) => c.courier_code))),
    defaultItemWeight: 200,
    defaultItemValue: 100000,
    doorToDoorMultiplier: 2,
};

const STORAGE_KEY = "admin_shipping_settings";
const EVENT_KEY = "shipping_settings_updated";

/**
 * Mengambil pengaturan ekspedisi saat ini dari localStorage atau nilai default
 */
export function getShippingSettings(): ShippingSettings {
    if (typeof window === "undefined") return DEFAULT_SHIPPING_SETTINGS;
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return DEFAULT_SHIPPING_SETTINGS;
        const parsed = JSON.parse(raw);

        let enabled_couriers: CourierServiceItem[] = DEFAULT_ENABLED_COURIERS;
        if (Array.isArray(parsed.enabled_couriers) && parsed.enabled_couriers.length > 0) {
            enabled_couriers = parsed.enabled_couriers;
        } else if (Array.isArray(parsed.enabledCouriers) && parsed.enabledCouriers.length > 0) {
            enabled_couriers = parsed.enabledCouriers.map((name: string) => ({
                courier_code: name.toLowerCase(),
                courier_service_code: "reg",
            }));
        }

        const enabledCouriers = Array.from(
            new Set(enabled_couriers.map((c) => c.courier_code.toLowerCase()))
        );

        return {
            enabled_couriers,
            enabledCouriers,
            defaultItemWeight:
                typeof parsed.defaultItemWeight === "number" && parsed.defaultItemWeight > 0
                    ? parsed.defaultItemWeight
                    : typeof parsed.default_item_weight === "number" && parsed.default_item_weight > 0
                    ? parsed.default_item_weight
                    : DEFAULT_SHIPPING_SETTINGS.defaultItemWeight,
            defaultItemValue:
                typeof parsed.defaultItemValue === "number" && parsed.defaultItemValue >= 0
                    ? parsed.defaultItemValue
                    : typeof parsed.default_item_value === "number" && parsed.default_item_value >= 0
                    ? parsed.default_item_value
                    : DEFAULT_SHIPPING_SETTINGS.defaultItemValue,
            doorToDoorMultiplier:
                typeof parsed.doorToDoorMultiplier === "number" && parsed.doorToDoorMultiplier > 0
                    ? parsed.doorToDoorMultiplier
                    : DEFAULT_SHIPPING_SETTINGS.doorToDoorMultiplier,
        };
    } catch {
        return DEFAULT_SHIPPING_SETTINGS;
    }
}

/**
 * Menyimpan pengaturan ekspedisi baru ke localStorage dan memancarkan event ke komponen lain
 */
export function saveShippingSettings(settings: ShippingSettings): void {
    if (typeof window === "undefined") return;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        window.dispatchEvent(new CustomEvent(EVENT_KEY, { detail: settings }));
    } catch (err) {
        console.error("Gagal menyimpan shipping settings:", err);
    }
}

/**
 * React Hook untuk menggunakan dan memantau perubahan pengaturan ekspedisi secara real-time
 */
export function useShippingSettings() {
    const [settings, setSettings] = useState<ShippingSettings>(getShippingSettings);
    const [isFetchingBackend, setIsFetchingBackend] = useState<boolean>(false);

    // Ambil data terbaru dari backend pada saat mount
    useEffect(() => {
        let isMounted = true;
        const fetchRemote = async () => {
            try {
                setIsFetchingBackend(true);
                const res = await getBackendShippingSettingsApi();
                if (isMounted && res?.data) {
                    const remote = res.data;
                    const mergedCouriers = remote.enabled_couriers || [];
                    const uniqueNames = Array.from(new Set(mergedCouriers.map((c) => c.courier_code.toLowerCase())));

                    setSettings((prev) => {
                        const updated: ShippingSettings = {
                            ...prev,
                            enabled_couriers: mergedCouriers,
                            enabledCouriers: uniqueNames,
                            defaultItemWeight: remote.default_item_weight || prev.defaultItemWeight,
                            defaultItemValue: remote.default_item_value || prev.defaultItemValue,
                        };
                        saveShippingSettings(updated);
                        return updated;
                    });
                }
            } catch (err) {
                console.warn("Menggunakan pengaturan shipping lokal/cached:", err);
            } finally {
                if (isMounted) setIsFetchingBackend(false);
            }
        };

        fetchRemote();
        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        const handleUpdate = (e: Event) => {
            const customEvent = e as CustomEvent<ShippingSettings>;
            if (customEvent.detail) {
                setSettings(customEvent.detail);
            } else {
                setSettings(getShippingSettings());
            }
        };

        window.addEventListener(EVENT_KEY, handleUpdate);
        window.addEventListener("storage", handleUpdate);
        return () => {
            window.removeEventListener(EVENT_KEY, handleUpdate);
            window.removeEventListener("storage", handleUpdate);
        };
    }, []);

    const update = useCallback((newSettings: ShippingSettings) => {
        const uniqueNames = Array.from(
            new Set((newSettings.enabled_couriers || []).map((c) => c.courier_code.toLowerCase()))
        );
        const completeSettings: ShippingSettings = {
            ...newSettings,
            enabledCouriers: uniqueNames,
        };
        saveShippingSettings(completeSettings);
        setSettings(completeSettings);
    }, []);

    const reset = useCallback(() => {
        saveShippingSettings(DEFAULT_SHIPPING_SETTINGS);
        setSettings(DEFAULT_SHIPPING_SETTINGS);
    }, []);

    return { settings, updateSettings: update, resetSettings: reset, isFetchingBackend };
}
