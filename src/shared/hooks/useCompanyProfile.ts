import { useCallback, useEffect, useState } from "react";
import {
    DEFAULT_OFFICE_PROFILE,
    getCompanyProfile,
    type CompanyProfile,
} from "../../api/companyProfile";

// ==========================================
// Module-level In-Memory Cache & In-Flight Promise
// ==========================================
let cachedProfile: CompanyProfile | null = null;
let cachedPromise: Promise<CompanyProfile | null> | null = null;

/**
 * Menghapus cache profil kantor di memori (berguna saat profil diperbarui oleh admin)
 */
export function clearCompanyProfileCache(): void {
    cachedProfile = null;
    cachedPromise = null;
}

export function useCompanyProfile() {
    // Jika sudah ada data di cache, langsung gunakan tanpa delay & tanpa flicker
    const [profile, setProfile] = useState<CompanyProfile>(
        cachedProfile || DEFAULT_OFFICE_PROFILE
    );
    const [isLoading, setIsLoading] = useState<boolean>(!cachedProfile);
    const [error, setError] = useState<string | null>(null);

    const fetchProfile = useCallback(async (force = false) => {
        // 1. Jika data sudah ada di cache dan tidak dipaksa refetch, gunakan cache langsung
        if (cachedProfile && !force) {
            setProfile(cachedProfile);
            setIsLoading(false);
            return;
        }

        // 2. Gabungkan request yang berjalan bersamaan (in-flight promise coalescing)
        if (!cachedPromise || force) {
            cachedPromise = (async () => {
                try {
                    const res = await getCompanyProfile();
                    if (res?.data) {
                        cachedProfile = res.data;
                        return res.data;
                    }
                    return null;
                } catch (err: any) {
                    console.warn(
                        "Gagal mengambil profil kantor dari backend, menggunakan data default:",
                        err?.message || err
                    );
                    throw err;
                } finally {
                    cachedPromise = null;
                }
            })();
        }

        try {
            setIsLoading(true);
            const data = await cachedPromise;
            if (data) {
                setProfile(data);
                setError(null);
            }
        } catch (err: any) {
            setError(err?.message || "Gagal memuat profil kantor");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    return {
        profile,
        isLoading,
        error,
        refetch: () => fetchProfile(true),
    };
}
