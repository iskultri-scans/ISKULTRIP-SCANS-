'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, Menu, ChevronDown } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { MobileMenu } from './MobileMenu';
import { useRouter } from 'next/navigation';

interface NavbarProps {
  genres: { name: string; slug: string }[];
}

export function Navbar({ genres }: NavbarProps) {
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
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setGenreDropdown(!genreDropdown)}
                className="flex items-center gap-1 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
              >
                Genres <ChevronDown size={14} className={`transition-transform ${genreDropdown ? 'rotate-180' : ''}`} />
              </button>
              {genreDropdown && (
                <div
                  className="absolute top-full left-0 mt-2 w-64 rounded-xl p-3 shadow-xl z-50"
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <div className="flex flex-wrap gap-1.5">
                    {genres.map((genre) => (
                      <Link
                        key={genre.slug}
                        href={`/genre/${genre.slug}`}
                        onClick={() => setGenreDropdown(false)}
                        className="genre-chip text-xs"
                      >
                        {genre.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Right: Search + Theme + Hamburger */}
          <div className="flex items-center gap-2">
            {/* Search */}
            {searchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center">
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
                  }}
                  onBlur={() => {
                    if (!searchQuery) setSearchOpen(false);
                  }}
                />
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--accent-glow)] transition-all"
              >
                <Search size={18} />
              </button>
            )}

            <div className="hidden lg:block">
              <ThemeToggle />
            </div>

            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--accent)] transition-all"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} genres={genres} />
    </>
  );
}
