'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { slugify } from '@/lib/utils';
import { CustomDropdown, type DropdownOption } from '@/components/ui/CustomDropdown';
import { Clock, CheckCircle, Pause, Globe } from 'lucide-react';
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

  const inputClass = "w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-[var(--accent)]";
  const inputStyle = {
    background: 'var(--bg-primary)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-primary)',
  };
  const labelClass = "block text-sm font-medium text-[var(--text-secondary)] mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-5 w-full max-w-full sm:max-w-2xl">
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

      {/* Status & Language — now using CustomDropdown, responsive grid */}
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

      {/* Rating & Chapters - responsive grid */}
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
