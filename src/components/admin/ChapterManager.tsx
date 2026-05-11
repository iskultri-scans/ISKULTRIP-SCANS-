'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, ExternalLink, BookOpen } from 'lucide-react';
import { addChapter, deleteChapter, getChaptersByMangaId, type Chapter } from '@/lib/firestore';
import { useToast } from '@/components/ui/Toast';
import { DeleteConfirm } from './DeleteConfirm';

interface ChapterManagerProps {
  mangaId: string;
  mangaTitle: string;
}

export function ChapterManager({ mangaId, mangaTitle }: ChapterManagerProps) {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newChapterNumber, setNewChapterNumber] = useState('');
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [newChapterLink, setNewChapterLink] = useState('');
  const [adding, setAdding] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Chapter | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { showToast } = useToast();

  const fetchChapters = async () => {
    try {
      const data = await getChaptersByMangaId(mangaId);
      setChapters(data);
    } catch (error) {
      console.error('Error fetching chapters:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChapters();
  }, [mangaId]);

  const handleAddChapter = async () => {
    if (!newChapterNumber || !newChapterLink) return;
    setAdding(true);
    try {
      await addChapter(mangaId, {
        mangaId,
        title: newChapterTitle || `Chapter ${newChapterNumber}`,
        chapterNumber: parseInt(newChapterNumber),
        readLink: newChapterLink,
        createdAt: chapters.length > 0 ? chapters[0].createdAt : new Date() as any,
      });
      showToast('Chapter added!', 'success');
      setNewChapterNumber('');
      setNewChapterTitle('');
      setNewChapterLink('');
      setShowAddForm(false);
      fetchChapters();
    } catch (error) {
      showToast('Failed to add chapter', 'error');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteChapter(mangaId, deleteTarget.id);
      showToast('Chapter deleted!', 'success');
      setDeleteTarget(null);
      fetchChapters();
    } catch {
      showToast('Failed to delete chapter', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const inputClass = "w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]";
  const inputStyle = {
    background: 'var(--bg-primary)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-primary)',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-['Bebas_Neue'] text-lg tracking-wide text-[var(--text-primary)] flex items-center gap-2">
          <BookOpen size={18} className="text-[var(--accent)]" />
          Chapters ({chapters.length})
        </h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn-accent flex items-center gap-1.5 text-xs py-2 px-3"
        >
          <Plus size={14} /> Add Chapter
        </motion.button>
      </div>

      {/* Add Chapter Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 rounded-xl mb-4 space-y-3" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)' }}>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[var(--text-muted)] mb-1 block">Chapter Number *</label>
                  <input
                    type="number"
                    value={newChapterNumber}
                    onChange={(e) => setNewChapterNumber(e.target.value)}
                    placeholder="1"
                    className={inputClass}
                    style={inputStyle}
                    min="1"
                  />
                </div>
                <div>
                  <label className="text-xs text-[var(--text-muted)] mb-1 block">Chapter Title</label>
                  <input
                    type="text"
                    value={newChapterTitle}
                    onChange={(e) => setNewChapterTitle(e.target.value)}
                    placeholder="Chapter Title"
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-[var(--text-muted)] mb-1 block">External Read Link *</label>
                <input
                  type="url"
                  value={newChapterLink}
                  onChange={(e) => setNewChapterLink(e.target.value)}
                  placeholder="https://external-site.com/chapter/1"
                  className={inputClass}
                  style={inputStyle}
                />
              </div>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddChapter}
                  disabled={adding}
                  className="btn-accent text-xs py-2 px-4"
                >
                  {adding ? 'Adding...' : 'Add Chapter'}
                </motion.button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 rounded-lg text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                  style={{ border: '1px solid var(--border-color)' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chapter List */}
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton h-12 rounded-lg" />
          ))}
        </div>
      ) : chapters.length === 0 ? (
        <div className="text-center py-8 text-[var(--text-muted)] text-sm">
          No chapters yet. Click &quot;Add Chapter&quot; to get started.
        </div>
      ) : (
        <div className="space-y-1">
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
                  <p className="text-xs text-[var(--text-muted)] truncate">{chapter.readLink}</p>
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

      <DeleteConfirm
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={`Chapter ${deleteTarget?.chapterNumber}: ${deleteTarget?.title || ''}`}
        loading={deleting}
      />
    </div>
  );
}
