'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, ExternalLink } from 'lucide-react';
import { CountdownTimer } from '@/components/ui/CountdownTimer';
import type { UpcomingRelease } from '@/lib/firestore';

interface UpcomingSectionProps {
  releases: UpcomingRelease[];
  loading?: boolean;
}

export function UpcomingSection({ releases, loading = false }: UpcomingSectionProps) {
  if (loading) {
    return (
      <section className="py-4 sm:py-8">
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <Clock size={20} className="text-[var(--accent)] sm:!w-6 sm:!h-6" />
          <h2 className="font-['Bebas_Neue'] text-xl sm:text-2xl tracking-wide text-[var(--text-primary)]">
            আসন্ন রিলিজ / Upcoming
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-48 rounded-xl" />
          ))}
        </div>
      </section>
    );
  }

  if (releases.length === 0) return null;

  return (
    <section className="py-4 sm:py-8">
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <Clock size={20} className="text-[var(--accent)] sm:!w-6 sm:!h-6" />
        <h2 className="font-['Bebas_Neue'] text-xl sm:text-2xl tracking-wide text-[var(--text-primary)]">
          আসন্ন রিলিজ / Upcoming Releases
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {releases.map((release, index) => (
          <motion.div
            key={release.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.4 }}
            className="rounded-xl overflow-hidden relative group"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
            }}
          >
            {/* Cover Image */}
            {release.coverImage && (
              <div className="relative h-32 overflow-hidden">
                <img
                  src={release.coverImage}
                  alt={release.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] via-transparent to-transparent" />
              </div>
            )}

            <div className="p-4">
              {/* Title */}
              <h3 className="text-base font-bold text-[var(--text-primary)] mb-1 truncate">
                {release.titleBn || release.title}
              </h3>
              {release.titleBn && (
                <p className="text-xs text-[var(--text-muted)] mb-3 truncate">{release.title}</p>
              )}

              {/* Countdown */}
              <CountdownTimer targetDate={release.releaseDate.toDate()} />

              {/* Link to manga */}
              {release.mangaSlug && (
                <Link
                  href={`/manga/${release.mangaSlug}`}
                  className="mt-3 inline-flex items-center gap-1 text-xs text-[var(--accent)] hover:underline"
                >
                  <ExternalLink size={12} />
                  View Manga
                </Link>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
