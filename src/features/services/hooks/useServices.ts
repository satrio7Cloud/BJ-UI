import { useState, useEffect, useMemo } from "react";
import type { Service, ServiceCategory } from "../../../data/services";
import { getServices } from "../../../api/services";

const mapCategory = (category: string): ServiceCategory => {
  const catLower = category.toLowerCase();
  if (catLower.includes("stnk") || catLower.includes("pajak") || catLower.includes("perpanjang")) return "STNK";
  if (catLower.includes("bpkb") || catLower.includes("balik nama")) return "BPKB";
  if (catLower.includes("sim")) return "SIM";
  if (catLower.includes("plat")) return "Plat Nomor";
  if (catLower.includes("mutasi")) return "Mutasi";
  return "STNK"; // default fallback
};

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [category, setCategory] = useState<ServiceCategory>("Semua");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await getServices();
      if (res?.data) {
        const mapped = res.data.map((item) => {
          const isMotor = item.service_name.toLowerCase().includes("motor");
          return {
            id: item.id,
            title: item.service_name,
            description: item.description,
            category: mapCategory(item.category),
            basePrice: item.service_fee,
            options: [
              {
                type: "regular" as const,
                label: "Reguler",
                duration: isMotor ? "3 - 5 Hari Kerja" : "5 - 7 Hari Kerja",
                extraPrice: 0,
              },
              {
                type: "express" as const,
                label: "Express",
                duration: isMotor ? "1 - 2 Hari Kerja" : "2 - 3 Hari Kerja",
                extraPrice: Math.round(item.service_fee * 0.3), // 30% tambahan untuk Express
              }
            ]
          };
        });
        setServices(mapped);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Gagal memuat data layanan");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const filtered = useMemo(() => {
    return services.filter((s) => {
      const matchCategory = category === "Semua" || s.category === category;
      const matchSearch = s.title.toLowerCase().includes(search.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [services, category, search]);

  return {
    servicesprice: filtered,
    category,
    setCategory,
    search,
    setSearch,
    isLoading,
    error,
    refetch: fetchServices,
  };
};
