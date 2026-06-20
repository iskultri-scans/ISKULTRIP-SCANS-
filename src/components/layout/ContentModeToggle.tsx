'use client';

/**
 * ContentModeToggle — Adult/Family mode switcher button
 *
 * Navbar-এ বসানো হবে। Family mode-এ চোখ বন্ধ আইকন, Adult mode-ে চোখ খোলা আইকন দেখাবে।
 * Click করলে toggle হবে। Adult mode-ে যাওয়ার সময় age verification modal আসবে।
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Shield, ShieldCheck, ChevronDown } from 'lucide-react';
import { useContentMode, type ContentMode } from '@/context/ContentModeContext';

export function ContentModeToggle() {
  const { mode, setMode, isAgeVerified } = useContentMode();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isFamily = mode === 'family';

  const options: { value: ContentMode; label: string; labelBn: string; icon: React.ReactNode; available: boolean }[] = [
    {
      value: 'family',
      label: 'Family Mode',
      labelBn: 'ফ্যামিলি মোড',
      icon: <ShieldCheck size={14} className="text-emerald-400" />,
      available: true,
    },
    {
      value: 'adult',
      label: 'Adult Mode (18+)',
      labelBn: 'অ্যাডাল্ট মোড',
      icon: <Shield size={14} className="text-red-400" />,
      available: true,
    },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-all"
        style={{
          background: isFamily ? 'var(--bg-secondary)' : 'rgba(239, 68, 68, 0.1)',
          border: `1px solid ${isFamily ? 'var(--border-color)' : 'rgba(239, 68, 68, 0.3)'}`,
          color: isFamily ? 'var(--text-secondary)' : '#ef4444',
        }}
        aria-label={`Content mode: ${mode}`}
        title={`বর্তমান মোড: ${isFamily ? 'Family' : 'Adult'}`}
      >
        {isFamily ? <EyeOff size={14} /> : <Eye size={14} />}
        <span className="hidden sm:inline">
          {isFamily ? 'Family' : 'Adult'}
        </span>
        {!isFamily && (
          <span
            className="ml-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold"
            style={{ background: '#ef4444', color: '#fff' }}
          >
            18+
          </span>
        )}
        <ChevronDown size={12} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ type: 'spring', damping: 25, stiffness: 400 }}
            className="absolute top-full right-0 mt-2 w-56 rounded-xl overflow-hidden shadow-2xl z-50"
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              boxShadow: '0 0 30px var(--accent-glow), 0 20px 40px -12px rgba(0, 0, 0, 0.5)',
            }}
          >
            <div className="h-0.5 w-full" style={{ background: 'linear-gradient(90deg, transparent, var(--accent), transparent)' }} />

            <div className="p-2">
              <p className="text-[10px] uppercase tracking-wide text-[var(--text-muted)] px-2 py-1.5">
                কনটেন্ট মোড নির্বাচন করুন
              </p>

              {options.map((opt) => {
                const active = mode === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setMode(opt.value);
                      setOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all hover:bg-[var(--accent-glow)]"
                    style={{
                      background: active ? 'var(--accent-glow)' : 'transparent',
                    }}
                  >
                    <span className="flex-shrink-0">{opt.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-xs font-semibold truncate"
                        style={{ color: active ? 'var(--accent)' : 'var(--text-primary)' }}
                      >
                        {opt.labelBn}
                      </p>
                      <p className="text-[10px] text-[var(--text-muted)] truncate">
                        {opt.label}
                      </p>
                    </div>
                    {active && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 rounded-full"
                        style={{ background: 'var(--accent)' }}
                      />
                    )}
                  </button>
                );
              })}

              {/* Status info */}
              <div
                className="mt-2 p-2.5 rounded-lg text-[10px] text-[var(--text-muted)] leading-relaxed"
                style={{ background: 'var(--bg-primary)' }}
              >
                {isFamily ? (
                  <>👀 18+ কনটেন্ট লুকানো আছে। সবার জন্য নিরাপদ।</>
                ) : (
                  <>🔞 18+ কনটেন্ট দেখা যাচ্ছে। সাবধানে ব্যবহার করুন।</>
                )}
              </div>
            </div>

            <div
              className="h-0.5 w-full"
              style={{ background: 'linear-gradient(90deg, transparent, var(--accent), transparent)', opacity: 0.5 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
