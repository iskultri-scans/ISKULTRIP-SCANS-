'use client';

import React from 'react';
import { MangaGrid } from '@/components/manga/MangaGrid';
import type { Manga } from '@/lib/firestore';

interface LanguageSectionProps {
  bnManga: Manga[];
  loading?: boolean;
}

export function LanguageSection({ bnManga, loading = false }: LanguageSectionProps) {
  return (
    <div className="py-4">
      <section>
        <div className="flex items-center gap-3 mb-6">
          <h2 className="font-['Bebas_Neue'] text-2xl tracking-wide text-[var(--text-primary)]">
            বাংলা মাঙ্গা
          </h2>
          <span className="text-sm text-[var(--text-muted)]">— Bengali Manga</span>
        </div>
        <MangaGrid manga={bnManga} loading={loading} emptyTitle="এখনো বাংলা মাঙ্গা নেই / No Bengali manga yet" />
      </section>
    </div>
  );
}
