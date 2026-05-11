'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Facebook, MessageCircle, Copy, Check, Send, Share2 } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/config';

interface ShareButtonsProps {
  title: string;
  slug: string;
  description?: string;
  coverImage?: string;
}

export function ShareButtons({ title, slug, description, coverImage }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const pageUrl = `${SITE_CONFIG.url}/manga/${slug}`;

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

  const shareTelegram = () => {
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(title + (description ? '\n\n' + description.slice(0, 200) : ''))}`,
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

  // Native share API for mobile
  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description || `Read ${title} on ISKULTRIP SCANS`,
          url: pageUrl,
        });
      } catch {
        // User cancelled
      }
    } else {
      setShowMore(!showMore);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-[var(--text-secondary)]">Share:</span>

        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={shareFacebook}
          className="p-2.5 rounded-xl text-[var(--text-secondary)] hover:text-blue-400 hover:bg-blue-400/10 transition-all"
          aria-label="Share on Facebook"
        >
          <Facebook size={18} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={shareWhatsApp}
          className="p-2.5 rounded-xl text-[var(--text-secondary)] hover:text-emerald-400 hover:bg-emerald-400/10 transition-all"
          aria-label="Share on WhatsApp"
        >
          <MessageCircle size={18} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={shareTelegram}
          className="p-2.5 rounded-xl text-[var(--text-secondary)] hover:text-sky-400 hover:bg-sky-400/10 transition-all"
          aria-label="Share on Telegram"
        >
          <Send size={18} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={copyLink}
          className="p-2.5 rounded-xl text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--accent-glow)] transition-all"
          aria-label="Copy link"
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.div
                key="check"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
              >
                <Check size={18} className="text-emerald-400" />
              </motion.div>
            ) : (
              <motion.div
                key="copy"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Copy size={18} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={nativeShare}
          className="p-2.5 rounded-xl text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--accent-glow)] transition-all"
          aria-label="More sharing options"
        >
          <Share2 size={18} />
        </motion.button>
      </div>
    </div>
  );
}
