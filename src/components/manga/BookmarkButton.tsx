'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark } from 'lucide-react';
import type { Manga } from '@/lib/firestore';

interface BookmarkButtonProps {
  manga: Manga;
  isBookmarked: boolean;
  onToggle: (manga: Manga) => void;
  size?: number;
  className?: string;
  showLabel?: boolean;
  variant?: 'icon' | 'button' | 'overlay';
}

export function BookmarkButton({
  manga,
  isBookmarked,
  onToggle,
  size = 18,
  className = '',
  showLabel = false,
  variant = 'icon',
}: BookmarkButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggle(manga);
  };

  if (variant === 'overlay') {
    return (
      <motion.button
        onClick={handleClick}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.85 }}
        className="absolute top-2 right-2 z-20 w-8 h-8 flex items-center justify-center rounded-full backdrop-blur-sm transition-all duration-200"
        style={{
          background: isBookmarked
            ? 'rgba(239, 68, 68, 0.9)'
            : 'rgba(0, 0, 0, 0.5)',
          boxShadow: isBookmarked
            ? '0 0 12px rgba(239, 68, 68, 0.5)'
            : '0 2px 8px rgba(0, 0, 0, 0.3)',
        }}
        aria-label={isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isBookmarked ? 'bookmarked' : 'not-bookmarked'}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: 'spring', stiffness: 500, damping: 20 }}
          >
            <Bookmark
              size={size - 2}
              className={isBookmarked ? 'fill-white text-white' : 'text-white/80'}
            />
          </motion.div>
        </AnimatePresence>
      </motion.button>
    );
  }

  if (variant === 'button') {
    return (
      <motion.button
        onClick={handleClick}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${className}`}
        style={{
          background: isBookmarked
            ? 'linear-gradient(135deg, #ef4444, #dc2626)'
            : 'var(--glass-bg)',
          color: isBookmarked ? '#ffffff' : 'var(--text-primary)',
          border: isBookmarked ? 'none' : '1px solid var(--border-color)',
          boxShadow: isBookmarked
            ? '0 4px 15px rgba(239, 68, 68, 0.4), 0 0 20px rgba(239, 68, 68, 0.15)'
            : 'none',
        }}
        aria-label={isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={isBookmarked ? 'bookmarked' : 'not-bookmarked'}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: 'spring', stiffness: 500, damping: 20 }}
            className="flex items-center"
          >
            <Bookmark
              size={size - 2}
              className={isBookmarked ? 'fill-white text-white' : 'text-[var(--accent)]'}
            />
          </motion.span>
        </AnimatePresence>
        {showLabel && (
          <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
        )}
      </motion.button>
    );
  }

  // Default: icon variant
  return (
    <motion.button
      onClick={handleClick}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.85 }}
      className={`p-2 rounded-lg transition-all duration-200 ${className}`}
      style={{
        color: isBookmarked ? '#ef4444' : 'var(--text-muted)',
        background: isBookmarked ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
      }}
      aria-label={isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={isBookmarked ? 'bookmarked' : 'not-bookmarked'}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
          className="flex items-center"
        >
          <Bookmark
            size={size}
            className={isBookmarked ? 'fill-red-400 text-red-400' : ''}
          />
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
