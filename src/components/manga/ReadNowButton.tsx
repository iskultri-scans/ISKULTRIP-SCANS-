'use client';

import React from 'react';
import { ExternalLink } from 'lucide-react';

interface ReadNowButtonProps {
  readLink: string | null | undefined;
}

export function ReadNowButton({ readLink }: ReadNowButtonProps) {
  const handleClick = () => {
    if (readLink) {
      window.open(readLink, '_blank', 'noopener,noreferrer');
    }
  };

  if (!readLink) {
    return (
      <div className="relative group inline-block">
        <button disabled className="read-now-btn cursor-not-allowed flex items-center gap-2">
          <ExternalLink size={20} />
          READ NOW
        </button>
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}
        >
          Reading link not available
        </div>
      </div>
    );
  }

  return (
    <button onClick={handleClick} className="read-now-btn flex items-center gap-2">
      <ExternalLink size={20} />
      READ NOW
    </button>
  );
}
