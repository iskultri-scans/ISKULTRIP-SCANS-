'use client';

import React from 'react';
import { BookOpen, Globe, Clock, CheckCircle } from 'lucide-react';

interface StatsCardsProps {
  stats: {
    total: number;
    en: number;
    bn: number;
    ongoing: number;
    completed: number;
  };
}

type StatKey = 'total' | 'en' | 'bn' | 'ongoing' | 'completed';

const cards: { key: StatKey; label: string; icon: React.ComponentType<{ size?: number; className?: string }>; color: string }[] = [
  { key: 'total', label: 'Total Manga', icon: BookOpen, color: 'text-[var(--accent)]' },
  { key: 'en', label: 'EN Manga', icon: Globe, color: 'text-emerald-400' },
  { key: 'bn', label: 'BN Manga', icon: Globe, color: 'text-amber-400' },
  { key: 'ongoing', label: 'Ongoing', icon: Clock, color: 'text-blue-400' },
  { key: 'completed', label: 'Completed', icon: CheckCircle, color: 'text-emerald-400' },
];

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.key}
            className="rounded-xl p-4 transition-all hover:scale-105"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon size={18} className={card.color} />
              <span className="text-xs text-[var(--text-muted)] font-medium">{card.label}</span>
            </div>
            <p className="text-2xl font-bold text-[var(--text-primary)]">
              {stats[card.key]}
            </p>
          </div>
        );
      })}
    </div>
  );
}
