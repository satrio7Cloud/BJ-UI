import { Bell, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { useTheme } from "../../../context/ThemeContext";

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Pengaturan Aplikasi
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Kelola preferensi antarmuka dan keamanan panel admin.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* TAMPILAN */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 transition-colors space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
              <Sun size={20} />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900 dark:text-white">Tema</h2>
              <p className="text-xs text-slate-400 dark:text-slate-500">Sesuaikan tampilan visual aplikasi Anda.</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 transition-colors">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {theme === "dark" ? "Mode Gelap (Dark)" : "Mode Terang (Light)"}
            </span>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>

        {/* NOTIFIKASI & KEAMANAN */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 transition-colors space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
              <Bell size={20} />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900 dark:text-white">Notifikasi</h2>
              <p className="text-xs text-slate-400 dark:text-slate-500">Kelola pengaturan peringatan sistem.</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 transition-colors">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Notifikasi Peringatan</span>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`w-11 h-6 rounded-full relative transition-colors ${
                notifications ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-800"
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
    </div>
  );
}
