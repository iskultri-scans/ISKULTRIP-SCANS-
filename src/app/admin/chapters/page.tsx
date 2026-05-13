'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, BookOpen, Plus, Trash2, ExternalLink, X, FileText } from 'lucide-react';
import {
  getAllManga,
  getChaptersByMangaId,
  addChapter,
  deleteChapter,
  addNotification,
  type Manga,
  type Chapter,
} from '@/lib/firestore';
import { useToast } from '@/components/ui/Toast';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { DeleteConfirm } from '@/components/admin/DeleteConfirm';
import { Timestamp } from 'firebase/firestore';

export default function AdminChaptersPage() {
  const { showToast } = useToast();

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Manga[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Selected manga state
  const [selectedManga, setSelectedManga] = useState<Manga | null>(null);

  // Chapters state
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [chaptersLoading, setChaptersLoading] = useState(false);

  // Add chapter form
  const [chapterNumber, setChapterNumber] = useState('');
  const [chapterTitle, setChapterTitle] = useState('');
  const [chapterLink, setChapterLink] = useState('');
  const [adding, setAdding] = useState(false);

  // Delete chapter
  const [deleteTarget, setDeleteTarget] = useState<Chapter | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Search manga with debounce
  const searchManga = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }
    setIsSearching(true);
    try {
      const allManga = await getAllManga();
      const lower = query.toLowerCase();
      const filtered = allManga.filter(
        (m) =>
          m.title.toLowerCase().includes(lower) ||
          (m.titleBn && m.titleBn.includes(query)) ||
          m.slug.toLowerCase().includes(lower)
      );
      setSearchResults(filtered.slice(0, 10));
      setShowDropdown(true);
    } catch (error) {
      console.error('Error searching manga:', error);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      searchManga(searchQuery);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery, searchManga]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch chapters when manga is selected
  const fetchChapters = async (mangaId: string) => {
    setChaptersLoading(true);
    try {
      const data = await getChaptersByMangaId(mangaId);
      setChapters(data);
    } catch (error) {
      console.error('Error fetching chapters:', error);
      showToast('Failed to load chapters', 'error');
    } finally {
      setChaptersLoading(false);
    }
  };

  const handleSelectManga = async (manga: Manga) => {
    setSelectedManga(manga);
    setSearchQuery(manga.title);
    setShowDropdown(false);
    setChapterNumber('');
    setChapterTitle('');
    setChapterLink('');
    await fetchChapters(manga.id);
  };

  const handleClearSelection = () => {
    setSelectedManga(null);
    setSearchQuery('');
    setChapters([]);
    setChapterNumber('');
    setChapterTitle('');
    setChapterLink('');
  };

  const handleAddChapter = async () => {
    if (!selectedManga || !chapterNumber || !chapterLink) return;
    setAdding(true);
    try {
      await addChapter(selectedManga.id, {
        mangaId: selectedManga.id,
        title: chapterTitle || `Chapter ${chapterNumber}`,
        chapterNumber: parseInt(chapterNumber),
        readLink: chapterLink,
        createdAt: Timestamp.now(),
      });

      // Create notification for new chapter
      try {
        const title = selectedManga.title;
        const titleBn = selectedManga.titleBn;
        await addNotification({
          title: `New Chapter: ${title} Ch.${chapterNumber}`,
          titleBn: titleBn ? `নতুন চ্যাপ্টার: ${titleBn} অধ্যায় ${chapterNumber}` : undefined,
          message: `Chapter ${chapterNumber} of ${title} is now available!`,
          messageBn: titleBn ? `${titleBn} এর অধ্যায় ${chapterNumber} এখন উপলব্ধ!` : undefined,
          type: 'new_chapter',
          mangaSlug: selectedManga.slug,
          createdAt: Timestamp.now(),
        });
      } catch (notifError) {
        console.error('Failed to create notification:', notifError);
      }

      showToast(`Chapter ${chapterNumber} added!`, 'success');
      setChapterNumber('');
      setChapterTitle('');
      setChapterLink('');
      await fetchChapters(selectedManga.id);
    } catch (error) {
      console.error('Error adding chapter:', error);
      showToast('Failed to add chapter', 'error');
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteChapter = async () => {
    if (!selectedManga || !deleteTarget) return;
    setDeleting(true);
    try {
      await deleteChapter(selectedManga.id, deleteTarget.id);
      showToast('Chapter deleted!', 'success');
      setDeleteTarget(null);
      await fetchChapters(selectedManga.id);
    } catch (error) {
      console.error('Error deleting chapter:', error);
      showToast('Failed to delete chapter', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const inputClass = 'w-full px-3 py-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all';
  const inputStyle = {
    background: 'var(--bg-primary)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-primary)',
  };

  return (
    <div>
      <AdminHeader title="Post Chapter" subtitle="Add chapters to manga" />

      {/* Manga Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl p-6 mb-6"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
        }}
      >
        <h3 className="font-['Bebas_Neue'] text-lg tracking-wide text-[var(--text-primary)] mb-4 flex items-center gap-2">
          <Search size={18} className="text-[var(--accent)]" />
          Select Manga
        </h3>

        <div className="relative" ref={searchRef}>
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search manga by title..."
              className={`${inputClass} pl-9 pr-9`}
              style={inputStyle}
              disabled={!!selectedManga}
            />
            {selectedManga ? (
              <button
                onClick={handleClearSelection}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              >
                <X size={16} />
              </button>
            ) : isSearching ? (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : null}
          </div>

          {/* Search Dropdown */}
          <AnimatePresence>
            {showDropdown && searchResults.length > 0 && !selectedManga && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 right-0 mt-1 rounded-xl overflow-hidden z-50 max-h-64 overflow-y-auto"
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
                }}
              >
                {searchResults.map((manga) => (
                  <button
                    key={manga.id}
                    onClick={() => handleSelectManga(manga)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[var(--accent-glow)] transition-colors"
                    style={{ borderBottom: '1px solid var(--border-color)' }}
                  >
                    <div
                      className="w-10 h-14 rounded overflow-hidden flex-shrink-0"
                      style={{ background: 'var(--bg-primary)' }}
                    >
                      <img
                        src={manga.coverImage || '/no-cover.png'}
                        alt={manga.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/no-cover.png';
                        }}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                        {manga.title}
                      </p>
                      {manga.titleBn && (
                        <p className="text-xs text-[var(--text-secondary)] truncate">
                          {manga.titleBn}
                        </p>
                      )}
                      <p className="text-xs text-[var(--text-muted)]">
                        Ch. {manga.totalChapters} · {manga.language.toUpperCase()}
                      </p>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {showDropdown && searchResults.length === 0 && searchQuery.trim() && !isSearching && !selectedManga && (
            <div
              className="absolute top-full left-0 right-0 mt-1 rounded-xl p-4 text-center z-50"
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
              }}
            >
              <p className="text-sm text-[var(--text-muted)]">No manga found</p>
            </div>
          )}
        </div>

        {/* Selected manga info */}
        <AnimatePresence>
          {selectedManga && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div
                className="mt-4 flex items-center gap-4 p-4 rounded-xl"
                style={{
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  boxShadow: '0 0 20px var(--accent-glow)',
                }}
              >
                <div
                  className="w-16 h-22 rounded-lg overflow-hidden flex-shrink-0"
                  style={{ aspectRatio: '3/4' }}
                >
                  <img
                    src={selectedManga.coverImage || '/no-cover.png'}
                    alt={selectedManga.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/no-cover.png';
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-base font-semibold text-[var(--text-primary)] truncate">
                    {selectedManga.title}
                  </h4>
                  {selectedManga.titleBn && (
                    <p className="text-sm text-[var(--text-secondary)] truncate">
                      {selectedManga.titleBn}
                    </p>
                  )}
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    {selectedManga.genres.slice(0, 3).join(', ')} · {selectedManga.status}
                  </p>
                  <p className="text-xs text-[var(--accent)] mt-0.5">
                    {selectedManga.totalChapters} chapters
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Add Chapter Form - shown only when manga is selected */}
      <AnimatePresence>
        {selectedManga && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="rounded-xl p-6 mb-6"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
            }}
          >
            <h3 className="font-['Bebas_Neue'] text-lg tracking-wide text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <Plus size={18} className="text-[var(--accent)]" />
              Add New Chapter
            </h3>

            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[var(--text-muted)] mb-1 block">
                    Chapter Number *
                  </label>
                  <input
                    type="number"
                    value={chapterNumber}
                    onChange={(e) => setChapterNumber(e.target.value)}
                    placeholder="1"
                    className={inputClass}
                    style={inputStyle}
                    min="1"
                  />
                </div>
                <div>
                  <label className="text-xs text-[var(--text-muted)] mb-1 block">
                    Chapter Title
                  </label>
                  <input
                    type="text"
                    value={chapterTitle}
                    onChange={(e) => setChapterTitle(e.target.value)}
                    placeholder="Chapter Title (optional)"
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-[var(--text-muted)] mb-1 block">
                  External Read Link *
                </label>
                <input
                  type="url"
                  value={chapterLink}
                  onChange={(e) => setChapterLink(e.target.value)}
                  placeholder="https://external-site.com/chapter/1"
                  className={inputClass}
                  style={inputStyle}
                />
              </div>
              <div className="flex gap-2 pt-1">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddChapter}
                  disabled={adding || !chapterNumber || !chapterLink}
                  className="btn-accent text-xs py-2.5 px-5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {adding ? 'Adding...' : 'Add Chapter'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Existing Chapters - shown only when manga is selected */}
      <AnimatePresence>
        {selectedManga && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="rounded-xl p-6"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
            }}
          >
            <h3 className="font-['Bebas_Neue'] text-lg tracking-wide text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <FileText size={18} className="text-[var(--accent)]" />
              Existing Chapters ({chapters.length})
            </h3>

            {chaptersLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="skeleton h-12 rounded-lg" />
                ))}
              </div>
            ) : chapters.length === 0 ? (
              <div className="text-center py-8 text-[var(--text-muted)] text-sm">
                No chapters yet. Add the first chapter above.
              </div>
            ) : (
              <div className="space-y-1 max-h-96 overflow-y-auto">
                {chapters.map((chapter, index) => (
                  <motion.div
                    key={chapter.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-[var(--accent-glow)] transition-all group"
                    style={{ border: '1px solid var(--border-color)' }}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span
                        className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                        style={{ background: 'var(--accent-glow)', color: 'var(--accent)' }}
                      >
                        {chapter.chapterNumber}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                          {chapter.title || `Chapter ${chapter.chapterNumber}`}
                        </p>
                        <p className="text-xs text-[var(--text-muted)] truncate">
                          {chapter.readLink}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <a
                        href={chapter.readLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--accent)] transition-all"
                      >
                        <ExternalLink size={14} />
                      </a>
                      <button
                        onClick={() => setDeleteTarget(chapter)}
                        className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-red-400 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state when no manga is selected */}
      <AnimatePresence>
        {!selectedManga && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-xl p-12 text-center"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
            }}
          >
            <BookOpen size={48} className="mx-auto text-[var(--text-muted)] mb-4" />
            <h3 className="font-['Bebas_Neue'] text-xl tracking-wide text-[var(--text-secondary)] mb-2">
              No Manga Selected
            </h3>
            <p className="text-sm text-[var(--text-muted)]">
              Search and select a manga above to manage its chapters
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <DeleteConfirm
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteChapter}
        title={`Chapter ${deleteTarget?.chapterNumber}: ${deleteTarget?.title || ''}`}
        loading={deleting}
      />
    </div>
  );
}
