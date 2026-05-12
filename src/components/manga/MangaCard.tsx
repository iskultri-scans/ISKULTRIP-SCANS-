'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { LanguageBadge } from './LanguageBadge';
import { BookmarkButton } from './BookmarkButton';
import { useBookmarks } from '@/context/BookmarkContext';
import type { Manga } from '@/lib/firestore';

interface MangaCardProps {
  manga: Manga;
  index?: number;
  showRank?: boolean;
  rank?: number;
}

export function MangaCard({ manga, index = 0, showRank = false, rank }: MangaCardProps) {
  const { isBookmarked, toggleBookmark } = useBookmarks();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group cursor-pointer"
    >
      <div className="rounded-xl overflow-hidden relative" style={{ background: 'var(--bg-card)' }}>
        {/* Hover glow effect */}
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ boxShadow: '0 0 30px var(--accent-glow-strong), inset 0 0 30px var(--accent-glow)' }}
        />

        <Link href={`/manga/${manga.slug}`}>
          <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
            className="manga-card-inner"
          >
            {/* Language Badge */}
            <div className="absolute top-2 left-2 z-10">
              <LanguageBadge language={manga.language} />
            </div>

            {/* Rank Badge - moved to avoid bookmark overlap */}
            {showRank && rank && (
              <div
                className="absolute top-2 left-14 z-10 w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold"
                style={{
                  background: rank <= 3 ? 'var(--accent)' : 'var(--glass-bg)',
                  color: rank <= 3 ? '#0a0a0f' : 'var(--text-primary)',
                  border: rank > 3 ? '1px solid var(--border-color)' : 'none',
                  boxShadow: rank <= 3 ? '0 0 10px var(--accent-glow)' : 'none',
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
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute inset-0 bg-black/60 flex items-center justify-center"
              >
                <motion.span
                  initial={{ y: 10, opacity: 0 }}
                  whileHover={{ y: 0, opacity: 1 }}
                  className="text-white font-semibold text-sm tracking-wide flex items-center gap-1"
                >
                  View Details →
                </motion.span>
              </motion.div>
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
          </motion.div>
        </Link>

        {/* Bookmark Button - outside Link to preserve its own click handler */}
        <BookmarkButton
          manga={manga}
          isBookmarked={isBookmarked(manga.id)}
          onToggle={toggleBookmark}
          variant="overlay"
          size={16}
        />
      </div>
    </motion.div>
  );
}
