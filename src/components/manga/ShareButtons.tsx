'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Facebook, MessageCircle, Copy, Check, Send, Share2, Link as LinkIcon } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/config';

interface ShareButtonsProps {
  title: string;
  slug: string;
  description?: string;
  coverImage?: string;
}

export function ShareButtons({ title, slug, description, coverImage }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [showUrlField, setShowUrlField] = useState(false);
  const pageUrl = `${SITE_CONFIG.url}/manga/${slug}`;

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setTimeout(() => setToastMsg(''), 3000);
  };

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

  // Copy link with fallback for mobile browsers
  const copyLink = async () => {
    try {
      // Try modern Clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(pageUrl);
        setCopied(true);
        showToast('লিংক কপি হয়েছে!', 'success');
        setTimeout(() => setCopied(false), 2000);
        return;
      }
    } catch {
      // Clipboard API failed, try fallback
    }

    // Fallback: use execCommand('copy') for older/mobile browsers
    try {
      const textArea = document.createElement('textarea');
      textArea.value = pageUrl;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      textArea.style.top = '-9999px';
      textArea.setAttribute('readonly', '');
      document.body.appendChild(textArea);
      textArea.select();
      textArea.setSelectionRange(0, pageUrl.length);
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);

      if (successful) {
        setCopied(true);
        showToast('লিংক কপি হয়েছে!', 'success');
        setTimeout(() => setCopied(false), 2000);
      } else {
        // Show URL field for manual copy
        setShowUrlField(true);
        showToast('কপি করতে সমস্যা হয়েছে। নিচের লিংক ম্যানুয়ালি কপি করুন।', 'error');
      }
    } catch {
      setShowUrlField(true);
      showToast('কপি করতে সমস্যা হয়েছে। নিচের লিংক ম্যানুয়ালি কপি করুন।', 'error');
    }
  };

  // Native share API for mobile - prioritized on mobile devices
  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description || `${title} পড়ুন ISKULTRIP SCANS-এ`,
          url: pageUrl,
        });
        showToast('শেয়ার সফল!', 'success');
      } catch (err) {
        // User cancelled or error - do nothing
        if ((err as DOMException).name !== 'AbortError') {
          setShowUrlField(true);
        }
      }
    } else {
      setShowUrlField(!showUrlField);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-medium text-[var(--text-secondary)]">Share:</span>

        {/* Native Share button - shown on mobile devices that support it */}
        {typeof navigator !== 'undefined' && navigator.share && (
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={nativeShare}
            className="p-2.5 rounded-xl text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--accent-glow)] transition-all"
            aria-label="Share via native menu"
          >
            <Share2 size={18} />
          </motion.button>
        )}

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

        {/* More share options button - only shown on desktop where native share is not available */}
        {typeof navigator !== 'undefined' && !navigator.share && (
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={nativeShare}
            className="p-2.5 rounded-xl text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--accent-glow)] transition-all"
            aria-label="More sharing options"
          >
            <Share2 size={18} />
          </motion.button>
        )}
      </div>

      {/* Read-only URL input field for manual copy */}
      <AnimatePresence>
        {showUrlField && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-2 p-2 rounded-lg" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
              <LinkIcon size={14} className="text-[var(--text-muted)] flex-shrink-0" />
              <input
                type="text"
                readOnly
                value={pageUrl}
                onClick={(e) => (e.target as HTMLInputElement).select()}
                className="flex-1 bg-transparent text-xs text-[var(--text-secondary)] outline-none min-w-0"
                style={{ caretColor: 'transparent' }}
              />
              <button
                onClick={() => {
                  const input = document.querySelector('input[readonly]') as HTMLInputElement;
                  if (input) {
                    input.select();
                    document.execCommand('copy');
                    setCopied(true);
                    showToast('লিংক কপি হয়েছে!', 'success');
                    setTimeout(() => setCopied(false), 2000);
                  }
                }}
                className="text-xs px-2 py-1 rounded-md text-[var(--accent)] hover:bg-[var(--accent-glow)] transition-colors flex-shrink-0"
              >
                Copy
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={`text-xs px-3 py-2 rounded-lg ${
              toastType === 'success'
                ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20'
                : 'bg-red-400/10 text-red-400 border border-red-400/20'
            }`}
          >
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
