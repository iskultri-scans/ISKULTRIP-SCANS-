'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { ToastProvider } from '@/components/ui/Toast';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';
  const { user, isAdmin, loading: authLoading } = useAuth();

  // Determine if we should show the admin panel
  const isAuthorized = !authLoading && user && isAdmin;
  const shouldRedirect = !authLoading && !isLoginPage && (!user || !isAdmin);

  // Redirect non-admins away from admin routes
  if (shouldRedirect) {
    if (!user) {
      // Not logged in → redirect to admin login
      router.push('/admin/login');
    } else {
      // Logged in but not admin → redirect to home
      router.push('/');
    }
    return null;
  }

  if (isLoginPage) {
    return <ToastProvider>{children}</ToastProvider>;
  }

  if (authLoading || !isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: 'var(--bg-primary)' }}>
        <div className="skeleton w-12 h-12 rounded-full" />
      </div>
    );
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      document.cookie = 'iskultrip-session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      router.push('/admin/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <ToastProvider>
      <div className="flex min-h-screen" style={{ background: 'var(--bg-primary)' }}>
        <AdminSidebar onSignOut={handleSignOut} />
        <div className="flex-1 overflow-auto">
          <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
            <div className="text-sm text-[var(--text-muted)]">
              Logged in as <strong className="text-[var(--text-primary)]">{user.email}</strong>
            </div>
            <ThemeToggle />
          </div>
          <div className="p-6 max-w-6xl">
            {children}
          </div>
        </div>
      </div>
    </ToastProvider>
  );
}
