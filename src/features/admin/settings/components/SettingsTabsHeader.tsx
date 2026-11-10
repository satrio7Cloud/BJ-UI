import type { SettingsTabId } from "../types";
import { SETTINGS_TABS } from "../constants";

interface SettingsTabsHeaderProps {
  activeTab: SettingsTabId;
  onTabChange: (tabId: SettingsTabId) => void;
}

export default function SettingsTabsHeader({
  activeTab,
  onTabChange,
}: SettingsTabsHeaderProps) {
  return (
    <div className="flex border-b border-slate-200 dark:border-slate-800 transition-colors gap-2 overflow-x-auto pb-px">
      {SETTINGS_TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 py-3 px-4 font-bold text-sm border-b-2 transition-all -mb-0.5 cursor-pointer whitespace-nowrap ${
              isActive
                ? "border-emerald-600 text-emerald-600 dark:text-emerald-400 dark:border-emerald-400"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            <Icon size={16} />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

