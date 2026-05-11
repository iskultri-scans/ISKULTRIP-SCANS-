'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Home, Search } from 'lucide-react';
import { getAllGenres, type Genre } from '@/lib/firestore';
import { PublicLayout } from '@/components/layout/PublicLayout';

export default function NotFound() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const genreSlugs = genres.map((g) => ({ name: g.name, slug: g.slug }));

  useEffect(() => {
    getAllGenres().then(setGenres);
  }, []);

  return (
    <PublicLayout genres={genreSlugs}>
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        {/* ASCII Art */}
        <pre className="text-[var(--accent)] text-xs sm:text-sm mb-8 font-mono leading-tight select-none">
{`
 ██╗  ██╗ ██████╗ ██╗  ██╗
 ██║  ██║██╔═══██╗╚██╗██╔╝
 ███████║██║   ██║ ╚███╔╝ 
 ██╔══██║██║   ██║ ██╔██╗ 
 ██║  ██║╚██████╔╝██╔╝ ██╗
 ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝
`}
        </pre>

        <h1 className="font-['Bebas_Neue'] text-6xl sm:text-8xl tracking-wider text-[var(--text-primary)] mb-4">
          404
        </h1>

        <p className="text-xl text-[var(--text-secondary)] mb-2">
          Page Not Found
        </p>

        <p className="text-sm text-[var(--text-muted)] mb-8 max-w-md mx-auto">
          Looks like this page got lost in the manga universe. Maybe it was isekai&apos;d to another world?
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link href="/" className="btn-accent flex items-center gap-2 text-sm">
            <Home size={16} /> Back Home
          </Link>
          <Link
            href="/search"
            className="px-6 py-3 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--accent)] transition-all"
            style={{ border: '1px solid var(--border-color)' }}
          >
            <Search size={16} className="inline mr-2" />
            Search Manga
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}
