'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { getAnnouncementById, getAllGenres, type Announcement, type Genre } from '@/lib/firestore';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, Megaphone, Zap } from 'lucide-react';

const typeConfig = {
  announcement: { icon: Megaphone, emoji: '📢', label: 'Update', color: '#00d4ff', bg: 'rgba(0, 212, 255, 0.1)' },
  upcoming: { icon: Calendar, emoji: '📅', label: 'Upcoming', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
  update: { icon: Zap, emoji: '🔥', label: 'New', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
};

export default function BlogPostPage() {
  const params = useParams();
  const id = params.id as string;
  const [post, setPost] = useState<Announcement | null>(null);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [postData, genresData] = await Promise.all([
          getAnnouncementById(id),
          getAllGenres(),
        ]);
        setPost(postData);
        setGenres(genresData);
      } catch (error) {
        console.error('Error fetching blog post:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const genreSlugs = genres.map((g) => ({ name: g.name, slug: g.slug }));

  if (loading) {
    return (
      <PublicLayout genres={[]}>
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="skeleton h-8 w-32 rounded mb-6" />
          <div className="skeleton h-64 rounded-xl mb-6" />
          <div className="skeleton h-10 w-3/4 rounded mb-4" />
          <div className="skeleton h-6 w-1/2 rounded mb-8" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="skeleton h-4 rounded" />
            ))}
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (!post) {
    return (
      <PublicLayout genres={genreSlugs}>
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <h1 className="font-['Bebas_Neue'] text-4xl text-[var(--text-primary)] mb-4">
            Post Not Found
          </h1>
          <p className="text-[var(--text-secondary)] mb-6">এই পোস্টটি খুঁজে পাওয়া যায়নি</p>
          <Link href="/blog" className="btn-accent text-sm">
            Back to Blog
          </Link>
        </div>
      </PublicLayout>
    );
  }

  const config = typeConfig[post.type] || typeConfig.announcement;
  const IconComp = config.icon;

  return (
    <PublicLayout genres={genreSlugs}>
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          ব্লগে ফিরে যান / Back to Blog
        </Link>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Cover Image */}
          {post.coverImage && (
            <div className="relative h-48 sm:h-72 md:h-80 rounded-xl overflow-hidden mb-6">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Type Badge & Date */}
          <div className="flex items-center gap-3 mb-4">
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold uppercase"
              style={{ background: config.bg, color: config.color }}
            >
              <IconComp size={12} />
              {config.label}
            </span>
            {post.createdAt && (
              <span className="text-sm text-[var(--text-muted)] flex items-center gap-1.5">
                <Clock size={14} />
                {new Date(post.createdAt.seconds * 1000).toLocaleDateString('bn-BD', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="font-['Bebas_Neue'] text-3xl md:text-4xl tracking-wide text-[var(--text-primary)] mb-2">
            {post.titleBn || post.title}
          </h1>
          {post.titleBn && (
            <p className="text-lg text-[var(--text-secondary)] mb-6">{post.title}</p>
          )}

          {/* Content */}
          <div className="prose prose-invert max-w-none">
            <div className="text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">
              {post.contentBn || post.content}
            </div>
          </div>

          {/* Link to manga if available */}
          {post.mangaId && (
            <div className="mt-8 p-4 rounded-xl" style={{ background: 'var(--accent-glow)', border: '1px solid var(--accent)' }}>
              <p className="text-sm text-[var(--accent)] font-medium mb-1">এই ঘোষণার সাথে সম্পর্কিত মাঙ্গা</p>
              <Link href={`/manga/${post.mangaId}`} className="text-[var(--text-primary)] font-bold hover:text-[var(--accent)] transition-colors">
                View Manga →
              </Link>
            </div>
          )}
        </motion.article>
      </div>
    </PublicLayout>
  );
}
