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
      className="relative w-full h-[400px] sm:h-[450px] md:h-[500px] overflow-hidden"
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
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-primary)] via-[var(--bg-primary)]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 max-w-3xl">
            <div className="flex flex-wrap gap-2 mb-3">
              {m.genres.slice(0, 3).map((g) => (
                <span key={g} className="genre-chip text-xs">{g}</span>
              ))}
            </div>
            <h2 className="font-['Bebas_Neue'] text-3xl md:text-5xl tracking-wide text-[var(--text-primary)] mb-2">
              {m.title}
            </h2>
            <div className="flex items-center gap-2 mb-3">
              <Star size={16} className="text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-semibold text-[var(--text-primary)]">{m.rating}</span>
            </div>
            <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-4 max-w-lg">
              {m.description}
            </p>
            <Link
              href={`/manga/${m.slug}`}
              className="btn-accent inline-block text-sm"
            >
              View Details
            </Link>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-all backdrop-blur-sm z-10"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-all backdrop-blur-sm z-10"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-4 right-6 flex gap-2 z-10">
        {manga.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-all ${
              i === current ? 'bg-[var(--accent)] w-6' : 'bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
