'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BookOpen, PlusCircle, Tags, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminSidebarProps {
  onSignOut?: () => void;
}

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/manga', label: 'All Manga', icon: BookOpen },
  { href: '/admin/manga/add', label: 'Add Manga', icon: PlusCircle },
  { href: '/admin/genres', label: 'Genres', icon: Tags },
];

export function AdminSidebar({ onSignOut }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className="w-64 h-screen sticky top-0 flex flex-col border-r"
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

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'admin-nav-item flex items-center gap-3 text-sm',
                isActive && 'active'
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
  );
}
