'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { getAllAnnouncements, getAllGenres, type Announcement, type Genre } from '@/lib/firestore';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, Megaphone, Zap, Clock } from 'lucide-react';

const typeConfig = {
  announcement: { icon: Megaphone, emoji: '📢', label: 'Update', color: '#00d4ff', bg: 'rgba(0, 212, 255, 0.1)' },
  upcoming: { icon: Calendar, emoji: '📅', label: 'Upcoming', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
  update: { icon: Zap, emoji: '🔥', label: 'New', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
};

export default function BlogPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    async function fetchData() {
      try {
        const [announcementsData, genresData] = await Promise.all([
          getAllAnnouncements(),
          getAllGenres(),
        ]);
        setAnnouncements(announcementsData);
        setGenres(genresData);
      } catch (error) {
        console.error('Error fetching blog data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const genreSlugs = genres.map((g) => ({ name: g.name, slug: g.slug }));

  const filtered = filter === 'all'
    ? announcements
    : announcements.filter((a) => a.type === filter);

  return (
    <PublicLayout genres={genreSlugs}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-['Bebas_Neue'] text-4xl md:text-5xl tracking-wide text-[var(--text-primary)] mb-2">
            ব্লগ / Blog
          </h1>
          <p className="text-[var(--text-secondary)]">
            সর্বশেষ ঘোষণা ও আপডেট — Latest announcements and updates
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
          {[
            { value: 'all', label: 'All' },
            { value: 'update', label: '🔥 New' },
            { value: 'upcoming', label: '📅 Upcoming' },
            { value: 'announcement', label: '📢 Updates' },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className="genre-chip text-xs whitespace-nowrap"
              style={{
                borderColor: filter === tab.value ? 'var(--accent)' : undefined,
                background: filter === tab.value ? 'var(--accent-glow)' : undefined,
                color: filter === tab.value ? 'var(--accent)' : undefined,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Blog Posts */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-48 rounded-xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Megaphone size={48} className="mx-auto text-[var(--text-muted)] mb-4" />
            <h3 className="font-['Bebas_Neue'] text-xl text-[var(--text-secondary)] mb-2">
              কোনো পোস্ট নেই
            </h3>
            <p className="text-sm text-[var(--text-muted)]">No blog posts yet. Check back later!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((post, index) => {
              const config = typeConfig[post.type] || typeConfig.announcement;
              const IconComp = config.icon;
              return (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={`/blog/${post.id}`}>
                    <div
                      className="rounded-xl overflow-hidden transition-all hover:scale-[1.01] group"
                      style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-color)',
                      }}
                    >
                      {/* Cover Image */}
                      {post.coverImage && (
                        <div className="relative h-48 sm:h-56 overflow-hidden">
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] via-transparent to-transparent" />
                        </div>
                      )}

                      <div className="p-5">
                        {/* Type Badge */}
                        <div className="flex items-center gap-2 mb-3">
                          <span
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold uppercase"
                            style={{ background: config.bg, color: config.color }}
                          >
                            <IconComp size={12} />
                            {config.label}
                          </span>
                          {post.createdAt && (
                            <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                              <Clock size={10} />
                              {new Date(post.createdAt.seconds * 1000).toLocaleDateString('bn-BD', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h2 className="text-lg font-bold text-[var(--text-primary)] mb-1 group-hover:text-[var(--accent)] transition-colors">
                          {post.titleBn || post.title}
                        </h2>
                        {post.titleBn && (
                          <p className="text-sm text-[var(--text-muted)] mb-2">{post.title}</p>
                        )}

                        {/* Excerpt */}
                        <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-3">
                          {post.contentBn || post.content}
                        </p>

                        <span className="inline-flex items-center gap-1 text-xs text-[var(--accent)] font-medium group-hover:gap-2 transition-all">
                          আরও পড়ুন Read More <ArrowRight size={12} />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
