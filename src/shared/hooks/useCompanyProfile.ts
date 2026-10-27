import { useCallback, useEffect, useState } from "react";
import {
  DEFAULT_OFFICE_PROFILE,
  getCompanyProfile,
  type CompanyProfile,
} from "../../api/companyProfile";

export function useCompanyProfile() {
  const [profile, setProfile] = useState<CompanyProfile>(DEFAULT_OFFICE_PROFILE);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await getCompanyProfile();
      if (res && res.data) {
        setProfile(res.data);
        setError(null);
      }
    } catch (err: any) {
      console.warn(
        "Gagal mengambil profil kantor dari backend, menggunakan data default:",
        err?.message || err
      );
      setError(err?.message || "Gagal memuat profil kantor");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { profile, isLoading, error, refetch: fetchProfile };
}
