'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { LanguageBadge } from './LanguageBadge';
import type { Manga } from '@/lib/firestore';

interface MangaCardProps {
  manga: Manga;
  index?: number;
  showRank?: boolean;
  rank?: number;
}

export function MangaCard({ manga, index = 0, showRank = false, rank }: MangaCardProps) {
  return (
    <div
      className="manga-card group cursor-pointer"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <Link href={`/manga/${manga.slug}`}>
        <div className="manga-card-inner rounded-xl overflow-hidden relative" style={{ background: 'var(--bg-card)' }}>
          {/* Language Badge */}
          <div className="absolute top-2 left-2 z-10">
            <LanguageBadge language={manga.language} />
          </div>

          {/* Rank Badge */}
          {showRank && rank && (
            <div
              className="absolute top-2 right-2 z-10 w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold"
              style={{
                background: rank <= 3 ? 'var(--accent)' : 'var(--glass-bg)',
                color: rank <= 3 ? '#0a0a0f' : 'var(--text-primary)',
                border: rank > 3 ? '1px solid var(--border-color)' : 'none',
              }}
            >
              {rank}
            </div>
          )}

          {/* Cover Image */}
          <div className="relative" style={{ aspectRatio: '3/4' }}>
            <Image
              src={manga.coverImage || '/no-cover.png'}
              alt={manga.title}
              fill
              className="object-cover"
              unoptimized={true}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/no-cover.png';
              }}
            />

            {/* Hover Overlay */}
            <div className="manga-card-overlay absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white font-semibold text-sm tracking-wide flex items-center gap-1">
                View Details →
              </span>
            </div>
          </div>

          {/* Card Info */}
          <div className="p-3">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] line-clamp-2 leading-tight mb-1">
              {manga.title}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] mb-0.5">
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
              <span>{manga.rating}</span>
              {manga.genres.length > 0 && (
                <>
                  <span>·</span>
                  <span className="truncate">{manga.genres[0]}</span>
                </>
              )}
            </div>
            <div className="text-xs text-[var(--text-muted)]">
              Ch. {manga.totalChapters} · {manga.status.charAt(0).toUpperCase() + manga.status.slice(1)}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
