'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { ToastProvider } from '@/components/ui/Toast';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(!isLoginPage);

  useEffect(() => {
    if (isLoginPage) return;

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'mdhasan@example.com';
        if (user.email === adminEmail) {
          setAuthenticated(true);
          setChecking(false);
        } else {
          setAuthenticated(false);
          setChecking(false);
          router.push('/admin/login');
        }
      } else {
        setAuthenticated(false);
        setChecking(false);
        router.push('/admin/login');
      }
    });

    return () => unsubscribe();
  }, [isLoginPage, router]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      document.cookie = 'iskultrip-session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      router.push('/admin/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (isLoginPage) {
    return <ToastProvider>{children}</ToastProvider>;
  }

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: 'var(--bg-primary)' }}>
        <div className="skeleton w-12 h-12 rounded-full" />
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return (
    <ToastProvider>
      <div className="flex min-h-screen" style={{ background: 'var(--bg-primary)' }}>
        <AdminSidebar onSignOut={handleSignOut} />
        <div className="flex-1 overflow-auto">
          <div className="flex items-center justify-end p-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
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
