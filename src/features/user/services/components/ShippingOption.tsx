interface Props {
  active: boolean;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  extra?: string;
  onClick: () => void;
}

export default function ShippingOption({
  active,
  icon,
  title,
  subtitle,
  extra,
  onClick,
}: Props) {
  return (
    <div
      onClick={onClick}
      className={`border rounded-xl p-4 flex gap-4 cursor-pointer items-start
        ${active ? "border-blue-600 bg-blue-50" : "border-gray-200"}
      `}
    >
      <input type="radio" checked={active} readOnly />

      <div className="bg-blue-600 text-white p-2 rounded-lg">{icon}</div>

      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-gray-500">{subtitle}</p>

        {extra && <p className="text-xs text-blue-600 mt-1">{extra}</p>}
      </div>
    </div>
  );
}
