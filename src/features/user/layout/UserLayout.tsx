import { Outlet } from "react-router-dom";

export default function UserLayout() {
    return (
        <div className="min-h-screen bg-[#FDFBF7] relative selection:bg-emerald-200 selection:text-emerald-900 overflow-x-hidden">
            {/* Fixed Ambient Background Glows (Aurora Effect) */}
            <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-300/20 rounded-full blur-[120px] pointer-events-none z-0"></div>
            <div className="fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-teal-300/20 rounded-full blur-[120px] pointer-events-none z-0"></div>
            <div className="fixed top-[40%] left-[50%] -translate-x-1/2 w-[800px] h-[400px] bg-emerald-200/10 rounded-full blur-[100px] pointer-events-none z-0"></div>
            <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02] pointer-events-none z-0"></div>
            
            {/* The page content */}
            <div className="relative z-10 flex flex-col min-h-screen">
                <Outlet />
            </div>
        </div>
    );
}
