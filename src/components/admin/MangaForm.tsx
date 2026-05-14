'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { slugify } from '@/lib/utils';
import { CustomDropdown, type DropdownOption } from '@/components/ui/CustomDropdown';
import { Clock, CheckCircle, Pause, Globe, Search, Sparkles, X, Loader2, ExternalLink } from 'lucide-react';
import { searchMangaJikan, getMangaDetailJikan, jikanToAutoFill, type JikanMangaSearchResult, type AutoFillData } from '@/lib/jikan';
import type { Manga } from '@/lib/firestore';

interface MangaFormProps {
  initialData?: Partial<Manga>;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  genres: { name: string; slug: string }[];
  loading?: boolean;
  submitLabel?: string;
}

const statusOptions: DropdownOption[] = [
  { value: 'ongoing', label: 'Ongoing', icon: <Clock size={14} className="text-emerald-400" /> },
  { value: 'completed', label: 'Completed', icon: <CheckCircle size={14} className="text-blue-400" /> },
  { value: 'hiatus', label: 'Hiatus', icon: <Pause size={14} className="text-amber-400" /> },
];

const languageOptions: DropdownOption[] = [
  { value: 'en', label: 'English (EN)', icon: <Globe size={14} /> },
  { value: 'bn', label: 'Bengali (BN)', icon: <Globe size={14} /> },
];

const defaultForm = {
  title: '',
  titleBn: '',
  slug: '',
  description: '',
  coverImage: '',
  bannerImage: '',
  genres: [] as string[],
  author: '',
  artist: '',
  status: 'ongoing' as string,
  rating: 0,
  totalChapters: 0,
  language: 'en' as string,
  readLink: '',
  featured: false,
  trending: false,
};

function buildFormFromInitial(initialData?: Partial<Manga>) {
  if (!initialData) return defaultForm;
  return {
    title: initialData.title || '',
    titleBn: initialData.titleBn || '',
    slug: initialData.slug || '',
    description: initialData.description || '',
    coverImage: initialData.coverImage || '',
    bannerImage: initialData.bannerImage || '',
    genres: initialData.genres || [],
    author: initialData.author || '',
    artist: initialData.artist || '',
    status: initialData.status || 'ongoing',
    rating: initialData.rating || 0,
    totalChapters: initialData.totalChapters || 0,
    language: initialData.language || 'en',
    readLink: initialData.readLink || '',
    featured: initialData.featured || false,
    trending: initialData.trending || false,
  };
}

