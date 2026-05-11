'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { X, Home, BookOpen, Tag, Search, Shield } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  genres: { name: string; slug: string }[];
}

export function MobileMenu({ isOpen, onClose, genres }: MobileMenuProps) {
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

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-72 transform transition-transform duration-300 lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          background: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border-color)',
        }}
      >
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <Link href="/" onClick={onClose} className="font-['Bebas_Neue'] text-2xl tracking-wider" style={{ color: 'var(--accent)' }}>
            ISKULTRIP SCANS
          </Link>
          <button onClick={onClose} className="p-1 text-[var(--text-secondary)]">
            <X size={20} />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          <Link href="/" onClick={onClose} className="flex items-center gap-3 px-3 py-3 rounded-lg text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--accent-glow)] transition-all">
            <Home size={18} /> Home
          </Link>
          <Link href="/browse" onClick={onClose} className="flex items-center gap-3 px-3 py-3 rounded-lg text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--accent-glow)] transition-all">
            <BookOpen size={18} /> Browse
          </Link>
          <Link href="/search" onClick={onClose} className="flex items-center gap-3 px-3 py-3 rounded-lg text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--accent-glow)] transition-all">
            <Search size={18} /> Search
          </Link>

          <div className="pt-3 pb-1">
            <span className="flex items-center gap-2 px-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              <Tag size={14} /> Genres
            </span>
          </div>
          <div className="max-h-60 overflow-y-auto no-scrollbar space-y-0.5">
            {genres.map((genre) => (
              <Link
                key={genre.slug}
                href={`/genre/${genre.slug}`}
                onClick={onClose}
                className="block px-3 py-2 rounded-lg text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--accent-glow)] transition-all"
              >
                {genre.name}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <Link href="/admin" onClick={onClose} className="flex items-center gap-3 px-3 py-3 rounded-lg text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--accent-glow)] transition-all">
              <Shield size={18} /> Admin
            </Link>
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--text-muted)]">Theme</span>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </>
  );
}
