'use client';

import React from 'react';
import { MangaGrid } from '@/components/manga/MangaGrid';
import type { Manga } from '@/lib/firestore';

interface LanguageSectionProps {
  enManga: Manga[];
  bnManga: Manga[];
  loading?: boolean;
}

export function LanguageSection({ enManga, bnManga, loading = false }: LanguageSectionProps) {
  return (
    <div className="space-y-12 py-4">
      {/* English Manga */}
      <section>
        <h2 className="font-['Bebas_Neue'] text-2xl tracking-wide text-[var(--text-primary)] mb-6">
          English Manga
        </h2>
        <MangaGrid manga={enManga} loading={loading} emptyTitle="No English manga yet" />
      </section>

      {/* Bengali Manga */}
      <section>
        <h2 className="font-['Bebas_Neue'] text-2xl tracking-wide text-[var(--text-primary)] mb-6">
          বাংলা মাঙ্গা
        </h2>
        <MangaGrid manga={bnManga} loading={loading} emptyTitle="No Bengali manga yet" />
      </section>
    </div>
  );
}
