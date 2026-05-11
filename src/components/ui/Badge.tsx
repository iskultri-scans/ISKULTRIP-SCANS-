'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'accent' | 'en' | 'bn' | 'status';
}

const variantStyles: Record<string, string> = {
  default: 'bg-gray-500/20 text-gray-300',
  accent: 'bg-[var(--accent-glow)] text-[var(--accent)] border border-[var(--accent)]/30',
  en: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
  bn: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
  status: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
};

export function Badge({ variant = 'default', className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
