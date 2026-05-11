'use client';

import React, { useState } from 'react';
import { Facebook, MessageCircle, Copy, Check } from 'lucide-react';

interface ShareButtonsProps {
  title: string;
  slug: string;
}

export function ShareButtons({ title, slug }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const pageUrl = `https://iskultrip.com/manga/${slug}`;

  const shareFacebook = () => {
    window.open(
      `https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const shareWhatsApp = () => {
    window.open(
      `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' — ' + pageUrl)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-[var(--text-secondary)]">Share:</span>
      <button
        onClick={shareFacebook}
        className="p-2.5 rounded-lg text-[var(--text-secondary)] hover:text-blue-400 hover:bg-blue-400/10 transition-all"
        aria-label="Share on Facebook"
      >
        <Facebook size={18} />
      </button>
      <button
        onClick={shareWhatsApp}
        className="p-2.5 rounded-lg text-[var(--text-secondary)] hover:text-emerald-400 hover:bg-emerald-400/10 transition-all"
        aria-label="Share on WhatsApp"
      >
        <MessageCircle size={18} />
      </button>
      <button
        onClick={copyLink}
        className="p-2.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--accent-glow)] transition-all"
        aria-label="Copy link"
      >
        {copied ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
      </button>
    </div>
  );
}
