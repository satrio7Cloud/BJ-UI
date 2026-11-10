import { useState } from "react";
import type { SettingsTabId } from "./types";
import {
  CompanyProfileTab,
  PreferencesTab,
  SettingsTabsHeader,
  ShippingSettingsTab,
} from "./components";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTabId>("office");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header Halaman */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Pengaturan Sistem
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Kelola profil kantor, titik logistik ekspedisi, kurir pengiriman, serta preferensi panel admin.
        </p>
      </div>

      {/* Navigasi Tab */}
      <SettingsTabsHeader activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Konten Tab Aktif */}
      {activeTab === "office" && <CompanyProfileTab />}
      {activeTab === "shipping" && <ShippingSettingsTab />}
      {activeTab === "preferences" && <PreferencesTab />}
    </div>
  );
}
