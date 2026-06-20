'use client';

/**
 * AdultBadge — 18+ badge for adult content
 *
 * MangaCard, MangaDetail এবং ChapterList-এ ব্যবহার করা যাবে।
 */

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';

interface AdultBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'badge' | 'banner';
  showIcon?: boolean;
}

export function AdultBadge({ size = 'sm', variant = 'badge', showIcon = true }: AdultBadgeProps) {
  const sizeClasses = {
    sm: 'text-[9px] px-1.5 py-0.5 gap-0.5',
    md: 'text-[11px] px-2 py-1 gap-1',
    lg: 'text-xs px-2.5 py-1.5 gap-1',
  };

  const iconSize = {
    sm: 9,
    md: 12,
    lg: 14,
  };

  if (variant === 'banner') {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold"
        style={{
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          color: '#ef4444',
        }}
      >
        {showIcon && <ShieldAlert size={14} />}
        <span>১৮+ Adult Content</span>
      </motion.div>
    );
  }

  return (
    <span
      className={`inline-flex items-center font-bold rounded-md ${sizeClasses[size]}`}
      style={{
        background: 'rgba(239, 68, 68, 0.15)',
        border: '1px solid rgba(239, 68, 68, 0.4)',
        color: '#ef4444',
      }}
      title="১৮+ Adult Content"
    >
      {showIcon && <ShieldAlert size={iconSize[size]} />}
      <span>18+</span>
    </span>
  );
}
