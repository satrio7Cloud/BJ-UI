import type { LucideIcon } from "lucide-react";
import React from "react";

type Breakdown = {
    label: string;
    value: string | number;
    valueClass?: string;
};

type Props = {
    title: string;
    value: number | string;
    description?: string;
    icon?: LucideIcon;
    variant?: "success" | "warning" | "info" | "danger";
    breakdowns?: Breakdown[];
    onClick?: () => void;
};

export default function ModernStatCard({
    title,
    value,
    description,
    icon: Icon,
    variant = "info",
    breakdowns,
    onClick,
}: Props) {
    const variantConfig = {
        success: {
            bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
            iconColor: "text-emerald-600 dark:text-emerald-400",
            border: "border-emerald-200 dark:border-emerald-800/50",
            gradient: "from-emerald-500/5 to-transparent",
        },
        warning: {
            bg: "bg-amber-500/10 dark:bg-amber-500/20",
            iconColor: "text-amber-600 dark:text-amber-400",
            border: "border-amber-200 dark:border-amber-800/50",
            gradient: "from-amber-500/5 to-transparent",
        },
        info: {
            bg: "bg-blue-500/10 dark:bg-blue-500/20",
            iconColor: "text-blue-600 dark:text-blue-400",
            border: "border-blue-200 dark:border-blue-800/50",
            gradient: "from-blue-500/5 to-transparent",
        },
        danger: {
            bg: "bg-rose-500/10 dark:bg-rose-500/20",
            iconColor: "text-rose-600 dark:text-rose-400",
            border: "border-rose-200 dark:border-rose-800/50",
            gradient: "from-rose-500/5 to-transparent",
        },
    }[variant];

    return (
        <div
            onClick={onClick}
            className={`
                relative overflow-hidden
                rounded-2xl
                p-5 lg:p-6
                bg-white dark:bg-slate-900
                border ${variantConfig.border}
                shadow-sm
                transition-all duration-300
                ${onClick ? "cursor-pointer hover:shadow-lg hover:-translate-y-1 hover:border-transparent dark:hover:border-transparent" : ""}
            `}
        >
            {/* Background Gradient */}
            <div className={`absolute top-0 left-0 w-full h-full bg-linear-to-br ${variantConfig.gradient} opacity-50 pointer-events-none`} />

            <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                    <div className="flex justify-between items-start mb-4">
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
                        {Icon && (
                            <div className={`p-2.5 rounded-xl ${variantConfig.bg}`}>
                                <Icon size={20} className={variantConfig.iconColor} strokeWidth={2.5} />
                            </div>
                        )}
                    </div>

                    <h3 className="text-2xl lg:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
                        {value}
                    </h3>

                    {description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {description}
                        </p>
                    )}
                </div>

                {/* Breakdowns */}
                {breakdowns && breakdowns.length > 0 && (
                    <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/60">
                        <div className="flex items-center gap-4">
                            {breakdowns.map((item, idx) => (
                                <React.Fragment key={idx}>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                                            {item.label}
                                        </span>
                                        <span className={`text-sm font-semibold mt-0.5 ${item.valueClass || 'text-slate-700 dark:text-slate-300'}`}>
                                            {item.value}
                                        </span>
                                    </div>
                                    {idx < breakdowns.length - 1 && (
                                        <div className="w-px h-8 bg-slate-200 dark:bg-slate-800" />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
