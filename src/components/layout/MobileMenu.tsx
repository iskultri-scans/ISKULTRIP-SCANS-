'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Home, BookOpen, Tag, Search, Shield, LogIn, LogOut } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '@/context/AuthContext';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  genres: { name: string; slug: string }[];
}

export function MobileMenu({ isOpen, onClose, genres }: MobileMenuProps) {
  const { user, isAdmin, signOut } = useAuth();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const menuItems = [
    { href: '/', icon: <Home size={18} />, label: 'Home' },
    { href: '/browse', icon: <BookOpen size={18} />, label: 'Browse' },
    { href: '/search', icon: <Search size={18} />, label: 'Search' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 left-0 z-50 h-full w-72 lg:hidden"
            style={{
              background: 'var(--bg-secondary)',
              borderRight: '1px solid var(--border-color)',
              boxShadow: '10px 0 40px rgba(0, 0, 0, 0.5), 5px 0 20px var(--accent-glow)',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between p-4 border-b"
              style={{ borderColor: 'var(--border-color)' }}
            >
              <Link href="/" onClick={onClose} className="font-['Bebas_Neue'] text-2xl tracking-wider" style={{ color: 'var(--accent)' }}>
                ISKULTRIP SCANS
              </Link>
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--accent-glow)] transition-all"
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* Top accent line */}
            <div
              className="h-0.5 w-full"
              style={{
                background: 'linear-gradient(90deg, var(--accent), transparent)',
              }}
            />

            <nav className="p-4 space-y-1 overflow-y-auto no-scrollbar" style={{ maxHeight: 'calc(100vh - 140px)' }}>
              {/* Main nav items */}
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + index * 0.05, duration: 0.2 }}
                >
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="flex items-center gap-3 px-3 py-3 rounded-lg text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--accent-glow)] transition-all group"
                  >
                    <motion.span
                      whileHover={{ scale: 1.2 }}
                      className="text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors"
                    >
                      {item.icon}
                    </motion.span>
                    {item.label}
                  </Link>
                </motion.div>
              ))}

              {/* Genres section */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.2 }}
                className="pt-3 pb-1"
              >
                <span className="flex items-center gap-2 px-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  <Tag size={14} /> Genres
                </span>
              </motion.div>
              <div className="max-h-60 overflow-y-auto no-scrollbar space-y-0.5">
                {genres.map((genre, index) => (
                  <motion.div
                    key={genre.slug}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 + index * 0.02, duration: 0.15 }}
                  >
                    <Link
                      href={`/genre/${genre.slug}`}
                      onClick={onClose}
                      className="block px-3 py-2 rounded-lg text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--accent-glow)] transition-all"
                    >
                      {genre.name}
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Admin link - only for admins */}
              {user && isAdmin && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.2 }}
                  className="pt-3 border-t"
                  style={{ borderColor: 'var(--border-color)' }}
                >
                  <Link
                    href="/admin"
                    onClick={onClose}
                    className="flex items-center gap-3 px-3 py-3 rounded-lg text-[var(--accent)] hover:bg-[var(--accent-glow)] transition-all"
                  >
                    <Shield size={18} /> Admin Panel
                  </Link>
                </motion.div>
              )}

              {/* Auth section */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35, duration: 0.2 }}
                className="pt-3 border-t"
                style={{ borderColor: 'var(--border-color)' }}
              >
                {user ? (
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium text-[var(--text-primary)] truncate">{user.displayName || user.email}</p>
                    <motion.button
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={async () => { await signOut(); onClose(); }}
                      className="flex items-center gap-2 mt-2 text-sm text-red-400 hover:text-red-300 transition-colors"
                    >
                      <LogOut size={14} /> Sign Out
                    </motion.button>
                  </div>
                ) : (
                  <Link href="/login" onClick={onClose} className="flex items-center gap-3 px-3 py-3 rounded-lg text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--accent-glow)] transition-all">
                    <LogIn size={18} /> Login / Sign Up
                  </Link>
                )}
              </motion.div>
            </nav>

            <div className="absolute bottom-0 left-0 right-0 p-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--text-muted)]">Theme</span>
                <ThemeToggle />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
