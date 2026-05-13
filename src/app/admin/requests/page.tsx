'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Clock, MessageSquare, Trash2, AlertCircle, Filter } from 'lucide-react';
import {
  getAllRequests,
  updateRequest,
  deleteRequest,
  type MangaRequest,
} from '@/lib/firestore';
import { useToast } from '@/components/ui/Toast';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { DeleteConfirm } from '@/components/admin/DeleteConfirm';
import { Timestamp } from 'firebase/firestore';

const statusConfig = {
  pending: { icon: Clock, label: 'Pending', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
  approved: { icon: CheckCircle, label: 'Approved', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
  completed: { icon: CheckCircle, label: 'Completed', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
  rejected: { icon: XCircle, label: 'Rejected', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
};

type StatusFilter = 'all' | 'pending' | 'approved' | 'completed' | 'rejected';

export default function AdminRequestsPage() {
  const { showToast } = useToast();
  const [requests, setRequests] = useState<MangaRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [noteTarget, setNoteTarget] = useState<MangaRequest | null>(null);
  const [noteText, setNoteText] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MangaRequest | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  async function fetchRequests() {
    setLoading(true);
    try {
      const data = await getAllRequests();
      setRequests(data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  }

  const filtered = statusFilter === 'all'
    ? requests
    : requests.filter((r) => r.status === statusFilter);

  const handleStatusChange = async (id: string, status: MangaRequest['status'], note?: string) => {
    setActionLoading(id);
    try {
      const updateData: Partial<MangaRequest> = { status };
      if (note) updateData.adminNote = note;
      await updateRequest(id, updateData);
      showToast(`Request ${status}!`, 'success');
      await fetchRequests();
      setNoteTarget(null);
      setNoteText('');
    } catch (error) {
      console.error('Error updating request:', error);
      showToast('Failed to update request', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteRequest(deleteTarget.id);
      showToast('Request deleted!', 'success');
      setDeleteTarget(null);
      await fetchRequests();
    } catch (error) {
      console.error('Error deleting request:', error);
      showToast('Failed to delete request', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const counts = {
    all: requests.length,
    pending: requests.filter((r) => r.status === 'pending').length,
    approved: requests.filter((r) => r.status === 'approved').length,
    completed: requests.filter((r) => r.status === 'completed').length,
    rejected: requests.filter((r) => r.status === 'rejected').length,
  };

  return (
    <div>
      <AdminHeader
        title="User Requests"
        subtitle="ব্যবহারকারীর রিকোয়েস্ট পরিচালনা করুন"
      />

      {/* Status Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
        {(['all', 'pending', 'approved', 'completed', 'rejected'] as StatusFilter[]).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className="genre-chip text-xs whitespace-nowrap flex items-center gap-1.5"
            style={{
              borderColor: statusFilter === status ? 'var(--accent)' : undefined,
              background: statusFilter === status ? 'var(--accent-glow)' : undefined,
              color: statusFilter === status ? 'var(--accent)' : undefined,
            }}
          >
            {status === 'all' ? '📋' : statusConfig[status] ? statusConfig[status].label === 'Pending' ? '🟡' : statusConfig[status].label === 'Approved' ? '🟢' : statusConfig[status].label === 'Completed' ? '✅' : '🔴' : ''}
            {status.charAt(0).toUpperCase() + status.slice(1)} ({counts[status]})
          </button>
        ))}
      </div>

      {/* Requests List */}
      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-24 rounded-lg" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare size={40} className="mx-auto text-[var(--text-muted)] mb-3" />
          <p className="text-[var(--text-muted)] text-sm">No requests found for this filter.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((request, index) => {
            const status = statusConfig[request.status] || statusConfig.pending;
            const StatusIcon = status.icon;
            const isLoading = actionLoading === request.id;
            return (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className="rounded-xl p-4"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-bold text-[var(--text-primary)] truncate">
                        {request.mangaTitleBn || request.mangaTitle}
                      </h3>
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase whitespace-nowrap"
                        style={{ background: status.bg, color: status.color }}
                      >
                        <StatusIcon size={10} />
                        {status.label}
                      </span>
                    </div>
                    {request.mangaTitleBn && (
                      <p className="text-xs text-[var(--text-muted)] mb-1">{request.mangaTitle}</p>
                    )}
                    <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mb-1">
                      {request.description}
                    </p>
                    <div className="flex items-center gap-3 text-[10px] text-[var(--text-muted)]">
                      <span>by {request.requestedBy}</span>
                      <span>👍 {request.upvotes}</span>
                      {request.createdAt && (
                        <span>{new Date(request.createdAt.seconds * 1000).toLocaleDateString()}</span>
                      )}
                      {request.adminNote && (
                        <span className="text-[var(--accent)]">Note: {request.adminNote}</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {request.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(request.id, 'approved')}
                          disabled={isLoading}
                          className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-400/10 transition-all"
                          title="Approve"
                        >
                          <CheckCircle size={16} />
                        </button>
                        <button
                          onClick={() => { setNoteTarget(request); setNoteText(''); }}
                          className="p-1.5 rounded-lg text-red-400 hover:bg-red-400/10 transition-all"
                          title="Reject with note"
                        >
                          <XCircle size={16} />
                        </button>
                      </>
                    )}
                    {request.status === 'approved' && (
                      <button
                        onClick={() => handleStatusChange(request.id, 'completed')}
                        disabled={isLoading}
                        className="p-1.5 rounded-lg text-blue-400 hover:bg-blue-400/10 transition-all"
                        title="Mark Complete"
                      >
                        <CheckCircle size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => setDeleteTarget(request)}
                      className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-red-400 transition-all"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Note Modal (for rejection) */}
      <AnimatePresence>
        {noteTarget && (
          <>
            <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setNoteTarget(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-md rounded-xl p-6"
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                boxShadow: '0 0 30px var(--accent-glow), 0 20px 40px -12px rgba(0, 0, 0, 0.5)',
              }}
            >
              <h3 className="font-['Bebas_Neue'] text-lg tracking-wide text-[var(--text-primary)] mb-4">
                Reject Request — Add Note
              </h3>
              <p className="text-sm text-[var(--text-secondary)] mb-3">
                {noteTarget.mangaTitle}
              </p>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                rows={3}
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all mb-4"
                style={{
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                }}
                placeholder="Optional rejection reason..."
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleStatusChange(noteTarget.id, 'rejected', noteText || undefined)}
                  className="btn-accent text-xs py-2 px-4"
                  style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}
                >
                  Reject
                </button>
                <button
                  onClick={() => setNoteTarget(null)}
                  className="px-4 py-2 rounded-lg text-xs text-[var(--text-secondary)] hover:bg-[var(--accent-glow)] transition-colors"
                  style={{ border: '1px solid var(--border-color)' }}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <DeleteConfirm
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={deleteTarget?.mangaTitle || ''}
        loading={deleting}
      />
    </div>
  );
}
