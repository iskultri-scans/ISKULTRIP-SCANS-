'use client';

import React from 'react';
import Image from 'next/image';
import { Star, BookOpen, User, Palette, Hash } from 'lucide-react';
import { LanguageBadge } from './LanguageBadge';
import { GenreTags } from './GenreTags';
import { ReadNowButton } from './ReadNowButton';
import { ShareButtons } from './ShareButtons';
import type { Manga } from '@/lib/firestore';

interface MangaDetailProps {
  manga: Manga;
}

export function MangaDetail({ manga }: MangaDetailProps) {
  return (
    <div>
      {/* Banner Image */}
      <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden">
        <Image
          src={manga.bannerImage || manga.coverImage || '/no-cover.png'}
          alt={manga.title}
          fill
          className="object-cover"
          unoptimized={true}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)]/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Cover */}
          <div className="flex-shrink-0">
            <div className="relative w-48 md:w-56 rounded-xl overflow-hidden shadow-2xl" style={{ aspectRatio: '3/4' }}>
              <Image
                src={manga.coverImage || '/no-cover.png'}
                alt={manga.title}
                fill
                className="object-cover"
                unoptimized={true}
                priority
              />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 pt-2 md:pt-8">
            <div className="flex items-start gap-3 mb-2">
              <h1 className="font-['Bebas_Neue'] text-3xl md:text-4xl tracking-wide text-[var(--text-primary)]">
                {manga.title}
              </h1>
              <LanguageBadge language={manga.language} />
            </div>

            {manga.titleBn && (
              <p className="text-lg text-[var(--text-secondary)] mb-3">{manga.titleBn}</p>
            )}

            {/* Stats Row */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="flex items-center gap-1">
                <Star size={18} className="text-yellow-400 fill-yellow-400" />
                <span className="font-bold text-[var(--text-primary)]">{manga.rating}</span>
              </div>
              <span className="text-[var(--text-muted)]">·</span>
              <span className={`text-sm font-medium capitalize ${
                manga.status === 'ongoing' ? 'text-emerald-400' :
                manga.status === 'completed' ? 'text-blue-400' : 'text-amber-400'
              }`}>
                {manga.status}
              </span>
            </div>

            {/* Meta */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
              {manga.author && (
                <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                  <User size={14} className="text-[var(--accent)]" />
                  <span>Author: {manga.author}</span>
                </div>
              )}
              {manga.artist && (
                <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                  <Palette size={14} className="text-[var(--accent)]" />
                  <span>Artist: {manga.artist}</span>
                </div>
              )}
              {manga.totalChapters > 0 && (
                <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                  <BookOpen size={14} className="text-[var(--accent)]" />
                  <span>Chapters: {manga.totalChapters}</span>
                </div>
              )}
            </div>

            {/* Genres */}
            <GenreTags genres={manga.genres} />
          </div>
        </div>

        {/* Description */}
        <div className="mt-8">
          <h2 className="font-['Bebas_Neue'] text-xl tracking-wide text-[var(--text-primary)] mb-3">Synopsis</h2>
          <p className="text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
            {manga.description || 'No description available.'}
          </p>
        </div>

        {/* Read Now */}
        <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <ReadNowButton readLink={manga.readLink} />
          <ShareButtons title={manga.title} slug={manga.slug} />
        </div>
      </div>
    </div>
  );
}
