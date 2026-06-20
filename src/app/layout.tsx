import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { BookmarkProvider } from '@/context/BookmarkContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { ContentModeProvider } from '@/context/ContentModeContext';
import { ToastProvider } from '@/components/ui/Toast';
import { PWAInstallPrompt } from '@/components/layout/PWAInstallPrompt';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://iskultrip-scans.vercel.app';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0f' },
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'ISKULTRIP SCANS — বাংলায় মাঙ্গা পড়ুন | Read Manga in Bengali',
  description: 'বাংলা মাঙ্গা অনুবাদের সেরা ঠিকানা। Browse, discover, and read manga in Bengali. ISKULTRIP SCANS by MD MEHADI HASAN.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'ISKULTRIP',
  },
  openGraph: {
    title: 'ISKULTRIP SCANS — বাংলায় মাঙ্গা পড়ুন',
    description: 'বাংলা মাঙ্গা অনুবাদের সেরা ঠিকানা। Your gateway to manga in Bengali.',
    url: SITE_URL,
    type: 'website',
    siteName: 'ISKULTRIP SCANS',
    images: [
      {
        url: '/og-default.png',
        width: 1200,
        height: 630,
        alt: 'ISKULTRIP SCANS - Bengali Manga Translations',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ISKULTRIP SCANS — বাংলায় মাঙ্গা পড়ুন',
    description: 'বাংলা মাঙ্গা অনুবাদের সেরা ঠিকানা। Read manga in Bengali.',
    images: ['/og-default.png'],
  },
  icons: {
    icon: [
      { url: '/icons/icon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap"
          rel="stylesheet"
        />
        {/* PWA: Register service worker */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function() {});
                });
              }
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <ThemeProvider>
          <AuthProvider>
            <ContentModeProvider>
              <BookmarkProvider>
                <NotificationProvider>
                  <ToastProvider>
                    {children}
                    <PWAInstallPrompt />
                  </ToastProvider>
                </NotificationProvider>
              </BookmarkProvider>
            </ContentModeProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
