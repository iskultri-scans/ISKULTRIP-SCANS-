'use client';

import React from 'react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { MangaDetail } from '@/components/manga/MangaDetail';
import type { Manga } from '@/lib/firestore';

interface MangaDetailClientProps {
  /** Server-fetched manga data — no duplicate fetch on client */
  manga: Manga;
  genreSlugs: { name: string; slug: string }[];
}

export function MangaDetailClient({ manga, genreSlugs }: MangaDetailClientProps) {
  // 🔒 Adult content gate: in Family Mode, show a restricted-access screen
  // instead of the manga content. Server already filters list pages,
  // but if a user lands on a direct URL of an adult manga while in Family Mode,
  // they need to enable Adult Mode first.
  if (manga.isAdult) {
    return (
      <PublicLayout genres={genreSlugs}>
        <AdultContentGate mangaTitle={manga.title} mangaTitleBn={manga.titleBn} />
      </PublicLayout>
    );
  }

  return (
    <PublicLayout genres={genreSlugs}>
      <div className="pb-12">
        <MangaDetail manga={manga} />
      </div>
    </PublicLayout>
  );
}

// ─── Adult Content Gate ────────────────────────────────────────────
// Shown when a Family-Mode user lands on a 18+ manga's direct URL.

function AdultContentGate({
  mangaTitle,
  mangaTitleBn,
}: {
  mangaTitle: string;
  mangaTitleBn?: string;
}) {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <div
        className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
        style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '2px solid rgba(239, 68, 68, 0.3)',
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ef4444"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      </div>

      <h1 className="font-['Bebas_Neue'] text-3xl tracking-wide text-[var(--text-primary)] mb-2">
        ১৮+ কনটেন্ট
      </h1>
      <p className="text-sm text-[var(--text-secondary)] mb-1">
        <strong className="text-[var(--text-primary)]">{mangaTitle}</strong>
        {mangaTitleBn && (
          <>
            {' '}({mangaTitleBn})
          </>
        )}
      </p>
      <p className="text-sm text-[var(--text-muted)] mb-6 leading-relaxed">
        এই মাঙ্গাটি Adult হিসেবে চিহ্নিত। দেখতে হলে Adult Mode চালু করুন।
        উপরে Navbar-এ Content Mode toggle থেকে Adult Mode নির্বাচন করুন।
      </p>

      <a
        href="/"
        className="btn-accent inline-block text-xs sm:text-sm px-4 py-2 sm:px-7 sm:py-3"
      >
        ← হোম পেজে ফিরে যান
      </a>
    </div>
  );
}
