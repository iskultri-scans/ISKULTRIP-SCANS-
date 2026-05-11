'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, ChevronDown, Facebook, Send, Bookmark } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { MobileMenu } from './MobileMenu';
import { UserMenu } from './UserMenu';
import { useRouter } from 'next/navigation';
import { SITE_CONFIG } from '@/lib/config';
import { useBookmarks } from '@/context/BookmarkContext';

interface NavbarProps {
  genres: { name: string; slug: string }[];
}

export function Navbar({ genres }: NavbarProps) {
  const { bookmarkCount } = useBookmarks();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [genreDropdown, setGenreDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setGenreDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-30 transition-all duration-300 ${
          scrolled ? 'backdrop-blur-xl border-b shadow-lg' : ''
        }`}
        style={{
          background: scrolled ? 'var(--glass-bg)' : 'transparent',
          borderColor: 'var(--border-color)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Left: Logo */}
          <Link
            href="/"
            className="font-['Bebas_Neue'] text-2xl tracking-widest"
            style={{ color: 'var(--accent)' }}
          >
            ISKULTRIP SCANS
          </Link>

          {/* Center: Nav Links (desktop) */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">
              Home
            </Link>
            <Link href="/browse" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">
              Browse
            </Link>
            <Link href="/bookmarks" className="flex items-center gap-1.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors relative">
              <Bookmark size={14} />
              Bookmarks
              {bookmarkCount > 0 && (
                <span
                  className="ml-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-[10px] font-bold px-1"
                  style={{
                    background: 'var(--accent)',
                    color: '#0a0a0f',
                    boxShadow: '0 0 8px var(--accent-glow)',
                  }}
                >
                  {bookmarkCount}
                </span>
              )}
            </Link>
            <div className="relative" ref={dropdownRef}>
              <motion.button
                onClick={() => setGenreDropdown(!genreDropdown)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-1.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors px-2 py-1 rounded-lg hover:bg-[var(--accent-glow)]"
              >
                Genres
                <motion.span
                  animate={{ rotate: genreDropdown ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={14} />
                </motion.span>
              </motion.button>
              <AnimatePresence>
                {genreDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setGenreDropdown(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ type: 'spring', damping: 25, stiffness: 400, mass: 0.5 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-72 rounded-xl overflow-hidden shadow-2xl z-50"
                      style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        boxShadow: '0 0 30px var(--accent-glow), 0 20px 40px -12px rgba(0, 0, 0, 0.5)',
                      }}
                    >
                      {/* Top accent line */}
                      <div
                        className="h-0.5 w-full"
                        style={{
                          background: 'linear-gradient(90deg, transparent, var(--accent), transparent)',
                        }}
                      />

                      <div className="p-3">
                        <div className="flex flex-wrap gap-1.5">
                          {genres.map((genre, index) => (
                            <motion.div
                              key={genre.slug}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.02, duration: 0.15 }}
                            >
                              <Link
                                href={`/genre/${genre.slug}`}
                                onClick={() => setGenreDropdown(false)}
                                className="genre-chip text-xs inline-block"
                              >
                                {genre.name}
                              </Link>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Bottom accent line */}
                      <div
                        className="h-0.5 w-full"
                        style={{
                          background: 'linear-gradient(90deg, transparent, var(--accent), transparent)',
                          opacity: 0.5,
                        }}
                      />
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Right: Social + Search + Theme + User + Hamburger */}
          <div className="flex items-center gap-2">
            {/* Social Links */}
            <div className="hidden md:flex items-center gap-1">
              <motion.a
                href={SITE_CONFIG.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[#1877F2] hover:bg-[#1877F2]/10 transition-all"
                aria-label="Join Facebook"
              >
                <Facebook size={16} />
              </motion.a>
              <motion.a
                href={SITE_CONFIG.social.telegram}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[#0088cc] hover:bg-[#0088cc]/10 transition-all"
                aria-label="Join Telegram"
              >
                <Send size={16} />
              </motion.a>
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px h-4" style={{ background: 'var(--border-color)' }} />

            {/* Search */}
            <AnimatePresence mode="wait">
              {searchOpen ? (
                <motion.form
                  key="search-form"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleSearch}
                  className="flex items-center overflow-hidden"
                >
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search manga..."
                    className="w-40 sm:w-56 px-3 py-1.5 rounded-lg text-sm outline-none transition-all"
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--accent)',
                      color: 'var(--text-primary)',
                      boxShadow: '0 0 15px var(--accent-glow)',
                    }}
                    onBlur={() => {
                      if (!searchQuery) setSearchOpen(false);
                    }}
                  />
                </motion.form>
              ) : (
                <motion.button
                  key="search-btn"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSearchOpen(true)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--accent-glow)] transition-all"
                >
                  <Search size={18} />
                </motion.button>
              )}
            </AnimatePresence>

            <div className="hidden lg:block">
              <ThemeToggle />
            </div>

            {/* User Menu */}
            <div className="hidden lg:block">
              <UserMenu />
            </div>

            <motion.button
              onClick={() => setMobileOpen(true)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="lg:hidden p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--accent)] transition-all"
            >
              <Menu size={20} />
            </motion.button>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} genres={genres} />
    </>
  );
}
