'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ScrollToTop } from '@/components/layout/ScrollToTop';
import { useTheme } from '@/context/ThemeContext';

interface PublicLayoutProps {
  children: React.ReactNode;
  genres: { name: string; slug: string }[];
}

export function PublicLayout({ children, genres }: PublicLayoutProps) {
  return (
    <>
      <Navbar genres={genres} />
      <main className="flex-1">{children}</main>
      <Footer genres={genres} />
      <ScrollToTop />
    </>
  );
}
