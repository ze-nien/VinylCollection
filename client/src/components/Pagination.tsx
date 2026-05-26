//定義Props
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const generatePageNumbers = (currentPage: number, totalPages: number) => {
  const pages: (number | string)[] = [];
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
    return pages;
  }
  pages.push(1);
  let startPage = Math.max(2, currentPage - 1);
  let endPage = Math.min(totalPages - 1, currentPage + 1);
  if (currentPage <= 3) {
    endPage = 4;
  }
  if (currentPage >= totalPages - 2) {
    startPage = totalPages - 3;
  }
  if (startPage > 2) {
    pages.push("... ");
  }
  for (let i = startPage; i <= endPage; i++) {
    if (!pages.includes(i)) pages.push(i);
  }
  if (endPage < totalPages - 1) {
    pages.push(" ...");
  }
  if (!pages.includes(totalPages)) {
    pages.push(totalPages);
  }
  return pages;
};

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  if (totalPages <= 1) return null;
  return (
    <div className="flex justify-center items-center gap-1 mt-5 select-none">
      {/* ⬅️ 上一頁 */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="disabled:opacity-40 disabled:cursor-not-allowed
        hover:text-primary hover:cursor-pointer transition"
      >
        &lt;
      </button>

      {/* 動態頁碼 */}
      {generatePageNumbers(currentPage, totalPages).map((page, index) => {
        if (typeof page === "string") {
          return <span key={`ellipsis-${index}`}>...</span>;
        }

        return (
          <button
            key={`page-${page}`}
            onClick={() => onPageChange(page)}
            disabled={currentPage === page}
            className={`px-2 py-2 text-sm transition ${
              currentPage === page
                ? "text-primary"
                : "hover:text-primary hover:cursor-pointer"
            }`}
          >
            {page}
          </button>
        );
      })}

      {/* ➡️ 下一頁 */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="disabled:opacity-40 disabled:cursor-not-allowed
        hover:text-primary hover:cursor-pointer transition"
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;
