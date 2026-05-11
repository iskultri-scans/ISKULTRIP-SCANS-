'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hasNext: boolean;
  hasPrev: boolean;
}

export function Pagination({ currentPage, totalPages, onPageChange, hasNext, hasPrev }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrev}
        className={cn(
          'flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all',
          hasPrev
            ? 'text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--accent-glow)]'
            : 'text-[var(--text-muted)] cursor-not-allowed'
        )}
      >
        <ChevronLeft size={16} />
        Prev
      </button>

      {getPages().map((page, idx) =>
        typeof page === 'string' ? (
          <span key={`dots-${idx}`} className="px-2 text-[var(--text-muted)]">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={cn(
              'w-9 h-9 rounded-lg text-sm font-medium transition-all',
              page === currentPage
                ? 'bg-[var(--accent)] text-[#0a0a0f]'
                : 'text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--accent-glow)]'
            )}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNext}
        className={cn(
          'flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all',
          hasNext
            ? 'text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--accent-glow)]'
            : 'text-[var(--text-muted)] cursor-not-allowed'
        )}
      >
        Next
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
