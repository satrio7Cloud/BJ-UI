import { Outlet } from "react-router-dom";

export default function UserLayout() {
  return (
    <div className="min-h-screen bg-[#F8FAF9] relative selection:bg-emerald-200 selection:text-emerald-900 text-slate-800 antialiased">
      {/* Background layer with overflow-hidden so ambient orbs never trigger horizontal overflow or dual scrollbars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Master Unified Canvas: Micro-dot grid & soft top glow */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.08) 0%, transparent 65%),
              radial-gradient(circle at 1px 1px, rgba(16, 185, 129, 0.065) 1.2px, transparent 0)
            `,
            backgroundSize: "100% 100%, 32px 32px",
          }}
        />

        {/* Atmospheric Soft Aurora Lights along document flow */}
        <div className="absolute top-12.5 left-1/2 -translate-x-1/2 w-225 h-137.5 bg-linear-to-b from-emerald-300/20 via-teal-200/15 to-transparent rounded-full blur-[140px]" />
        <div className="absolute top-250 -left-37.5 w-150 h-150 bg-emerald-200/20 rounded-full blur-[140px]" />
        <div className="absolute top-525 -right-37.5 w-162.5 h-162.5 bg-teal-200/20 rounded-full blur-[140px]" />
        <div className="absolute top-800 left-1/2 -translate-x-1/2 w-200 h-137.5 bg-emerald-200/20 rounded-full blur-[140px]" />
        <div className="absolute top-1075 -left-25 w-150 h-150 bg-teal-200/20 rounded-full blur-[140px]" />
      </div>

      {/* Page Content Container */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Outlet />
      </div>
    </div>
  );
}
