'use client';

import React, { useEffect, useState } from 'react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { HeroBanner } from '@/components/home/HeroBanner';
import { TrendingSection } from '@/components/home/TrendingSection';
import { LatestUpdates } from '@/components/home/LatestUpdates';
import { GenreBar } from '@/components/home/GenreBar';
import { LanguageSection } from '@/components/home/LanguageSection';
import { WelcomeSection } from '@/components/home/WelcomeSection';
import { AnnouncementBar } from '@/components/home/AnnouncementBar';
import { UpcomingSection } from '@/components/home/UpcomingSection';
import {
  getAllGenres,
  getFeaturedManga,
  getTrendingManga,
  getLatestManga,
  getMangaByLanguage,
  getLatestAnnouncements,
  getUpcomingReleases,
  type Manga,
  type Genre,
  type Announcement,
  type UpcomingRelease,
} from '@/lib/firestore';
import { SITE_CONFIG } from '@/lib/config';
import { Facebook, Send, AlertTriangle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HomePage() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [featured, setFeatured] = useState<Manga[]>([]);
  const [trending, setTrending] = useState<Manga[]>([]);
  const [latest, setLatest] = useState<Manga[]>([]);
  const [bnManga, setBnManga] = useState<Manga[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [upcoming, setUpcoming] = useState<UpcomingRelease[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setError(null);
        const [genresData, featuredData, trendingData, latestData, bnData, announcementsData, upcomingData] = await Promise.allSettled([
          getAllGenres(),
          getFeaturedManga(),
          getTrendingManga(),
          getLatestManga(10),
          getMangaByLanguage('bn', 10),
          getLatestAnnouncements(5),
          getUpcomingReleases(),
        ]);

        // Extract results from Promise.allSettled
        setGenres(genresData.status === 'fulfilled' ? genresData.value : []);
        setFeatured(featuredData.status === 'fulfilled' ? featuredData.value : []);
        setTrending(trendingData.status === 'fulfilled' ? trendingData.value : []);
        setLatest(latestData.status === 'fulfilled' ? latestData.value : []);
        setBnManga(bnData.status === 'fulfilled' ? bnData.value : []);
        setAnnouncements(announcementsData.status === 'fulfilled' ? announcementsData.value : []);
        setUpcoming(upcomingData.status === 'fulfilled' ? upcomingData.value : []);

        // Check if all failed
        const allFailed = [genresData, featuredData, trendingData, latestData, bnData, announcementsData, upcomingData]
          .every(r => r.status === 'rejected');
        if (allFailed) {
          setError('Unable to load content. Please check your connection and try again.');
        }
      } catch (err) {
        console.error('Error fetching home data:', err);
        setError('Something went wrong. Please try again later.');
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
        {/* Welcome Section - Bengali Hero */}
        <WelcomeSection />

        {/* Error Banner */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl flex items-center gap-3"
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
            }}
          >
            <AlertTriangle size={20} className="text-red-400 flex-shrink-0" />
            <p className="text-sm text-red-300 flex-1">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-300 hover:bg-red-400/20 transition-colors"
            >
              <RefreshCw size={14} />
              Retry
            </button>
          </motion.div>
        )}

        {/* Announcement Bar */}
        <AnnouncementBar announcements={announcements} loading={loading} />

        {/* Hero Banner */}
        <HeroBanner manga={featured} loading={loading} />

        {/* Trending */}
        <TrendingSection manga={trending} loading={loading} />

        {/* Upcoming Releases with Countdown */}
        <UpcomingSection releases={upcoming} loading={loading} />

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
