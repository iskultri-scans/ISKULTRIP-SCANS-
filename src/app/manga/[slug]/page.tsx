'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { MangaDetail } from '@/components/manga/MangaDetail';
import { HeroSkeleton } from '@/components/ui/Skeleton';
import { getMangaBySlug, getAllGenres, type Manga, type Genre } from '@/lib/firestore';

export const revalidate = 3600;

export default function MangaDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [manga, setManga] = useState<Manga | null>(null);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [mangaData, genresData] = await Promise.all([
          getMangaBySlug(slug),
          getAllGenres(),
        ]);
        setManga(mangaData);
        setGenres(genresData);
      } catch (error) {
        console.error('Error fetching manga:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [slug]);

  const genreSlugs = genres.map((g) => ({ name: g.name, slug: g.slug }));

  if (loading) {
    return (
      <PublicLayout genres={genreSlugs}>
        <HeroSkeleton />
      </PublicLayout>
    );
  }

  if (!manga) {
    return (
      <PublicLayout genres={genreSlugs}>
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="font-['Bebas_Neue'] text-4xl text-[var(--text-primary)] mb-4">Manga Not Found</h1>
          <p className="text-[var(--text-secondary)]">The manga you are looking for does not exist.</p>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout genres={genreSlugs}>
      <div className="pb-12">
        <MangaDetail manga={manga} />
      </div>
    </PublicLayout>
  );
}
