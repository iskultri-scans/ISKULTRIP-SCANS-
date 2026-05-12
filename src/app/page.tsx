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
import { SITE_CONFIG } from '@/lib/config';
import { Facebook, Send } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HomePage() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [featured, setFeatured] = useState<Manga[]>([]);
  const [trending, setTrending] = useState<Manga[]>([]);
  const [latest, setLatest] = useState<Manga[]>([]);
  const [bnManga, setBnManga] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [genresData, featuredData, trendingData, latestData, bnData] = await Promise.all([
          getAllGenres(),
          getFeaturedManga(),
          getTrendingManga(),
          getLatestManga(10),
          getMangaByLanguage('bn', 10),
        ]);
        setGenres(genresData);
        setFeatured(featuredData);
        setTrending(trendingData);
        setLatest(latestData);
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

        {/* Join Community Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="py-10"
        >
          <div
            className="rounded-2xl p-8 md:p-10 text-center relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.08), rgba(0, 136, 204, 0.05))',
              border: '1px solid var(--border-color)',
              boxShadow: '0 0 60px var(--accent-glow)',
            }}
          >
            {/* Background glow */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
              style={{ background: 'var(--accent)' }}
            />

            <div className="relative z-10">
              <h2 className="font-['Bebas_Neue'] text-3xl md:text-4xl tracking-wide text-[var(--text-primary)] mb-3">
                Join Our Community
              </h2>
              <p className="text-[var(--text-secondary)] text-sm md:text-base max-w-lg mx-auto mb-6">
                Stay updated with the latest manga releases, join discussions, and connect with fellow manga enthusiasts!
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <motion.a
                  href={SITE_CONFIG.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-3 px-6 py-3.5 rounded-xl text-sm font-bold transition-all duration-200"
                  style={{
                    background: 'linear-gradient(135deg, #1877F2, #0d5bbd)',
                    color: '#ffffff',
                    boxShadow: '0 4px 20px rgba(24, 119, 242, 0.4)',
                  }}
                >
                  <Facebook size={20} />
                  Join Facebook Group
                </motion.a>
                <motion.a
                  href={SITE_CONFIG.social.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-3 px-6 py-3.5 rounded-xl text-sm font-bold transition-all duration-200"
                  style={{
                    background: 'linear-gradient(135deg, #0088cc, #006699)',
                    color: '#ffffff',
                    boxShadow: '0 4px 20px rgba(0, 136, 204, 0.4)',
                  }}
                >
                  <Send size={20} />
                  Join Telegram Channel
                </motion.a>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Language Sections */}
        <LanguageSection bnManga={bnManga} loading={loading} />
      </div>
    </PublicLayout>
  );
}
