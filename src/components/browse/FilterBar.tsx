'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SearchInput } from './SearchInput';
import { CustomDropdown, type DropdownOption } from '@/components/ui/CustomDropdown';
import { cn } from '@/lib/utils';
import { Clock, CheckCircle, Pause, Zap, Globe, BookOpen } from 'lucide-react';

interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  language: string;
  onLanguageChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  genre: string;
  onGenreChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
  genres: { name: string; slug: string }[];
}

const languageTabs = [
  { value: 'all', label: 'All' },
  { value: 'en', label: 'EN' },
  { value: 'bn', label: 'BN' },
];

const statusOptions: DropdownOption[] = [
  { value: '', label: 'All Status', icon: <Zap size={14} /> },
  { value: 'ongoing', label: 'Ongoing', icon: <Clock size={14} className="text-emerald-400" />, color: 'emerald' },
  { value: 'completed', label: 'Completed', icon: <CheckCircle size={14} className="text-blue-400" />, color: 'blue' },
  { value: 'hiatus', label: 'Hiatus', icon: <Pause size={14} className="text-amber-400" />, color: 'amber' },
];

export function FilterBar({
  search,
  onSearchChange,
  language,
  onLanguageChange,
  status,
  onStatusChange,
  genre,
  onGenreChange,
  sort,
  onSortChange,
  genres,
}: FilterBarProps) {
  const genreOptions: DropdownOption[] = [
    { value: '', label: 'All Genres', icon: <BookOpen size={14} /> },
    ...genres.map((g) => ({
      value: g.slug,
      label: g.name,
    })),
  ];

  const sortOptions: DropdownOption[] = [
    { value: 'newest', label: 'Newest First' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'az', label: 'A — Z' },
  ];

  return (
    <div className="space-y-4 mb-6">
      {/* Search */}
      <SearchInput value={search} onChange={onSearchChange} />

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Language Tabs */}
        <div
          className="flex rounded-xl overflow-hidden"
          style={{ border: '1px solid var(--border-color)', background: 'var(--bg-secondary)' }}
        >
          {languageTabs.map((tab) => (
            <motion.button
              key={tab.value}
              onClick={() => onLanguageChange(tab.value)}
              whileTap={{ scale: 0.95 }}
              className={cn(
                'px-4 py-2 text-sm font-medium transition-all duration-200 relative',
                language === tab.value
                  ? 'text-[#0a0a0f]'
                  : 'text-[var(--text-muted)] hover:text-[var(--accent)]'
              )}
              style={{
                background: language === tab.value ? 'var(--accent)' : 'transparent',
              }}
            >
              {language === tab.value && (
                <motion.div
                  layoutId="language-indicator"
                  className="absolute inset-0 rounded-lg"
                  style={{ background: 'var(--accent)' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <Globe size={12} />
                {tab.label}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Status Dropdown */}
        <CustomDropdown
          options={statusOptions}
          value={status}
          onChange={onStatusChange}
          placeholder="All Status"
          size="sm"
          className="w-36"
        />

        {/* Genre Dropdown */}
        <CustomDropdown
          options={genreOptions}
          value={genre}
          onChange={onGenreChange}
          placeholder="All Genres"
          size="sm"
          className="w-40"
        />

        {/* Sort */}
        <div className="ml-auto">
          <CustomDropdown
            options={sortOptions}
            value={sort}
            onChange={onSortChange}
            placeholder="Sort by"
            size="sm"
            className="w-40"
          />
        </div>
      </div>
    </div>
  );
}
