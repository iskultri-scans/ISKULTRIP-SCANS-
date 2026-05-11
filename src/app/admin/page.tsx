'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { StatsCards } from '@/components/admin/StatsCards';
import { getStats, type Manga } from '@/lib/firestore';
import { PlusCircle, Tags } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total: 0, en: 0, bn: 0, ongoing: 0, completed: 0, recent: [] as Manga[] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <AdminHeader
        title="Dashboard"
        subtitle="Overview of your manga directory"
        actions={
          <div className="flex gap-3">
            <Link href="/admin/manga/add" className="btn-accent flex items-center gap-2 text-sm">
              <PlusCircle size={16} /> Add Manga
            </Link>
            <Link
              href="/admin/genres"
              className="px-4 py-2 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--accent)] transition-all"
              style={{ border: '1px solid var(--border-color)' }}
            >
              <Tags size={16} className="inline mr-1" />
              Genres
            </Link>
          </div>
        }
      />

      <StatsCards stats={stats} />

      {/* Recent Manga */}
      <div className="mt-8">
        <h2 className="font-['Bebas_Neue'] text-xl tracking-wide text-[var(--text-primary)] mb-4">
          Recent Manga
        </h2>
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="skeleton h-12 rounded-lg" />
            ))}
          </div>
        ) : stats.recent.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)]">No manga added yet.</p>
        ) : (
          <div
            className="rounded-xl overflow-hidden"
            style={{ border: '1px solid var(--border-color)' }}
          >
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}>
                  <th className="text-left py-3 px-4 text-[var(--text-muted)] font-medium">Title</th>
                  <th className="text-left py-3 px-4 text-[var(--text-muted)] font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-[var(--text-muted)] font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent.map((m) => (
                  <tr key={m.id} className="border-b last:border-0" style={{ borderColor: 'var(--border-color)' }}>
                    <td className="py-2.5 px-4 text-[var(--text-primary)]">{m.title}</td>
                    <td className="py-2.5 px-4 text-[var(--text-secondary)] capitalize">{m.status}</td>
                    <td className="py-2.5 px-4 text-[var(--text-muted)]">
                      {m.createdAt ? new Date(m.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