export function MangaForm({ initialData, onSubmit, genres, loading = false, submitLabel = 'Save' }: MangaFormProps) {
  const [form, setForm] = useState(() => buildFormFromInitial(initialData));
  const [autoSlug, setAutoSlug] = useState(() => !initialData?.slug);

  // Auto-fill states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<JikanMangaSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [selectedMalId, setSelectedMalId] = useState<number | null>(null);
  const [autoFillSource, setAutoFillSource] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'title' && autoSlug) {
        updated.slug = slugify(value);
      }
      return updated;
    });
  };

  const handleGenreToggle = (genreName: string) => {
    setForm((prev) => ({
      ...prev,
      genres: prev.genres.includes(genreName)
        ? prev.genres.filter((g) => g !== genreName)
        : [...prev.genres, genreName],
    }));
  };

  const handleCheckbox = (name: string, checked: boolean) => {
    setForm((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
  };

  // Search manga using Jikan API
  const handleSearch = async () => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) return;
    setSearching(true);
    try {
      const results = await searchMangaJikan(searchQuery, 8);
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setSearching(false);
    }
  };

  // Auto-fill form from Jikan data
  const handleAutoFill = async (malId: number) => {
    setSelectedMalId(malId);
    setSearching(true);
    try {
      const detail = await getMangaDetailJikan(malId);
      if (!detail) return;

      const autoFillData: AutoFillData = jikanToAutoFill(detail);

      setForm((prev) => ({
        ...prev,
        title: autoFillData.title,
        slug: autoFillData.slug,
        description: autoFillData.description,
        coverImage: autoFillData.coverImage,
        bannerImage: autoFillData.bannerImage || prev.bannerImage,
        genres: autoFillData.genres,
        author: autoFillData.author,
        artist: autoFillData.artist,
        status: autoFillData.status,
        rating: autoFillData.rating,
        totalChapters: autoFillData.totalChapters,
        readLink: autoFillData.readLink,
      }));

      setAutoFillSource(`MyAnimeList #${malId}`);
      setShowSearch(false);
      setSearchResults([]);
      setSearchQuery('');
    } catch (error) {
      console.error('Auto-fill failed:', error);
    } finally {
      setSearching(false);
      setSelectedMalId(null);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const inputClass = "w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-[var(--accent)]";
  const inputStyle = {
    background: 'var(--bg-primary)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-primary)',
  };
  const labelClass = "block text-sm font-medium text-[var(--text-secondary)] mb-1.5";

  // Map MAL status to display text
  const statusLabel = (s: string | null) => {
    if (s === 'Publishing') return 'Ongoing';
    if (s === 'Finished') return 'Completed';
    if (s === 'On Hiatus') return 'Hiatus';
    return s || 'Unknown';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 w-full max-w-full sm:max-w-2xl">

      {/* ══════ Auto-Fill from MyAnimeList ══════ */}
      <div className="rounded-xl p-4" style={{ background: 'var(--accent-glow)', border: '1px solid var(--accent)' + '30' }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[var(--accent)]" />
            <span className="text-sm font-semibold text-[var(--accent)]">Auto-Fill from MyAnimeList</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-400/10 text-emerald-400 font-medium">FREE</span>
          </div>
          {autoFillSource && (
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-[var(--text-muted)]">Source: {autoFillSource}</span>
              <button
                type="button"
                onClick={() => setAutoFillSource(null)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                <X size={12} />
              </button>
            </div>
          )}
        </div>

        {!showSearch ? (
          <button
            type="button"
            onClick={() => setShowSearch(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all w-full justify-center"
            style={{
              background: 'var(--accent)',
              color: '#0a0a0f',
            }}
          >
            <Search size={16} />
            Search Manga & Auto-Fill
          </button>
        ) : (
          <div className="space-y-3">
            {/* Search Input */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Type manga name... e.g. One Piece, Naruto, Jujutsu Kaisen"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  style={{
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                  autoFocus
                />
              </div>
              <button
                type="button"
                onClick={handleSearch}
                disabled={searching || !searchQuery.trim()}
                className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 disabled:opacity-50"
                style={{ background: 'var(--accent)', color: '#0a0a0f' }}
              >
                {searching ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
                Search
              </button>
              <button
                type="button"
                onClick={() => { setShowSearch(false); setSearchResults([]); setSearchQuery(''); }}
                className="px-3 py-2.5 rounded-xl text-sm transition-all"
                style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}
              >
                <X size={14} />
              </button>
            </div>

            {/* Search Results */}
            <AnimatePresence>
              {searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {searchResults.map((result) => (
                      <motion.button
                        key={result.mal_id}
                        type="button"
                        onClick={() => handleAutoFill(result.mal_id)}
                        disabled={searching && selectedMalId === result.mal_id}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className="w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all"
                        style={{
                          background: 'var(--bg-primary)',
                          border: '1px solid var(--border-color)',
                          opacity: searching && selectedMalId === result.mal_id ? 0.6 : 1,
                        }}
                      >
                        {/* Thumbnail */}
                        <div className="flex-shrink-0 w-10 h-14 rounded-md overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
                          <img
                            src={result.images?.webp?.image_url || result.images?.jpg?.image_url || ''}
                            alt={result.title}
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
                            {result.title}
                          </p>
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-[var(--text-muted)] mt-0.5">
                            {result.type && <span>{result.type}</span>}
                            <span>· {statusLabel(result.status)}</span>
                            {result.chapters && <span>· {result.chapters} ch</span>}
                            {result.score && <span className="text-yellow-400">★ {result.score}</span>}
                          </div>
                          {result.authors?.length > 0 && (
                            <p className="text-xs text-[var(--text-secondary)] mt-0.5 truncate">
                              {result.authors.map((a) => a.name).join(', ')}
                            </p>
                          )}
                          <p className="text-[10px] text-[var(--text-muted)] mt-1 line-clamp-2">
                            {result.synopsis?.replace(/\[Written by MAL Rewrite\]/g, '').trim() || 'No description'}
                          </p>
                        </div>

                        {/* Loading indicator */}
                        {searching && selectedMalId === result.mal_id && (
                          <Loader2 size={14} className="animate-spin text-[var(--accent)] flex-shrink-0 mt-1" />
                        )}
                      </motion.button>
                    ))}
                  </div>
                  <p className="text-[10px] text-[var(--text-muted)] mt-2 text-center">
                    Data from MyAnimeList via Jikan API (Free) · Click to auto-fill all fields
                  </p>
                </motion.div>
              )}

              {searching && searchResults.length === 0 && (
                <div className="flex items-center justify-center py-6 gap-2">
                  <Loader2 size={16} className="animate-spin text-[var(--accent)]" />
                  <span className="text-sm text-[var(--text-muted)]">Searching MyAnimeList...</span>
                </div>
              )}

              {!searching && searchQuery.length >= 2 && searchResults.length === 0 && showSearch && (
                <p className="text-xs text-[var(--text-muted)] text-center py-4">
                  No results found. Try a different search term.
                </p>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      <div className="border-t pt-5" style={{ borderColor: 'var(--border-color)' }}>
        <p className="text-xs text-[var(--text-muted)] mb-4">
          💡 টিপস: উপরের &quot;Search & Auto-Fill&quot; বাটনে ক্লিক করে মাঙ্গার নাম লিখুন। সিলেক্ট করলে সব ফিল্ড অটোমেটিক ভরে যাবে, তারপর আপনি এডিট করতে পারবেন।
        </p>
      </div>

      {/* Title EN */}
      <div>
        <label className={labelClass}>Title (EN) *</label>
        <input name="title" value={form.title} onChange={handleChange} required className={inputClass} style={inputStyle} placeholder="e.g. One Piece" />
      </div>

      {/* Title BN */}
      <div>
        <label className={labelClass}>Title (BN)</label>
        <input name="titleBn" value={form.titleBn} onChange={handleChange} className={inputClass} style={inputStyle} placeholder="e.g. ওয়ান পিস" />
      </div>

      {/* Slug */}
      <div>
        <label className={labelClass}>Slug *</label>
        <div className="flex gap-2">
          <input name="slug" value={form.slug} onChange={handleChange} required className={inputClass} style={inputStyle} placeholder="one-piece" />
          <button
            type="button"
            onClick={() => setAutoSlug(!autoSlug)}
            className="px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all"
            style={{
              background: autoSlug ? 'var(--accent-glow)' : 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              color: autoSlug ? 'var(--accent)' : 'var(--text-muted)',
            }}
          >
            {autoSlug ? 'Auto' : 'Manual'}
          </button>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className={labelClass}>Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} rows={4} className={inputClass} style={inputStyle} placeholder="Manga description..." />
      </div>

      {/* Cover Image */}
      <div>
        <label className={labelClass}>Cover Image URL *</label>
        <input name="coverImage" value={form.coverImage} onChange={handleChange} required className={inputClass} style={inputStyle} placeholder="https://..." />
        <AnimatePresence>
          {form.coverImage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 relative w-32 h-44 rounded-lg overflow-hidden"
            >
              <img src={form.coverImage} alt="Preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Banner Image */}
      <div>
        <label className={labelClass}>Banner Image URL</label>
        <input name="bannerImage" value={form.bannerImage} onChange={handleChange} className={inputClass} style={inputStyle} placeholder="https://..." />
        <AnimatePresence>
          {form.bannerImage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 relative w-full h-32 rounded-lg overflow-hidden"
            >
              <img src={form.bannerImage} alt="Preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Genres - scrollable container on mobile */}
      <div>
        <label className={labelClass}>Genres *</label>
        <div className="max-h-48 overflow-y-auto">
          <div className="flex flex-wrap gap-2">
            {genres.map((g) => (
              <motion.button
                key={g.slug}
                type="button"
                onClick={() => handleGenreToggle(g.name)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="genre-chip text-xs"
                style={{
                  borderColor: form.genres.includes(g.name) ? 'var(--accent)' : undefined,
                  background: form.genres.includes(g.name) ? 'var(--accent-glow)' : undefined,
                  color: form.genres.includes(g.name) ? 'var(--accent)' : undefined,
                }}
              >
                {g.name}
              </motion.button>
            ))}
            {/* Show auto-filled genres that don't exist in the genre list */}
            {form.genres.filter((g) => !genres.some((gg) => gg.name === g)).map((g) => (
              <span
                key={`auto-${g}`}
                className="genre-chip text-xs"
                style={{
                  borderColor: 'var(--accent)',
                  background: 'var(--accent-glow)',
                  color: 'var(--accent)',
                }}
              >
                {g} <span className="text-[10px] opacity-60">(MAL)</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Author & Artist - responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Author</label>
          <input name="author" value={form.author} onChange={handleChange} className={inputClass} style={inputStyle} />
        </div>
        <div>
          <label className={labelClass}>Artist</label>
          <input name="artist" value={form.artist} onChange={handleChange} className={inputClass} style={inputStyle} />
        </div>
      </div>

      {/* Status & Language */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Status *</label>
          <CustomDropdown
            options={statusOptions}
            value={form.status}
            onChange={(val) => setForm((prev) => ({ ...prev, status: val }))}
            placeholder="Select status"
            size="md"
            className="w-full"
          />
        </div>
        <div>
          <label className={labelClass}>Language *</label>
          <CustomDropdown
            options={languageOptions}
            value={form.language}
            onChange={(val) => setForm((prev) => ({ ...prev, language: val }))}
            placeholder="Select language"
            size="md"
            className="w-full"
          />
        </div>
      </div>

      {/* Rating & Chapters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Rating (0-10)</label>
          <input name="rating" type="number" min="0" max="10" step="0.1" value={form.rating} onChange={handleChange} className={inputClass} style={inputStyle} />
        </div>
        <div>
          <label className={labelClass}>Total Chapters</label>
          <input name="totalChapters" type="number" min="0" value={form.totalChapters} onChange={handleChange} className={inputClass} style={inputStyle} />
        </div>
      </div>

      {/* Read Link */}
      <div>
        <label className={labelClass}>Read Link *</label>
        <input name="readLink" value={form.readLink} onChange={handleChange} required className={inputClass} style={inputStyle} placeholder="https://external-site.com/manga/..." />
        {form.readLink && (
          <a href={form.readLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-[var(--accent)] mt-1 hover:underline">
            <ExternalLink size={10} /> Test link
          </a>
        )}
      </div>

      {/* Checkboxes */}
      <div className="flex flex-wrap gap-4 sm:gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => handleCheckbox('featured', e.target.checked)}
            className="w-4 h-4 rounded accent-[var(--accent)]"
          />
          <span className="text-sm text-[var(--text-secondary)]">Featured (Hero Banner)</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.trending}
            onChange={(e) => handleCheckbox('trending', e.target.checked)}
            className="w-4 h-4 rounded accent-[var(--accent)]"
          />
          <span className="text-sm text-[var(--text-secondary)]">Trending</span>
        </label>
      </div>

      {/* Submit */}
      <motion.button
        type="submit"
        disabled={loading}
        whileHover={{ scale: loading ? 1 : 1.02 }}
        whileTap={{ scale: loading ? 1 : 0.98 }}
        className="btn-accent w-full py-3 text-sm"
      >
        {loading ? 'Saving...' : submitLabel}
      </motion.button>
    </form>
  );
}
