import React from 'react';
import Link from 'next/link';

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h2 className="font-['Bebas_Neue'] text-2xl tracking-widest mb-2" style={{ color: 'var(--accent)' }}>
              ISKULTRIP SCANS
            </h2>
            <p className="text-sm text-[var(--text-secondary)]">Your gateway to manga.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3 uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">Home</Link></li>
              <li><Link href="/browse" className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">Browse</Link></li>
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
        </div>

        {/* Bottom Bar */}
        <div
          className="mt-8 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-2"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <p className="text-xs text-[var(--text-muted)]">
            &copy; 2026 ISKULTRIP SCANS | Created by MD MEHADI HASAN
          </p>
          <Link href="/dmca" className="text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">
            DMCA
          </Link>
        </div>
      </div>
    </footer>
  );
}
