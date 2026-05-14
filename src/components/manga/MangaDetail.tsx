'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, BookOpen, User, Palette, Calendar } from 'lucide-react';
import { LanguageBadge } from './LanguageBadge';
import { GenreTags } from './GenreTags';
import { ReadNowButton } from './ReadNowButton';
import { ShareButtons } from './ShareButtons';
import { ChapterList } from './ChapterList';
import { BookmarkButton } from './BookmarkButton';
import { useBookmarks } from '@/context/BookmarkContext';
import { formatRelativeTime } from '@/lib/utils';
import type { Manga } from '@/lib/firestore';

interface MangaDetailProps {
  manga: Manga;
}

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export function MangaDetail({ manga }: MangaDetailProps) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = isBookmarked(manga.id);

  return (
    <div>
      {/* Banner Image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative w-full h-[300px] md:h-[400px] overflow-hidden"
      >
        <Image
          src={manga.bannerImage || manga.coverImage || '/no-cover.png'}
          alt={manga.title}
          fill
          className="object-cover"
          unoptimized={true}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-primary)]/80 to-transparent" />
      </motion.div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 -mt-32 sm:-mt-32 relative z-10">
        <div className="flex flex-col items-center md:items-start md:flex-row gap-6">
          {/* Cover */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex-shrink-0"
          >
            <div className="relative w-40 sm:w-48 md:w-56 rounded-xl overflow-hidden shadow-2xl group" style={{ aspectRatio: '3/4' }}>
              <Image
                src={manga.coverImage || '/no-cover.png'}
                alt={manga.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                unoptimized={true}
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </motion.div>

          {/* Info */}
          <motion.div
            variants={fadeUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex-1 pt-2 md:pt-8 text-center md:text-left"
          >
            <div className="flex items-start justify-center md:justify-start gap-3 mb-2">
              <h1 className="font-['Bebas_Neue'] text-2xl sm:text-3xl md:text-4xl tracking-wide text-[var(--text-primary)]">
                {manga.title}
              </h1>
              <LanguageBadge language={manga.language} />
            </div>

            {manga.titleBn && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-base sm:text-lg text-[var(--text-secondary)] mb-3"
              >
                {manga.titleBn}
              </motion.p>
            )}

            {/* Stats Row */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-3 mb-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                style={{ background: 'var(--accent-glow)' }}
              >
                <Star size={16} className="text-yellow-400 fill-yellow-400" />
                <span className="font-bold text-sm text-[var(--text-primary)]">{manga.rating}</span>
              </motion.div>
              <span className={`text-sm font-semibold capitalize px-3 py-1.5 rounded-lg ${
                manga.status === 'ongoing' ? 'text-emerald-400 bg-emerald-400/10' :
                manga.status === 'completed' ? 'text-blue-400 bg-blue-400/10' : 'text-amber-400 bg-amber-400/10'
              }`}>
                {manga.status}
              </span>
              {manga.updatedAt && (
                <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                  <Calendar size={12} />
                  Updated {formatRelativeTime(manga.updatedAt)}
                </span>
              )}
            </div>

            {/* Meta */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
              {manga.author && (
                <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                  <User size={14} className="text-[var(--accent)]" />
                  <span>Author: <strong>{manga.author}</strong></span>
                </div>
              )}
              {manga.artist && (
                <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                  <Palette size={14} className="text-[var(--accent)]" />
                  <span>Artist: <strong>{manga.artist}</strong></span>
                </div>
              )}
              {manga.totalChapters > 0 && (
                <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                  <BookOpen size={14} className="text-[var(--accent)]" />
                  <span>Chapters: <strong>{manga.totalChapters}</strong></span>
                </div>
              )}
            </div>

            {/* Genres */}
            <GenreTags genres={manga.genres} />
          </motion.div>
        </div>

        {/* Description */}
        <motion.div
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8"
        >
          <h2 className="font-['Bebas_Neue'] text-xl tracking-wide text-[var(--text-primary)] mb-3">Synopsis</h2>
          <div
            className="glass-card p-5 text-[var(--text-secondary)] leading-relaxed whitespace-pre-line"
          >
            {manga.description || 'No description available.'}
          </div>
        </motion.div>

        {/* Read Now + Bookmark + Share */}
        <motion.div
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4"
        >
          <ReadNowButton readLink={manga.readLink} />
          <BookmarkButton
            manga={manga}
            isBookmarked={bookmarked}
            onToggle={toggleBookmark}
            variant="button"
            size={18}
            showLabel={true}
          />
          <ShareButtons
            title={manga.title}
            slug={manga.slug}
            description={manga.description}
            coverImage={manga.coverImage}
          />
        </motion.div>

        {/* Chapter List */}
        {manga.chapters && manga.chapters.length > 0 && (
          <ChapterList chapters={manga.chapters} mangaTitle={manga.title} />
        )}

        {/* Empty chapter state with CTA */}
        {(!manga.chapters || manga.chapters.length === 0) && manga.readLink && (
          <motion.div
            variants={fadeUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8"
          >
            <div className="glass-card p-6 text-center">
              <BookOpen size={32} className="mx-auto mb-3 text-[var(--accent)]" />
              <p className="text-[var(--text-secondary)] mb-3">
                Chapters are available on the reading platform.
              </p>
              <button
                onClick={() => window.open(manga.readLink, '_blank', 'noopener,noreferrer')}
                className="btn-accent inline-flex items-center gap-2 text-sm"
              >
                <BookOpen size={16} />
                Read on External Site
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
