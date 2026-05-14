'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ExternalLink, ChevronDown, ChevronUp, Search } from 'lucide-react';
import type { Chapter } from '@/lib/firestore';

interface ChapterListProps {
  chapters: Chapter[];
  mangaTitle: string;
}

export function ChapterList({ chapters, mangaTitle }: ChapterListProps) {
  const [expanded, setExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortAsc, setSortAsc] = useState(false); // default desc (newest first)

  const filteredChapters = chapters.filter((ch) =>
    ch.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ch.chapterNumber.toString().includes(searchQuery)
  );

  const sortedChapters = sortAsc
    ? [...filteredChapters].sort((a, b) => a.chapterNumber - b.chapterNumber)
    : filteredChapters;

  const handleChapterClick = (readLink: string) => {
    window.open(readLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="mt-8"
    >
      {/* Header */}
      <div
        className="rounded-t-2xl p-4 flex items-center justify-between cursor-pointer"
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderBottom: expanded ? 'none' : '1px solid var(--border-color)',
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <BookOpen size={22} className="text-[var(--accent)]" />
          <h2 className="font-['Bebas_Neue'] text-xl tracking-wide text-[var(--text-primary)]">
            Chapters ({chapters.length})
          </h2>
        </div>
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronUp size={20} className="text-[var(--text-muted)]" />
        </motion.div>
      </div>

      {/* Expandable Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div
              className="rounded-b-2xl overflow-hidden"
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderTop: 'none',
              }}
            >
              {/* Search & Sort Bar */}
              <div className="p-3 border-b flex items-center gap-3" style={{ borderColor: 'var(--border-color)' }}>
                <div className="relative flex-1">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search chapters..."
                    className="w-full pl-8 pr-3 py-2 rounded-lg text-xs outline-none"
                    style={{
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)',
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); setSortAsc(!sortAsc); }}
                  className="px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all"
                  style={{
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    color: sortAsc ? 'var(--accent)' : 'var(--text-muted)',
                  }}
                >
                  {sortAsc ? 'Oldest ↑' : 'Newest ↓'}
                </button>
              </div>

              {/* Chapter Items */}
              <div className="max-h-[500px] overflow-y-auto no-scrollbar">
                {sortedChapters.length === 0 ? (
                  <div className="text-center py-10 text-[var(--text-muted)] text-sm">
                    {chapters.length === 0
                      ? 'No chapters available yet.'
                      : 'No matching chapters found.'}
                  </div>
                ) : (
                  sortedChapters.map((chapter, index) => (
                    <motion.button
                      key={chapter.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03, duration: 0.3 }}
                      onClick={() => handleChapterClick(chapter.readLink)}
                      className="w-full flex items-center justify-between px-4 py-3.5 text-left transition-all hover:bg-[var(--accent-glow)] group"
                      style={{
                        borderBottom: '1px solid var(--border-color)',
                      }}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span
                          className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold"
                          style={{
                            background: 'var(--accent-glow)',
                            color: 'var(--accent)',
                          }}
                        >
                          {chapter.chapterNumber}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-[var(--text-primary)] truncate group-hover:text-[var(--accent)] transition-colors">
                            {chapter.title || `Chapter ${chapter.chapterNumber}`}
                          </p>
                          <p className="text-xs text-[var(--text-muted)]">
                            {mangaTitle}
                          </p>
                        </div>
                      </div>
                      <ExternalLink
                        size={14}
                        className="flex-shrink-0 text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-all sm:opacity-0 sm:group-hover:opacity-100"
                      />
                    </motion.button>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
