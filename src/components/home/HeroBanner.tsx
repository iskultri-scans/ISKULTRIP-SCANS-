'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { HeroSkeleton } from '@/components/ui/Skeleton';
import type { Manga } from '@/lib/firestore';

interface HeroBannerProps {
  manga: Manga[];
  loading?: boolean;
}

export function HeroBanner({ manga, loading = false }: HeroBannerProps) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % manga.length);
  }, [manga.length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + manga.length) % manga.length);
  }, [manga.length]);

  useEffect(() => {
    if (paused || manga.length === 0) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [paused, next, manga.length]);

  if (loading) return <HeroSkeleton />;
  if (manga.length === 0) return null;

  return (
    <div
      className="relative w-full h-[260px] sm:h-[350px] md:h-[450px] lg:h-[500px] overflow-hidden rounded-xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {manga.map((m, i) => (
        <div
          key={m.id}
          className={`hero-slide ${i === current ? 'active' : ''}`}
        >
          <Image
            src={m.bannerImage || m.coverImage || '/no-cover.png'}
            alt={m.title}
            fill
            className="object-cover"
            unoptimized={true}
            priority={i === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-primary)] via-[var(--bg-primary)]/70 to-transparent hidden sm:block" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)]/50 to-[var(--bg-primary)]/30 sm:hidden" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-6 md:p-10 sm:max-w-3xl">
            {/* Bengali badge */}
            <div className="inline-block mb-1.5 sm:mb-2 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md text-[9px] sm:text-[10px] font-bold uppercase tracking-wide"
              style={{ background: 'var(--accent-glow)', color: 'var(--accent)', border: '1px solid var(--accent)' }}
            >
              বাংলায় পড়ুন
            </div>

            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-1.5 sm:mb-3">
              {m.genres.slice(0, 2).map((g) => (
                <span key={g} className="genre-chip text-[10px] sm:text-xs px-2 py-0.5 sm:px-3 sm:py-1">{g}</span>
              ))}
            </div>
            <h2 className="font-['Bebas_Neue'] text-xl sm:text-3xl md:text-5xl tracking-wide text-[var(--text-primary)] mb-0.5 sm:mb-1 line-clamp-2">
              {m.title}
            </h2>
            {m.titleBn && (
              <p className="text-xs sm:text-base md:text-lg text-[var(--accent)] mb-1 sm:mb-2 font-medium line-clamp-1">{m.titleBn}</p>
            )}
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-3">
              <Star size={12} className="text-yellow-400 fill-yellow-400 sm:!w-4 sm:!h-4" />
              <span className="text-[11px] sm:text-sm font-semibold text-[var(--text-primary)]">{m.rating}</span>
              <span className="text-[10px] sm:text-xs text-[var(--text-muted)]">· {m.totalChapters} ch · {m.language === 'bn' ? 'বাংলা' : 'EN'}</span>
            </div>
            <p className="hidden sm:block text-sm text-[var(--text-secondary)] line-clamp-2 mb-4 max-w-lg">
              {m.description}
            </p>
            <Link
              href={`/manga/${m.slug}`}
              className="btn-accent inline-block text-xs sm:text-sm px-4 py-2 sm:px-7 sm:py-3"
            >
              বিস্তারিত দেখুন
            </Link>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prev}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-all backdrop-blur-sm z-10"
        aria-label="Previous slide"
      >
        <ChevronLeft size={16} className="sm:!w-5 sm:!h-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-all backdrop-blur-sm z-10"
        aria-label="Next slide"
      >
        <ChevronRight size={16} className="sm:!w-5 sm:!h-5" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-2 sm:bottom-4 right-3 sm:right-6 flex gap-1.5 sm:gap-2 z-10">
        {manga.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all ${
              i === current ? 'bg-[var(--accent)] w-4 sm:w-6' : 'bg-white/30 hover:bg-white/50'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
