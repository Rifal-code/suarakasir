"use client";

import React from "react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  // Logic to show limited page numbers (e.g. 1 2 3 ... 10)
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-between w-full mt-6 pt-6 border-t border-border-soft">
      <div className="text-sm font-medium text-text-secondary hidden sm:block">
        Menampilkan halaman <span className="font-bold text-text-primary">{currentPage}</span> dari <span className="font-bold text-text-primary">{totalPages}</span>
      </div>

      <div className="flex items-center gap-1.5 w-full sm:w-auto justify-center sm:justify-end">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center justify-center w-10 h-10 rounded-full border border-border-default text-text-secondary hover:bg-background hover:text-primary disabled:opacity-50 disabled:pointer-events-none transition-colors"
          aria-label="Previous page"
        >
          <span className="material-symbols-outlined text-[18px]">chevron_left</span>
        </button>

        <div className="flex items-center gap-1 mx-2">
          {getPageNumbers().map((page, idx) => (
            <React.Fragment key={idx}>
              {page === "..." ? (
                <span className="px-2 text-text-muted">...</span>
              ) : (
                <button
                  onClick={() => onPageChange(page as number)}
                  className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold transition-colors ${
                    currentPage === page
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "text-text-secondary hover:bg-background hover:text-primary"
                  }`}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center justify-center w-10 h-10 rounded-full border border-border-default text-text-secondary hover:bg-background hover:text-primary disabled:opacity-50 disabled:pointer-events-none transition-colors"
          aria-label="Next page"
        >
          <span className="material-symbols-outlined text-[18px]">chevron_right</span>
        </button>
      </div>
    </div>
  );
}
