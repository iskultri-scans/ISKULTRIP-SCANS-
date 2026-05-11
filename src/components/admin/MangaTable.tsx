'use client';

import React from 'react';
import Image from 'next/image';
import { Edit, Trash2, Search } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import type { Manga } from '@/lib/firestore';

interface MangaTableProps {
  manga: Manga[];
  onDelete: (manga: Manga) => void;
  loading?: boolean;
}

export function MangaTable({ manga, onDelete, loading = false }: MangaTableProps) {
  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="skeleton h-16 rounded-lg" />
        ))}
      </div>
    );
  }

  if (manga.length === 0) {
    return (
      <div className="text-center py-12 text-[var(--text-muted)]">
        <Search size={36} className="mx-auto mb-3" />
        <p>No manga found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b" style={{ borderColor: 'var(--border-color)' }}>
            <th className="text-left py-3 px-3 text-[var(--text-muted)] font-medium">Cover</th>
            <th className="text-left py-3 px-3 text-[var(--text-muted)] font-medium">Title</th>
            <th className="text-left py-3 px-3 text-[var(--text-muted)] font-medium">Language</th>
            <th className="text-left py-3 px-3 text-[var(--text-muted)] font-medium">Status</th>
            <th className="text-left py-3 px-3 text-[var(--text-muted)] font-medium">Rating</th>
            <th className="text-right py-3 px-3 text-[var(--text-muted)] font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {manga.map((m) => (
            <tr key={m.id} className="border-b hover:bg-[var(--accent-glow)] transition-colors" style={{ borderColor: 'var(--border-color)' }}>
              <td className="py-2 px-3">
                <div className="relative w-10 h-14 rounded overflow-hidden">
                  <Image
                    src={m.coverImage || '/no-cover.png'}
                    alt={m.title}
                    fill
                    className="object-cover"
                    unoptimized={true}
                  />
                </div>
              </td>
              <td className="py-2 px-3 text-[var(--text-primary)] font-medium">{m.title}</td>
              <td className="py-2 px-3">
                <Badge variant={m.language === 'en' ? 'en' : 'bn'}>{m.language.toUpperCase()}</Badge>
              </td>
              <td className="py-2 px-3">
                <Badge variant="status">{m.status}</Badge>
              </td>
              <td className="py-2 px-3 text-[var(--text-primary)]">{m.rating}</td>
              <td className="py-2 px-3">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/admin/manga/edit/${m.id}`}
                    className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--accent-glow)] transition-all"
                  >
                    <Edit size={16} />
                  </Link>
                  <button
                    onClick={() => onDelete(m)}
                    className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-red-400 hover:bg-red-400/10 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
