'use client';

import React from 'react';
import { TrendingUp } from 'lucide-react';
import { MangaGrid } from '@/components/manga/MangaGrid';
import type { Manga } from '@/lib/firestore';

interface TrendingSectionProps {
  manga: Manga[];
  loading?: boolean;
}

export function TrendingSection({ manga, loading = false }: TrendingSectionProps) {
  return (
    <section className="py-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">🔥</span>
        <h2 className="font-['Bebas_Neue'] text-2xl tracking-wide text-[var(--text-primary)]">
          Trending Now
        </h2>
      </div>
      <MangaGrid manga={manga} loading={loading} showRank emptyTitle="No trending manga yet" />
    </section>
  );
}
