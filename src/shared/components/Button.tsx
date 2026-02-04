import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export default function Button({
  children,
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`
        rounded-lg
        bg-blue-600
        py-2
        px-4
        text-white
        font-semibold
        hover:bg-blue-700
        transition
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
