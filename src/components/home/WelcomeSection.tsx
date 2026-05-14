'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function WelcomeSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <section className="pt-4 sm:pt-8 pb-2 sm:pb-4">
      <div className="relative text-center">
        {/* Animated background glow */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[600px] h-[150px] sm:h-[300px] rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: 'var(--accent)' }}
          animate={{
            opacity: [0.15, 0.25, 0.15],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Accent lines */}
        <motion.div
          className="mx-auto mb-3 sm:mb-6 h-[2px] w-0"
          style={{ background: 'linear-gradient(90deg, transparent, var(--accent), transparent)' }}
          animate={{ width: ['0%', '60%', '60%'] }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />

        {/* Bengali Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-['Bebas_Neue'] text-2xl sm:text-4xl md:text-6xl lg:text-7xl tracking-wide mb-2 sm:mb-3"
          style={{ color: 'var(--accent)' }}
        >
          বাংলায় মাঙ্গা অনুবাদের সেরা ঠিকানা
        </motion.h1>

        {/* English Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-[var(--text-secondary)] text-sm sm:text-base md:text-xl max-w-2xl mx-auto mb-1 sm:mb-2"
        >
          ISKULTRIP SCANS — বাংলা মাঙ্গা পড়ুন, আবিষ্কার করুন নতুন সিরিজ
        </motion.p>

        {/* Bengali Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-[var(--text-muted)] text-xs sm:text-sm mb-4 sm:mb-8"
        >
          <Sparkles size={14} className="inline mr-1 text-[var(--accent)]" />
          সেরা বাংলা মাঙ্গা অনুবাদ এখানে — Read manga in Bengali
        </motion.p>

        {/* Search Bar */}
        <motion.form
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="max-w-lg mx-auto relative"
        >
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="মাঙ্গা খুঁজুন... Search manga..."
              className="w-full pl-12 pr-4 py-3.5 rounded-xl text-sm outline-none transition-all"
              style={{
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(12px)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                boxShadow: '0 0 20px var(--accent-glow)',
              }}
            />
          </div>
        </motion.form>

        {/* Bottom accent line */}
        <motion.div
          className="mx-auto mt-3 sm:mt-6 h-[2px] w-0"
          style={{ background: 'linear-gradient(90deg, transparent, var(--accent), transparent)' }}
          animate={{ width: ['0%', '40%', '40%'] }}
          transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
        />
      </div>
    </section>
  );
}
