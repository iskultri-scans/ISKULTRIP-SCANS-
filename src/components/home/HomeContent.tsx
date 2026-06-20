'use client';

/**
 * HomeContent — Client component for the home page
 *
 * Server থেকে data prop হিসেবে পায়, তারপর ContentModeContext দিয়ে client-side filter করে।
 * Adult mode user-দের জন্য client re-filters with adult content.
 */

import React, { useMemo } from 'react';
import { HeroBanner } from '@/components/home/HeroBanner';
import { TrendingSection } from '@/components/home/TrendingSection';
import { LatestUpdates } from '@/components/home/LatestUpdates';
import { GenreBar } from '@/components/home/GenreBar';
import { LanguageSection } from '@/components/home/LanguageSection';
import { WelcomeSection } from '@/components/home/WelcomeSection';
import { AnnouncementBar } from '@/components/home/AnnouncementBar';
import { UpcomingSection } from '@/components/home/UpcomingSection';
import { useContentMode } from '@/context/ContentModeContext';
import { SITE_CONFIG } from '@/lib/config';
import { Facebook, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Manga, Genre, Announcement, UpcomingRelease } from '@/lib/firestore';

interface HomeContentProps {
  genres: Genre[];
  featured: Manga[];
  trending: Manga[];
  latest: Manga[];
  bnManga: Manga[];
  announcements: Announcement[];
  upcoming: UpcomingRelease[];
  genreSlugs: { name: string; slug: string }[];
}

export function HomeContent({
  genres,
  featured,
  trending,
  latest,
  bnManga,
  announcements,
  upcoming,
  genreSlugs,
}: HomeContentProps) {
  const { filterByMode } = useContentMode();

  // Client-side re-filter for Adult Mode users
  const visibleFeatured = useMemo(() => filterByMode(featured), [filterByMode, featured]);
  const visibleTrending = useMemo(() => filterByMode(trending), [filterByMode, trending]);
  const visibleLatest = useMemo(() => filterByMode(latest), [filterByMode, latest]);
  const visibleBnManga = useMemo(() => filterByMode(bnManga), [filterByMode, bnManga]);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 overflow-x-hidden">
      {/* Welcome Section - Bengali Hero */}
      <WelcomeSection />

      {/* Announcement Bar */}
      <AnnouncementBar announcements={announcements} loading={false} />

      {/* Hero Banner */}
      <HeroBanner manga={visibleFeatured} loading={false} />

      {/* Trending */}
      <TrendingSection manga={visibleTrending} loading={false} />

      {/* Upcoming Releases with Countdown */}
      <UpcomingSection releases={upcoming} loading={false} />

      {/* Latest Updates */}
      <LatestUpdates manga={visibleLatest} loading={false} />

      {/* Genre Bar */}
      <GenreBar genres={genreSlugs} />

      {/* Join Community Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="py-6 sm:py-10"
      >
        <div
          className="rounded-2xl p-5 sm:p-8 md:p-10 text-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.08), rgba(0, 136, 204, 0.05))',
            border: '1px solid var(--border-color)',
            boxShadow: '0 0 60px var(--accent-glow)',
          }}
        >
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-48 sm:w-96 h-48 sm:h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
            style={{ background: 'var(--accent)' }}
          />

          <div className="relative z-10">
            <h2 className="font-['Bebas_Neue'] text-2xl sm:text-3xl md:text-4xl tracking-wide text-[var(--text-primary)] mb-2 sm:mb-3">
              Join Our Community
            </h2>
            <p className="text-[var(--text-secondary)] text-xs sm:text-sm md:text-base max-w-lg mx-auto mb-4 sm:mb-6">
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
      <LanguageSection bnManga={visibleBnManga} loading={false} />
    </div>
  );
}
