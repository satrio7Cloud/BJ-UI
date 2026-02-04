import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: PaginationProps) {
  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex items-center justify-between mt-6">
      <p className="text-sm text-gray-500">
        Menampilkan {start}–{end} dari {totalItems} data
      </p>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="p-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
        >
          <ChevronLeft size={16} />
        </button>

        {Array.from({ length: totalPages }).map((_, i) => {
          const page = i + 1;
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 rounded-lg text-sm border
                ${
                  currentPage === page
                    ? "bg-blue-600 text-white border-blue-600"
                    : "hover:bg-gray-50"
                }
              `}
            >
              {page}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="p-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
