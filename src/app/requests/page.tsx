'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { getAllGenres, addRequest, upvoteRequest, type Genre } from '@/lib/firestore';
import { ThumbsUp, MessageSquare, Send, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

// Temporary workaround - import from firestore directly
import {
  getAllRequests as fetchAllRequests,
  type MangaRequest as MangaRequestType,
} from '@/lib/firestore';

const statusConfig = {
  pending: { icon: Clock, label: 'Pending', emoji: '🟡', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
  approved: { icon: CheckCircle, label: 'Approved', emoji: '🟢', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
  completed: { icon: CheckCircle, label: 'Completed', emoji: '✅', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
  rejected: { icon: XCircle, label: 'Rejected', emoji: '🔴', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
};

export default function RequestsPage() {
  const { showToast } = useToast();
  const [requests, setRequests] = useState<MangaRequestType[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [formTitle, setFormTitle] = useState('');
  const [formTitleBn, setFormTitleBn] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formName, setFormName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'upvotes'>('upvotes');

  useEffect(() => {
    async function fetchData() {
      try {
        const [requestsData, genresData] = await Promise.all([
          fetchAllRequests(),
          getAllGenres(),
        ]);
        setRequests(requestsData);
        setGenres(genresData);
      } catch (error) {
        console.error('Error fetching requests:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const sortedRequests = [...requests].sort((a, b) => {
    if (sortBy === 'upvotes') return b.upvotes - a.upvotes;
    return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDescription.trim()) return;
    setSubmitting(true);
    try {
      // Generate a pseudo user ID from localStorage
      let userId = localStorage.getItem('iskultrip-user-id');
      if (!userId) {
        userId = 'user_' + Math.random().toString(36).substring(2, 10);
        localStorage.setItem('iskultrip-user-id', userId);
      }

      await addRequest({
        mangaTitle: formTitle,
        mangaTitleBn: formTitleBn || undefined,
        description: formDescription,
        requestedBy: formName || 'anonymous',
        status: 'pending',
        upvotes: 0,
        upvotedBy: [],
        createdAt: undefined as unknown as never,
        updatedAt: undefined as unknown as never,
      });
      showToast('রিকোয়েস্ট জমা হয়েছে! Request submitted!', 'success');
      setFormTitle('');
      setFormTitleBn('');
      setFormDescription('');
      setFormName('');
      // Refresh
      const data = await fetchAllRequests();
      setRequests(data);
    } catch (error) {
      console.error('Error submitting request:', error);
      showToast('রিকোয়েস্ট জমা দিতে সমস্যা হয়েছে', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpvote = async (request: MangaRequestType) => {
    let userId = localStorage.getItem('iskultrip-user-id');
    if (!userId) {
      userId = 'user_' + Math.random().toString(36).substring(2, 10);
      localStorage.setItem('iskultrip-user-id', userId);
    }
    try {
      await upvoteRequest(request.id, userId);
      // Refresh
      const data = await fetchAllRequests();
      setRequests(data);
    } catch (error) {
      console.error('Error upvoting:', error);
    }
  };

  const genreSlugs = genres.map((g) => ({ name: g.name, slug: g.slug }));
  const inputClass = 'w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-[var(--accent)]';
  const inputStyle = {
    background: 'var(--bg-primary)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-primary)',
  };

  return (
    <PublicLayout genres={genreSlugs}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-['Bebas_Neue'] text-4xl md:text-5xl tracking-wide text-[var(--text-primary)] mb-2">
            মাঙ্গা রিকোয়েস্ট / Manga Requests
          </h1>
          <p className="text-[var(--text-secondary)]">
            আপনি কোন মাঙ্গা বাংলায় পড়তে চান? রিকোয়েস্ট করুন! — Request manga you want to read in Bengali
          </p>
        </motion.div>

        {/* Request Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl p-5 sm:p-6 mb-8"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
          }}
        >
          <h2 className="font-['Bebas_Neue'] text-xl tracking-wide text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <MessageSquare size={20} className="text-[var(--accent)]" />
            নতুন রিকোয়েস্ট / New Request
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-[var(--text-muted)] mb-1 block">Manga Title (EN) *</label>
                <input
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  required
                  className={inputClass}
                  style={inputStyle}
                  placeholder="e.g. Demon Slayer"
                />
              </div>
              <div>
                <label className="text-xs text-[var(--text-muted)] mb-1 block">মাঙ্গার নাম (BN)</label>
                <input
                  value={formTitleBn}
                  onChange={(e) => setFormTitleBn(e.target.value)}
                  className={inputClass}
                  style={inputStyle}
                  placeholder="e.g. ডেমন স্লেয়ার"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-[var(--text-muted)] mb-1 block">Description / বিবরণ *</label>
              <textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                required
                rows={3}
                className={inputClass}
                style={inputStyle}
                placeholder="Why do you want this manga translated? কেন আপনি এই মাঙ্গাটি অনুবাদ করতে চান?"
              />
            </div>

            <div>
              <label className="text-xs text-[var(--text-muted)] mb-1 block">Your Name (optional)</label>
              <input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className={inputClass}
                style={inputStyle}
                placeholder="Anonymous"
              />
            </div>

            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={{ scale: submitting ? 1 : 1.02 }}
              whileTap={{ scale: submitting ? 1 : 0.98 }}
              className="btn-accent flex items-center gap-2 text-sm"
            >
              <Send size={16} />
              {submitting ? 'Submitting...' : 'রিকোয়েস্ট জমা দিন / Submit Request'}
            </motion.button>
          </div>
        </motion.form>

        {/* Sort Tabs */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-['Bebas_Neue'] text-2xl tracking-wide text-[var(--text-primary)]">
            সকল রিকোয়েস্ট / All Requests ({requests.length})
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setSortBy('upvotes')}
              className="genre-chip text-xs"
              style={{
                borderColor: sortBy === 'upvotes' ? 'var(--accent)' : undefined,
                background: sortBy === 'upvotes' ? 'var(--accent-glow)' : undefined,
                color: sortBy === 'upvotes' ? 'var(--accent)' : undefined,
              }}
            >
              Most Upvoted
            </button>
            <button
              onClick={() => setSortBy('newest')}
              className="genre-chip text-xs"
              style={{
                borderColor: sortBy === 'newest' ? 'var(--accent)' : undefined,
                background: sortBy === 'newest' ? 'var(--accent-glow)' : undefined,
                color: sortBy === 'newest' ? 'var(--accent)' : undefined,
              }}
            >
              Newest
            </button>
          </div>
        </div>

        {/* Requests List */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-28 rounded-xl" />
            ))}
          </div>
        ) : sortedRequests.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare size={48} className="mx-auto text-[var(--text-muted)] mb-4" />
            <h3 className="font-['Bebas_Neue'] text-xl text-[var(--text-secondary)] mb-2">
              কোনো রিকোয়েস্ট নেই
            </h3>
            <p className="text-sm text-[var(--text-muted)]">No requests yet. Be the first to request a manga!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedRequests.map((request, index) => {
              const status = statusConfig[request.status] || statusConfig.pending;
              return (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-xl p-4 sm:p-5"
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <div className="flex items-start gap-4">
                    {/* Upvote */}
                    <button
                      onClick={() => handleUpvote(request)}
                      className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all hover:bg-[var(--accent-glow)] flex-shrink-0"
                      style={{ border: '1px solid var(--border-color)' }}
                    >
                      <ThumbsUp size={18} className="text-[var(--accent)]" />
                      <span className="text-sm font-bold text-[var(--text-primary)]">{request.upvotes}</span>
                    </button>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base font-bold text-[var(--text-primary)] truncate">
                          {request.mangaTitleBn || request.mangaTitle}
                        </h3>
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase whitespace-nowrap"
                          style={{ background: status.bg, color: status.color }}
                        >
                          {status.emoji} {status.label}
                        </span>
                      </div>
                      {request.mangaTitleBn && (
                        <p className="text-xs text-[var(--text-muted)] mb-1">{request.mangaTitle}</p>
                      )}
                      <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-2">
                        {request.description}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                        <span>by {request.requestedBy}</span>
                        {request.createdAt && (
                          <span>{new Date(request.createdAt.seconds * 1000).toLocaleDateString()}</span>
                        )}
                        {request.adminNote && (
                          <span className="text-[var(--accent)] flex items-center gap-1">
                            <AlertCircle size={10} />
                            Admin: {request.adminNote}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
