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
        <h2 className="font-['Bebas_Neue'] text-2xl tracking-wide text-[var(--text-primary)] mb-6">
          বাংলা মাঙ্গা
        </h2>
        <MangaGrid manga={bnManga} loading={loading} emptyTitle="No Bengali manga yet" />
      </section>
    </div>
  );
}
