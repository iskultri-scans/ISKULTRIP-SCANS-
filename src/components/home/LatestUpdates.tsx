'use client';

import React from 'react';
import { Clock } from 'lucide-react';
import { MangaGrid } from '@/components/manga/MangaGrid';
import { formatRelativeTime } from '@/lib/utils';
import type { Manga } from '@/lib/firestore';

interface LatestUpdatesProps {
  manga: Manga[];
  loading?: boolean;
}

export function LatestUpdates({ manga, loading = false }: LatestUpdatesProps) {
  return (
    <section className="py-8">
      <div className="flex items-center gap-3 mb-6">
        <Clock size={24} className="text-[var(--accent)]" />
        <h2 className="font-['Bebas_Neue'] text-2xl tracking-wide text-[var(--text-primary)]">
          Latest Updates
        </h2>
      </div>

      {loading ? (
        <MangaGrid manga={[]} loading={true} />
      ) : manga.length === 0 ? (
        <MangaGrid manga={[]} emptyTitle="No recent updates" />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {manga.map((m, i) => (
            <div key={m.id} className="manga-card" style={{ animationDelay: `${i * 50}ms` }}>
              <a href={`/manga/${m.slug}`} className="block rounded-xl overflow-hidden relative" style={{ background: 'var(--bg-card)' }}>
                <div className="manga-card-inner">
                  {/* Cover */}
                  <div className="relative" style={{ aspectRatio: '3/4' }}>
                    <img
                      src={m.coverImage || '/no-cover.png'}
                      alt={m.title}
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = '/no-cover.png'; }}
                    />
                    <div className="manga-card-overlay absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">View Details →</span>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-semibold text-[var(--text-primary)] line-clamp-2 leading-tight mb-1">{m.title}</h3>
                    <p className="text-xs text-[var(--accent)]">{formatRelativeTime(m.createdAt)}</p>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
