'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, Star, Trash2, LogIn, BookOpen } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useBookmarks } from '@/context/BookmarkContext';
import { getAllGenres, type Genre } from '@/lib/firestore';
import { PublicLayout } from '@/components/layout/PublicLayout';

export default function BookmarksPage() {
  const { user } = useAuth();
  const { bookmarks, loading, toggleBookmark } = useBookmarks();
  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
    getAllGenres().then(setGenres).catch(console.error);
  }, []);

  return (
    <PublicLayout genres={genres}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.05))',
                border: '1px solid rgba(239, 68, 68, 0.2)',
              }}
            >
              <Bookmark size={20} className="text-red-400 fill-red-400" />
            </div>
            <div>
              <h1 className="font-['Bebas_Neue'] text-3xl tracking-wide text-[var(--text-primary)]">
                My Bookmarks
              </h1>
              <p className="text-sm text-[var(--text-muted)]">
                {loading ? 'Loading...' : `${bookmarks.length} manga saved`}
              </p>
            </div>
          </div>

          {/* Info banner */}
          {!user && bookmarks.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 p-3 rounded-lg flex items-center gap-3"
              style={{
                background: 'rgba(0, 212, 255, 0.05)',
                border: '1px solid rgba(0, 212, 255, 0.15)',
              }}
            >
              <LogIn size={16} className="text-[var(--accent)] flex-shrink-0" />
              <p className="text-sm text-[var(--text-secondary)]">
                <Link href="/login" className="text-[var(--accent)] font-semibold hover:underline">Login</Link> to sync your bookmarks across devices.
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl animate-pulse"
                style={{ aspectRatio: '3/4', background: 'var(--bg-card)' }}
              />
            ))}
          </div>
        ) : bookmarks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.15)',
              }}
            >
              <Bookmark size={36} className="text-red-400/50" />
            </div>
            <h2 className="font-['Bebas_Neue'] text-2xl tracking-wide text-[var(--text-primary)] mb-2">
              No Bookmarks Yet
            </h2>
            <p className="text-[var(--text-secondary)] mb-6 max-w-md mx-auto">
              Start bookmarking your favorite manga to find them easily here. Click the bookmark icon on any manga to save it.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link
                href="/browse"
                className="btn-accent inline-flex items-center gap-2 text-sm px-5 py-2.5 rounded-xl"
              >
                <BookOpen size={16} />
                Browse Manga
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <AnimatePresence mode="popLayout">
              {bookmarks.map((bm, index) => (
                <motion.div
                  key={bm.mangaId}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  className="group"
                >
                  <Link href={`/manga/${bm.slug}`}>
                    <div
                      className="rounded-xl overflow-hidden relative"
                      style={{ background: 'var(--bg-card)' }}
                    >
                      {/* Hover glow */}
                      <div
                        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                        style={{ boxShadow: '0 0 30px var(--accent-glow-strong), inset 0 0 30px var(--accent-glow)' }}
                      />

                      {/* Cover Image */}
                      <div className="relative" style={{ aspectRatio: '3/4' }}>
                        <Image
                          src={bm.coverImage || '/no-cover.png'}
                          alt={bm.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          unoptimized={true}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/no-cover.png';
                          }}
                        />

                        {/* Remove button */}
                        <motion.button
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.85 }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleBookmark({
                              id: bm.mangaId,
                              title: bm.title,
                              titleBn: bm.titleBn,
                              slug: bm.slug,
                              description: '',
                              coverImage: bm.coverImage,
                              genres: bm.genres,
                              author: '',
                              artist: '',
                              status: bm.status,
                              rating: bm.rating,
                              totalChapters: bm.totalChapters,
                              language: bm.language,
                              featured: false,
                              trending: false,
                              createdAt: null as any,
                              updatedAt: null as any,
                            });
                          }}
                          className="absolute top-2 right-2 z-20 w-8 h-8 flex items-center justify-center rounded-full backdrop-blur-sm transition-all duration-200 hover:bg-red-500/90"
                          style={{
                            background: 'rgba(0, 0, 0, 0.5)',
                            boxShadow: '0 0 12px rgba(239, 68, 68, 0.5)',
                          }}
                          aria-label="Remove bookmark"
                        >
                          <Trash2 size={14} className="text-white" />
                        </motion.button>

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white font-semibold text-sm tracking-wide">
                            View Details →
                          </span>
                        </div>
                      </div>

                      {/* Card Info */}
                      <div className="p-3">
                        <h3 className="text-sm font-semibold text-[var(--text-primary)] line-clamp-2 leading-tight mb-1">
                          {bm.title}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] mb-0.5">
                          <Star size={12} className="text-yellow-400 fill-yellow-400" />
                          <span>{bm.rating}</span>
                          {bm.genres.length > 0 && (
                            <>
                              <span>·</span>
                              <span className="truncate">{bm.genres[0]}</span>
                            </>
                          )}
                        </div>
                        <div className="text-xs text-[var(--text-muted)]">
                          Ch. {bm.totalChapters} · {bm.status.charAt(0).toUpperCase() + bm.status.slice(1)}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
