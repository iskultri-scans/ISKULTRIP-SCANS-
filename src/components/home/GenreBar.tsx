'use client';

import React from 'react';
import Link from 'next/link';

interface GenreBarProps {
  genres: { name: string; slug: string }[];
}

export function GenreBar({ genres }: GenreBarProps) {
  if (genres.length === 0) return null;

  return (
    <section className="py-8">
      <h2 className="font-['Bebas_Neue'] text-2xl tracking-wide text-[var(--text-primary)] mb-4">
        Browse by Genre
      </h2>
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
        {genres.map((genre) => (
          <Link
            key={genre.slug}
            href={`/genre/${genre.slug}`}
            className="genre-chip flex-shrink-0"
          >
            {genre.name}
          </Link>
        ))}
      </div>
    </section>
  );
}
