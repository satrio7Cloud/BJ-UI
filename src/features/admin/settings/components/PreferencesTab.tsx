import { Bell, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { useTheme } from "../../../../context/ThemeContext";
import Button from "../../../../shared/components/Button";

export default function PreferencesTab() {
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
      {/* 1. TEMA ANTARMUKA */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800 transition-colors space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <Sun size={20} />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900 dark:text-white">
              Tema Antarmuka
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Sesuaikan tampilan visual aplikasi Anda.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 transition-colors">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {theme === "dark" ? "Mode Gelap (Dark)" : "Mode Terang (Light)"}
          </span>
          <Button variant="outline" size="icon" onClick={toggleTheme}>
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
        </div>
      </div>

      {/* 2. NOTIFIKASI SISTEM */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800 transition-colors space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <Bell size={20} />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900 dark:text-white">
              Notifikasi Sistem
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Kelola peringatan audio & toast browser.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 transition-colors">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Notifikasi Pesanan Baru
          </span>
          <button
            type="button"
            onClick={() => setNotifications(!notifications)}
            className={`w-11 h-6 rounded-full relative transition-colors cursor-pointer ${
              notifications ? "bg-emerald-600" : "bg-slate-300 dark:bg-slate-800"
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${
                notifications ? "left-6" : "left-1"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

