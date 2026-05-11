'use client';

import React, { useEffect, useState } from 'react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { HeroBanner } from '@/components/home/HeroBanner';
import { TrendingSection } from '@/components/home/TrendingSection';
import { LatestUpdates } from '@/components/home/LatestUpdates';
import { GenreBar } from '@/components/home/GenreBar';
import { LanguageSection } from '@/components/home/LanguageSection';
import {
  getAllGenres,
  getFeaturedManga,
  getTrendingManga,
  getLatestManga,
  getMangaByLanguage,
  type Manga,
  type Genre,
} from '@/lib/firestore';

export default function HomePage() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [featured, setFeatured] = useState<Manga[]>([]);
  const [trending, setTrending] = useState<Manga[]>([]);
  const [latest, setLatest] = useState<Manga[]>([]);
  const [enManga, setEnManga] = useState<Manga[]>([]);
  const [bnManga, setBnManga] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [genresData, featuredData, trendingData, latestData, enData, bnData] = await Promise.all([
          getAllGenres(),
          getFeaturedManga(),
          getTrendingManga(),
          getLatestManga(10),
          getMangaByLanguage('en', 10),
          getMangaByLanguage('bn', 10),
        ]);
        setGenres(genresData);
        setFeatured(featuredData);
        setTrending(trendingData);
        setLatest(latestData);
        setEnManga(enData);
        setBnManga(bnData);
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const genreSlugs = genres.map((g) => ({ name: g.name, slug: g.slug }));

  return (
    <PublicLayout genres={genreSlugs}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Hero Banner */}
        <HeroBanner manga={featured} loading={loading} />

        {/* Trending */}
        <TrendingSection manga={trending} loading={loading} />

        {/* Latest Updates */}
        <LatestUpdates manga={latest} loading={loading} />

        {/* Genre Bar */}
        <GenreBar genres={genreSlugs} />

        {/* Language Sections */}
        <LanguageSection enManga={enManga} bnManga={bnManga} loading={loading} />
      </div>
    </PublicLayout>
  );
}
