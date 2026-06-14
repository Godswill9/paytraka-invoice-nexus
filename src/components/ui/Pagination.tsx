"use client";

import { Pagination as PaginationMeta } from "@/types/api";

export function Pagination({ pagination, onPageChange }: { pagination?: PaginationMeta; onPageChange: (page: number) => void }) {
  if (!pagination || pagination.totalPages <= 1) return null;

  const pages = Array.from({ length: pagination.totalPages }, (_, index) => index + 1).filter((page) => {
    return page === 1 || page === pagination.totalPages || Math.abs(page - pagination.page) <= 1;
  });

  return (
    <nav className="flex flex-wrap items-center gap-2" aria-label="Pagination">
      <button type="button" disabled={pagination.page <= 1} onClick={() => onPageChange(pagination.page - 1)} className="rounded-lg border border-[#C5C4DA] bg-white px-3 py-2 text-sm font-bold text-[#454557] disabled:cursor-not-allowed disabled:opacity-50">
        Previous
      </button>
      {pages.map((page, index) => {
        const previous = pages[index - 1];
        return (
          <span key={page} className="flex items-center gap-2">
            {previous && page - previous > 1 ? <span className="text-[#757588]">...</span> : null}
            <button type="button" onClick={() => onPageChange(page)} aria-current={page === pagination.page ? "page" : undefined} className={`rounded-lg px-3 py-2 text-sm font-bold ${page === pagination.page ? "bg-[#1117E8] text-white" : "border border-[#C5C4DA] bg-white text-[#454557]"}`}>
              {page}
            </button>
          </span>
        );
      })}
      <button type="button" disabled={pagination.page >= pagination.totalPages} onClick={() => onPageChange(pagination.page + 1)} className="rounded-lg border border-[#C5C4DA] bg-white px-3 py-2 text-sm font-bold text-[#454557] disabled:cursor-not-allowed disabled:opacity-50">
        Next
      </button>
    </nav>
  );
}
