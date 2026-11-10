import { Building2, Sliders, Truck } from "lucide-react";
import type { SettingsTabItem } from "../types";

export const SETTINGS_TABS: SettingsTabItem[] = [
  {
    id: "office",
    label: "Profil Kantor & Titik Logistik",
    icon: Building2,
    description: "Kelola identitas kantor, kontak CS, dan origin pengiriman",
  },
  {
    id: "shipping",
    label: "Ekspedisi & Pengiriman",
    icon: Truck,
    description: "Atur kurir aktif, skenario berkas, dan multiplier tarif",
  },
  {
    id: "preferences",
    label: "Tampilan & Preferensi",
    icon: Sliders,
    description: "Preferensi antarmuka dark mode dan notifikasi panel",
  },
];

export * from "./courier";

