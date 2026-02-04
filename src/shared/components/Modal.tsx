import type { ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export default function Modal({ open, onClose, title, children }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      {/* Modal Box */}
      <div
        className="
          relative
          bg-white
          text-gray-800
          w-full
          sm:max-w-md
          md:max-w-lg
          lg:max-w-xl
          max-h-[90vh]
          overflow-y-auto
          rounded-2xl
          sm:rounded-2xl
          shadow-xl
          p-6
          animate-slideUp
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          {title && (
            <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          )}

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        {children}
      </div>
    </div>
  );
}
