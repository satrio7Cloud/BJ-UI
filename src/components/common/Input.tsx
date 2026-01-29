interface InputProps {
  placeholder: string;
  type?: string;
}

export function Input({ placeholder, type = "text" }: InputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className="
        w-full
        rounded-lg
        border
        border-gray-300
        px-4
        py-3
        text-sm
        focus:outline-none
        focus:ring-2
        focus:ring-green-500
      "
    ></input>
  );
}
