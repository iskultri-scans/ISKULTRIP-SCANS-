'use client';

import React from 'react';
import { SearchInput } from './SearchInput';
import { SortDropdown } from './SortDropdown';
import { cn } from '@/lib/utils';

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

const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'completed', label: 'Completed' },
  { value: 'hiatus', label: 'Hiatus' },
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
  return (
    <div className="space-y-4 mb-6">
      {/* Search */}
      <SearchInput value={search} onChange={onSearchChange} />

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Language Tabs */}
        <div className="flex rounded-xl overflow-hidden" style={{ border: '1px solid var(--border-color)' }}>
          {languageTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => onLanguageChange(tab.value)}
              className={cn(
                'px-4 py-2 text-sm font-medium transition-all',
                language === tab.value
                  ? 'bg-[var(--accent)] text-[#0a0a0f]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--accent)]'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Status Dropdown */}
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="px-3 py-2 rounded-xl text-sm outline-none cursor-pointer"
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
          }}
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        {/* Genre Select */}
        <select
          value={genre}
          onChange={(e) => onGenreChange(e.target.value)}
          className="px-3 py-2 rounded-xl text-sm outline-none cursor-pointer"
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
          }}
        >
          <option value="">All Genres</option>
          {genres.map((g) => (
            <option key={g.slug} value={g.slug}>{g.name}</option>
          ))}
        </select>

        {/* Sort */}
        <div className="ml-auto">
          <SortDropdown value={sort} onChange={onSortChange} />
        </div>
      </div>
    </div>
  );
}
