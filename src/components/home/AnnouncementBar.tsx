'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Megaphone, Calendar, Zap, ChevronRight } from 'lucide-react';
import type { Announcement } from '@/lib/firestore';

interface AnnouncementBarProps {
  announcements: Announcement[];
  loading?: boolean;
}

const typeConfig = {
  announcement: { icon: Megaphone, emoji: '📢', label: 'Update', color: '#00d4ff' },
  upcoming: { icon: Calendar, emoji: '📅', label: 'Upcoming', color: '#f59e0b' },
  update: { icon: Zap, emoji: '🔥', label: 'New', color: '#10b981' },
};

export function AnnouncementBar({ announcements, loading = false }: AnnouncementBarProps) {
  if (loading) {
    return (
      <div className="py-4">
        <div className="flex gap-3 overflow-x-auto no-scrollbar">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-10 w-64 rounded-lg flex-shrink-0" />
          ))}
        </div>
      </div>
    );
  }

  if (announcements.length === 0) return null;

  return (
    <div className="py-4">
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
        {announcements.map((announcement, index) => {
          const config = typeConfig[announcement.type] || typeConfig.announcement;
          return (
            <motion.div
              key={announcement.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08, duration: 0.3 }}
            >
              <Link
                href={`/blog/${announcement.id}`}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all hover:scale-[1.02] group"
                style={{
                  background: 'var(--glass-bg)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid var(--border-color)',
                }}
              >
                <span className="text-sm">{config.emoji}</span>
                <span
                  className="text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded-md"
                  style={{
                    background: `${config.color}20`,
                    color: config.color,
                  }}
                >
                  {config.label}
                </span>
                <span className="text-sm text-[var(--text-primary)] font-medium max-w-[200px] truncate">
                  {announcement.titleBn || announcement.title}
                </span>
                <ChevronRight
                  size={14}
                  className="text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors flex-shrink-0"
                />
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
