type Props = {
  title: string;
  description: string;
  price: string;
};

export default function ServiceCard({ title, description, price }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
      <h3 className="text-lg font-semibold text-blue-900">{title}</h3>
      <p className="mt-2 text-blue-700 text-sm">{description}</p>

      {/* PRICE */}
      <p className="mt-4 font-semibold text-blue-600">{price}</p>
    </div>
  );
}
