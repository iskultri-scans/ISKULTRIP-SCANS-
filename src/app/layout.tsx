import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { BookmarkProvider } from '@/context/BookmarkContext';
import { ToastProvider } from '@/components/ui/Toast';
import { PWAInstallPrompt } from '@/components/layout/PWAInstallPrompt';

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
  title: 'ISKULTRIP SCANS — Your Gateway to Manga',
  description: 'Browse manga information, discover new series, and find your next favorite read. ISKULTRIP SCANS by MD MEHADI HASAN.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'ISKULTRIP',
  },
  openGraph: {
    title: 'ISKULTRIP SCANS',
    description: 'Your gateway to manga. Browse, discover, and explore.',
    url: 'https://iskultrip.com',
    type: 'website',
    siteName: 'ISKULTRIP SCANS',
    images: [
      {
        url: '/og-default.png',
        width: 1200,
        height: 630,
        alt: 'ISKULTRIP SCANS',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ISKULTRIP SCANS',
    description: 'Your gateway to manga.',
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
    <html lang="en" className="dark" suppressHydrationWarning>
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
            <BookmarkProvider>
              <ToastProvider>
                {children}
                <PWAInstallPrompt />
              </ToastProvider>
            </BookmarkProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
