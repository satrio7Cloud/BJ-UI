import type { LucideIcon } from "lucide-react";

type Props = {
  title: string;
  value: number | string;
  description?: string;
  icon?: LucideIcon;
  variant?: "success" | "warning" | "info" | "danger";
};

export default function StatCard({
  title,
  value,
  description,
  icon: Icon,
  variant = "info",
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
        p-3 sm:p-4 lg:px-6 lg:py-6
        shadow-sm dark:shadow-none
        transition-colors
        border
        ${variantStyle}
      `}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">{title}</p>

          <h2 className="text-base sm:text-xl lg:text-2xl font-bold mt-1 text-slate-800 dark:text-white transition-colors">
            {value}
          </h2>
        </div>

        {Icon && (
          <div
            className={`
              p-1.5 sm:p-2 lg:p-3
              rounded-lg
              border
              ${variantStyle}
            `}
          >
            <Icon size={16} className="sm:hidden" />
            <Icon size={18} className="hidden sm:block lg:hidden" />
            <Icon size={22} className="hidden lg:block" />
          </div>
        )}
      </div>

      {description && (
        <p className={`text-xs sm:text-sm mt-2 ${variantStyle.split(" ")[0]}`}>
          {description}
        </p>
      )}
    </div>
  );
}
