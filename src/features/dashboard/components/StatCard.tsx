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
    success: "text-green-700 bg-green-50 border-green-200",
    warning: "text-yellow-700 bg-yellow-50 border-yellow-200",
    info: "text-blue-700 bg-blue-50 border-blue-200",
    danger: "text-red-700 bg-red-50 border-red-200",
  }[variant];

  return (
    <div
      className={`
        rounded-xl
        p-3 sm:p-4 lg:px-6 lg:py-6
        shadow
        border
        ${variantStyle}
      `}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs sm:text-sm text-gray-500">{title}</p>

          <h2 className="text-base sm:text-xl lg:text-2xl font-bold mt-1">
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
