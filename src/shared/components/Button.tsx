import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";

export type ButtonVariant = "primary" | "secondary" | "outline" | "danger" | "ghost" | "admin";
export type ButtonSize = "sm" | "md" | "lg" | "icon" | "full";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
}

export default function Button({
    children,
    className = "",
    variant = "primary",
    size = "md",
    type = "button",
    isLoading = false,
    disabled,
    ...props
}: ButtonProps) {

    // Base styling applied to all buttons
    let baseClass = "inline-flex items-center justify-center font-bold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

    // Theme variants
    let variantClass = "";
    switch (variant) {
        case "primary":
            // The modern Emerald green used across the User side
            variantClass = "bg-[#0A3222] hover:bg-[#12412D] text-white shadow-lg shadow-emerald-900/20";
            break;
        case "secondary":
            variantClass = "bg-emerald-100 text-emerald-800 hover:bg-emerald-200";
            break;
        case "outline":
            variantClass = "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 shadow-sm";
            break;
        case "danger":
            variantClass = "bg-red-600 hover:bg-red-700 text-white shadow-sm";
            break;
        case "ghost":
            variantClass = "bg-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100";
            break;
        case "admin":
            // The Blue theme used in the Admin dashboard
            variantClass = "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20";
            break;
    }

    // Size variants
    let sizeClass = "";
    switch (size) {
        case "sm":
            sizeClass = "px-4 py-2 text-xs rounded-xl";
            break;
        case "md":
            sizeClass = "px-6 py-3 text-sm rounded-xl";
            break;
        case "lg":
            sizeClass = "px-8 py-4 text-base rounded-2xl";
            break;
        case "icon":
            sizeClass = "p-2 rounded-xl text-sm";
            break;
        case "full":
            sizeClass = "w-full px-6 py-3 text-sm rounded-xl";
            break;
    }

    // Combine classes. We append custom className at the end so it can override if strictly necessary.
    const finalClassName = `${baseClass} ${variantClass} ${sizeClass} ${className}`;

    return (
        <button
            type={type}
            className={finalClassName}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-current" />
                    Memproses...
                </span>
            ) : (
                children
            )}
        </button>
    );
}
