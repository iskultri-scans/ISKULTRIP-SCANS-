'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BookOpen, PlusCircle, Tags, LogOut, FilePlus, Megaphone, Clock, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

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

// Mobile bottom bar items (5 items max for usability)
const mobileNavItems = [
  { href: '/admin', label: 'Home', icon: LayoutDashboard },
  { href: '/admin/manga', label: 'Manga', icon: BookOpen },
  { href: '/admin/manga/add', label: 'Add', icon: PlusCircle },
  { href: '/admin/chapters', label: 'Chapter', icon: FilePlus },
  { href: '/admin/requests', label: 'Requests', icon: MessageSquare },
];

export function AdminSidebar({ onSignOut }: AdminSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || (href !== '/admin' && pathname.startsWith(href));

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
              className="flex flex-col items-center justify-center py-2.5 px-3 min-w-[56px] transition-colors"
              style={{
                color: active ? 'var(--accent)' : 'var(--text-muted)',
              }}
            >
              <item.icon size={20} />
              <span className="text-[10px] mt-0.5 leading-tight">{item.label}</span>
            </Link>
          );
        })}
        <button
          onClick={onSignOut}
          className="flex flex-col items-center justify-center py-2.5 px-3 min-w-[56px] transition-colors text-red-400"
        >
          <LogOut size={20} />
          <span className="text-[10px] mt-0.5 leading-tight">Sign Out</span>
        </button>
      </nav>
    </>
  );
}
