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
      className={`rounded-xl px-6 py-6 shadow hover:shadow-md transition border ${variantStyle}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h2 className="text-2xl font-bold mt-2">{value}</h2>
        </div>

        {Icon && (
          <div className={`p-3 rounded-lg border ${variantStyle}`}>
            <Icon size={22} />
          </div>
        )}
      </div>

      {description && (
        <p className={`text-sm mt-4 ${variantStyle.split(" ")[0]}`}>
          {description}
        </p>
      )}
    </div>
  );
}
