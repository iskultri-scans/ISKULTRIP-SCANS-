import React from 'react';
import Link from 'next/link';
import { Facebook, Send, Heart } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/config';

interface FooterProps {
  genres: { name: string; slug: string }[];
}

export function Footer({ genres }: FooterProps) {
  return (
    <footer
      className="mt-auto border-t"
      style={{
        background: 'var(--bg-secondary)',
        borderColor: 'var(--border-color)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h2 className="font-['Bebas_Neue'] text-2xl tracking-widest mb-2" style={{ color: 'var(--accent)' }}>
              {SITE_CONFIG.name}
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mb-4">{SITE_CONFIG.description}</p>

            {/* Social Join Buttons */}
            <div className="flex gap-2">
              <a
                href={SITE_CONFIG.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #1877F2, #0d5bbd)',
                  color: '#ffffff',
                  boxShadow: '0 2px 10px rgba(24, 119, 242, 0.3)',
                }}
              >
                <Facebook size={14} />
                Join Facebook
              </a>
              <a
                href={SITE_CONFIG.social.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #0088cc, #006699)',
                  color: '#ffffff',
                  boxShadow: '0 2px 10px rgba(0, 136, 204, 0.3)',
                }}
              >
                <Send size={14} />
                Join Telegram
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3 uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">Home</Link></li>
              <li><Link href="/browse" className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">Browse</Link></li>
              <li><Link href="/search" className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">Search</Link></li>
              <li><Link href="/dmca" className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">DMCA</Link></li>
            </ul>
          </div>

          {/* Popular Genres */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3 uppercase tracking-wider">Popular Genres</h3>
            <div className="flex flex-wrap gap-1.5">
              {genres.slice(0, 8).map((genre) => (
                <Link
                  key={genre.slug}
                  href={`/genre/${genre.slug}`}
                  className="genre-chip text-xs"
                >
                  {genre.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3 uppercase tracking-wider">Community</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-3">
              Join our community for latest updates, discussions, and new releases!
            </p>
            <div className="space-y-2">
              <a
                href={SITE_CONFIG.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[#1877F2] transition-colors"
              >
                <Facebook size={14} />
                Facebook Group
              </a>
              <a
                href={SITE_CONFIG.social.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[#0088cc] transition-colors"
              >
                <Send size={14} />
                Telegram Channel
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="mt-8 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <p className="text-xs text-[var(--text-muted)]">
            &copy; {new Date().getFullYear()} {SITE_CONFIG.name} | Created by {SITE_CONFIG.creator}
          </p>
          <div className="flex items-center gap-4">
            <Link href="/dmca" className="text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">
              DMCA
            </Link>
            <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
              Made with <Heart size={10} className="text-red-400 fill-red-400" /> by {SITE_CONFIG.creator}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
