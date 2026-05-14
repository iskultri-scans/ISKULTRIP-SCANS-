'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BookOpen, PlusCircle, Tags, LogOut, FilePlus, Megaphone, Clock, MessageSquare, MoreHorizontal, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminSidebarProps {
  onSignOut?: () => void;
}

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/manga', label: 'All Manga', icon: BookOpen },
  { href: '/admin/manga/add', label: 'Add Manga', icon: PlusCircle },
  { href: '/admin/chapters', label: 'Post Chapter', icon: FilePlus },
  { href: '/admin/genres', label: 'Genres', icon: Tags },
  { href: '/admin/blog', label: 'Blog / Announcements', icon: Megaphone },
  { href: '/admin/upcoming', label: 'Upcoming Releases', icon: Clock },
  { href: '/admin/requests', label: 'User Requests', icon: MessageSquare },
];

// Mobile bottom bar items (main actions)
const mobileNavItems = [
  { href: '/admin', label: 'Home', icon: LayoutDashboard },
  { href: '/admin/manga', label: 'Manga', icon: BookOpen },
  { href: '/admin/manga/add', label: 'Add', icon: PlusCircle },
  { href: '/admin/blog', label: 'Blog', icon: Megaphone },
  { href: '/admin/chapters', label: 'Chapter', icon: FilePlus },
];

// Items accessible via "More" menu on mobile
const moreNavItems = [
  { href: '/admin/genres', label: 'Genres', icon: Tags },
  { href: '/admin/upcoming', label: 'Upcoming', icon: Clock },
  { href: '/admin/requests', label: 'Requests', icon: MessageSquare },
];

export function AdminSidebar({ onSignOut }: AdminSidebarProps) {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || (href !== '/admin' && pathname.startsWith(href));

  // Check if any "more" item is active
  const isMoreActive = moreNavItems.some((item) => isActive(item.href));

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:flex w-64 h-screen sticky top-0 flex-col border-r"
        style={{
          background: 'var(--bg-secondary)',
          borderColor: 'var(--border-color)',
        }}
      >
        <div className="p-6 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <Link href="/admin" className="font-['Bebas_Neue'] text-xl tracking-widest" style={{ color: 'var(--accent)' }}>
            ISKULTRIP SCANS
          </Link>
          <p className="text-xs text-[var(--text-muted)] mt-1">Admin Panel</p>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'admin-nav-item flex items-center gap-3 text-sm',
                  active && 'active'
                )}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
          <button
            onClick={onSignOut}
            className="admin-nav-item flex items-center gap-3 text-sm w-full text-left text-red-400 hover:text-red-300 hover:bg-red-400/10"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t"
        style={{
          background: 'var(--bg-secondary)',
          borderColor: 'var(--border-color)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
      >
        {mobileNavItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center py-2.5 px-2 min-w-[48px] transition-colors"
              style={{
                color: active ? 'var(--accent)' : 'var(--text-muted)',
              }}
            >
              <item.icon size={18} />
              <span className="text-[9px] mt-0.5 leading-tight">{item.label}</span>
            </Link>
          );
        })}
        {/* More button */}
        <button
          onClick={() => setMoreOpen(!moreOpen)}
          className="flex flex-col items-center justify-center py-2.5 px-2 min-w-[48px] transition-colors"
          style={{
            color: isMoreActive ? 'var(--accent)' : 'var(--text-muted)',
          }}
        >
          {moreOpen ? <X size={18} /> : <MoreHorizontal size={18} />}
          <span className="text-[9px] mt-0.5 leading-tight">{moreOpen ? 'Close' : 'More'}</span>
        </button>
      </nav>

      {/* Mobile More Menu Overlay */}
      <AnimatePresence>
        {moreOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-40 bg-black/50"
              onClick={() => setMoreOpen(false)}
            />
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="lg:hidden fixed bottom-14 left-3 right-3 z-50 rounded-xl overflow-hidden"
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                boxShadow: '0 -10px 40px rgba(0,0,0,0.5), 0 0 20px var(--accent-glow)',
                paddingBottom: 'env(safe-area-inset-bottom, 0px)',
              }}
            >
              {/* Top accent line */}
              <div
                className="h-0.5 w-full"
                style={{
                  background: 'linear-gradient(90deg, transparent, var(--accent), transparent)',
                }}
              />

              <div className="p-3 space-y-1">
                {moreNavItems.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMoreOpen(false)}
                      className={cn(
                        'admin-nav-item flex items-center gap-3 text-sm',
                        active && 'active'
                      )}
                    >
                      <item.icon size={16} />
                      {item.label}
                    </Link>
                  );
                })}

                {/* Sign Out in More menu */}
                <div className="pt-2 border-t" style={{ borderColor: 'var(--border-color)' }}>
                  <button
                    onClick={() => { setMoreOpen(false); onSignOut?.(); }}
                    className="admin-nav-item flex items-center gap-3 text-sm w-full text-left text-red-400 hover:text-red-300 hover:bg-red-400/10"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
