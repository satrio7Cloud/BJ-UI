import type { LucideIcon } from "lucide-react";

type Props = {
  title: string;
  value: number | string;
  description?: string;
  icon?: LucideIcon;
  variant?: "success" | "warning" | "info" | "danger";
  onClick?: () => void;
};

export default function StatCard({
  title,
  value,
  description,
  icon: Icon,
  variant = "info",
  onClick,
}: Props) {
  const variantStyle = {
    success: "text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800",
    warning: "text-yellow-700 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800",
    info: "text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800",
    danger: "text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800",
  }[variant];

  return (
    <div
      className={`
        rounded-xl
        p-3 sm:p-4 lg:p-6
        shadow-sm dark:shadow-none
        transition-all
        border
        h-full flex flex-col justify-between
        ${variantStyle}
        ${onClick ? "cursor-pointer hover:shadow-md hover:scale-[1.02]" : ""}
      `}
      onClick={onClick}
    >
      <div>
        <div className="flex items-start justify-between gap-1.5 sm:gap-2">
          <p className="text-[11px] sm:text-xs lg:text-sm font-medium text-slate-500 dark:text-slate-400 line-clamp-1">
            {title}
          </p>

          {Icon && (
            <div
              className={`
                p-1 sm:p-1.5 lg:p-2.5
                rounded-lg
                border shrink-0
                ${variantStyle}
              `}
            >
              <Icon size={14} className="sm:hidden" />
              <Icon size={18} className="hidden sm:block lg:hidden" />
              <Icon size={20} className="hidden lg:block" />
            </div>
          )}
        </div>

        <h2 className="text-sm sm:text-lg lg:text-2xl font-bold mt-1 text-slate-800 dark:text-white transition-colors truncate">
          {value}
        </h2>
      </div>

      {description && (
        <p className={`text-[10px] sm:text-xs mt-2 line-clamp-1 sm:line-clamp-none ${variantStyle.split(" ")[0]}`}>
          {description}
        </p>
      )}
    </div>
  );
}
