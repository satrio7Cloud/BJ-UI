import type { ServiceCategory } from "../../../data/services";
import { useState, useMemo } from "react";
import { servicesprice } from "../../../data/services";


export const useServices = () => {
  const [category, setCategory] = useState<ServiceCategory>("Semua");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return servicesprice.filter((s) => {
      const matchCategory =
        category === "Semua" || s.category === category;

      const matchSearch = s.title
        .toLowerCase()
        .includes(search.toLowerCase());

      return matchCategory && matchSearch;
    });
  }, [category, search]);

  return {
    servicesprice: filtered,
    category,
    setCategory,
    search,
    setSearch,
  };
};
