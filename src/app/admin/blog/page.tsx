'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit3, Megaphone, Calendar, Zap, X } from 'lucide-react';
import {
  getAllAnnouncements,
  addAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  type Announcement,
} from '@/lib/firestore';
import { useToast } from '@/components/ui/Toast';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { DeleteConfirm } from '@/components/admin/DeleteConfirm';
import { Timestamp } from 'firebase/firestore';

const typeOptions = [
  { value: 'announcement', label: '📢 Announcement', color: '#00d4ff' },
  { value: 'upcoming', label: '📅 Upcoming', color: '#f59e0b' },
  { value: 'update', label: '🔥 New Update', color: '#10b981' },
];

const defaultForm = {
  title: '',
  titleBn: '',
  content: '',
  contentBn: '',
  type: 'announcement' as string,
  mangaId: '',
  coverImage: '',
};

export default function AdminBlogPage() {
  const { showToast } = useToast();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Announcement | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  async function fetchAnnouncements() {
    setLoading(true);
    try {
      const data = await getAllAnnouncements();
      setAnnouncements(data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  }

  const resetForm = () => {
    setForm(defaultForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (announcement: Announcement) => {
    setForm({
      title: announcement.title,
      titleBn: announcement.titleBn || '',
      content: announcement.content,
      contentBn: announcement.contentBn || '',
      type: announcement.type,
      mangaId: announcement.mangaId || '',
      coverImage: announcement.coverImage || '',
    });
    setEditingId(announcement.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;
    setSubmitting(true);
    try {
      const data = {
        title: form.title,
        titleBn: form.titleBn || undefined,
        content: form.content,
        contentBn: form.contentBn || undefined,
        type: form.type as Announcement['type'],
        mangaId: form.mangaId || undefined,
        coverImage: form.coverImage || undefined,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      if (editingId) {
        await updateAnnouncement(editingId, data);
        showToast('Announcement updated!', 'success');
      } else {
        await addAnnouncement(data);
        showToast('Announcement created!', 'success');
      }
      resetForm();
      await fetchAnnouncements();
    } catch (error) {
      console.error('Error saving announcement:', error);
      showToast('Failed to save announcement', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteAnnouncement(deleteTarget.id);
      showToast('Announcement deleted!', 'success');
      setDeleteTarget(null);
      await fetchAnnouncements();
    } catch (error) {
      console.error('Error deleting announcement:', error);
      showToast('Failed to delete announcement', 'error');
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
      <AdminHeader
        title="Blog & Announcements"
        subtitle="ব্লগ ও ঘোষণা পরিচালনা করুন"
        actions={
          <button
            onClick={() => { resetForm(); setShowForm(!showForm); }}
            className="btn-accent flex items-center gap-2 text-sm"
          >
            {showForm ? <X size={16} /> : <Plus size={16} />}
            {showForm ? 'Cancel' : 'New Post'}
          </button>
        }
      />

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-6"
          >
            <form
              onSubmit={handleSubmit}
              className="rounded-xl p-4 sm:p-6 space-y-4"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
              }}
            >
              <h3 className="font-['Bebas_Neue'] text-lg tracking-wide text-[var(--text-primary)]">
                {editingId ? 'Edit Post' : 'New Announcement'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-[var(--text-muted)] mb-1 block">Title (EN) *</label>
                  <input
                    value={form.title}
                    onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                    required
                    className={inputClass}
                    style={inputStyle}
                    placeholder="Post title..."
                  />
                </div>
                <div>
                  <label className="text-xs text-[var(--text-muted)] mb-1 block">Title (BN)</label>
                  <input
                    value={form.titleBn}
                    onChange={(e) => setForm((p) => ({ ...p, titleBn: e.target.value }))}
                    className={inputClass}
                    style={inputStyle}
                    placeholder="পোস্টের শিরোনাম..."
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-[var(--text-muted)] mb-1 block">Content (EN) *</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
                  required
                  rows={4}
                  className={inputClass}
                  style={inputStyle}
                  placeholder="Write your post content..."
                />
              </div>

              <div>
                <label className="text-xs text-[var(--text-muted)] mb-1 block">Content (BN)</label>
                <textarea
                  value={form.contentBn}
                  onChange={(e) => setForm((p) => ({ ...p, contentBn: e.target.value }))}
                  rows={4}
                  className={inputClass}
                  style={inputStyle}
                  placeholder="বাংলায় পোস্টের বিষয়বস্তু..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-[var(--text-muted)] mb-1 block">Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
                    className={inputClass}
                    style={inputStyle}
                  >
                    {typeOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-[var(--text-muted)] mb-1 block">Cover Image URL</label>
                  <input
                    value={form.coverImage}
                    onChange={(e) => setForm((p) => ({ ...p, coverImage: e.target.value }))}
                    className={inputClass}
                    style={inputStyle}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-[var(--text-muted)] mb-1 block">Related Manga ID (optional)</label>
                <input
                  value={form.mangaId}
                  onChange={(e) => setForm((p) => ({ ...p, mangaId: e.target.value }))}
                  className={inputClass}
                  style={inputStyle}
                  placeholder="Firestore manga document ID"
                />
              </div>

              <div className="flex gap-2">
                <motion.button
                  type="submit"
                  disabled={submitting}
                  whileHover={{ scale: submitting ? 1 : 1.02 }}
                  whileTap={{ scale: submitting ? 1 : 0.98 }}
                  className="btn-accent text-xs py-2.5 px-5"
                >
                  {submitting ? 'Saving...' : editingId ? 'Update Post' : 'Create Post'}
                </motion.button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2.5 rounded-lg text-xs text-[var(--text-secondary)] hover:bg-[var(--accent-glow)] transition-colors"
                  style={{ border: '1px solid var(--border-color)' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Announcements List */}
      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-16 rounded-lg" />
          ))}
        </div>
      ) : announcements.length === 0 ? (
        <div className="text-center py-12">
          <Megaphone size={40} className="mx-auto text-[var(--text-muted)] mb-3" />
          <p className="text-[var(--text-muted)] text-sm">No announcements yet. Create your first post!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {announcements.map((announcement, index) => {
            const typeOpt = typeOptions.find((t) => t.value === announcement.type) || typeOptions[0];
            return (
              <motion.div
                key={announcement.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-[var(--accent-glow)] transition-all group"
                style={{ border: '1px solid var(--border-color)' }}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span
                    className="flex-shrink-0 px-2 py-1 rounded-md text-[10px] font-bold uppercase"
                    style={{ background: `${typeOpt.color}20`, color: typeOpt.color }}
                  >
                    {typeOpt.label}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                      {announcement.titleBn || announcement.title}
                    </p>
                    <p className="text-xs text-[var(--text-muted)] truncate">
                      {announcement.content.slice(0, 80)}...
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <button
                    onClick={() => handleEdit(announcement)}
                    className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--accent)] transition-all"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(announcement)}
                    className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-red-400 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <DeleteConfirm
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={deleteTarget?.title || ''}
        loading={deleting}
      />
    </div>
  );
}
