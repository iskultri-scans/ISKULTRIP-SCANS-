import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getDocs, collection, query, where, limit } from 'firebase/firestore';
import { getFirebaseDb } from '@/lib/firebase';
import { MangaDetailClient } from './MangaDetailClient';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://iskultrip-scans.vercel.app';

// Enable dynamic rendering for all manga slugs (fixes 404 on direct URL access)
export const dynamicParams = true;

// Revalidate every 5 minutes (ISR — balances freshness with performance)
export const revalidate = 300;

// ─── Server-side manga fetch ──────────────────────────────────────
// Priority: 1) Firebase Client SDK (works with Firestore Security Rules)
//           2) Firebase Admin SDK (bypasses rules, needs service-account env vars)
//
// NOTE: The Firebase REST API (runQuery) is NOT used because it requires an
// OAuth2 access token — without one the request returns 401.  The Client SDK
// on the other hand respects Security Rules, and our rules allow
// "allow read: if true;" so unauthenticated reads succeed.

async function getMangaForMetadata(slug: string): Promise<Record<string, unknown> | null> {
  // Method 1: Firebase Client SDK (most reliable — uses Firestore Security Rules)
  try {
    const db = getFirebaseDb();
    const q = query(collection(db, 'manga'), where('slug', '==', slug), limit(1));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
      } as Record<string, unknown>;
    }
  } catch (error) {
    console.error('[getMangaForMetadata] Client SDK error:', error);
  }

  // Method 2: Firebase Admin SDK fallback (bypasses Security Rules, needs service-account env vars)
  try {
    const { getAdminApp } = await import('@/lib/firebase-admin');
    const adminApp = getAdminApp();
    const adminDb = adminApp.firestore();

    const snapshot = await adminDb
      .collection('manga')
      .where('slug', '==', slug)
      .limit(1)
      .get();

    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
      } as Record<string, unknown>;
    }
  } catch (error) {
    console.error('[getMangaForMetadata] Admin SDK error:', error);
  }

  return null;
}

// ─── Helper: absolute URL for OG images ─────────────────────────────

function ensureAbsoluteUrl(url: string | undefined): string {
  if (!url) return `${SITE_URL}/og-default.png`;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${SITE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
}

// ─── Generate dynamic metadata for OG previews ──────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const manga = await getMangaForMetadata(slug);

  if (!manga) {
    return {
      title: 'Manga Not Found — ISKULTRIP SCANS',
      description: 'The manga you are looking for could not be found.',
    };
  }

  const title = (manga.title as string) || 'Manga';
  const description = (manga.description as string) || `Read ${title} on ISKULTRIP SCANS — বাংলায় মাঙ্গা পড়ুন`;
  const coverImage = ensureAbsoluteUrl(manga.coverImage as string | undefined);
  const pageUrl = `${SITE_URL}/manga/${slug}`;
  const titleBn = manga.titleBn as string | undefined;

  return {
    title: `${title} — ISKULTRIP SCANS`,
    description: description.slice(0, 200),
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: titleBn ? `${title} (${titleBn}) — ISKULTRIP SCANS` : `${title} — ISKULTRIP SCANS`,
      description: description.slice(0, 200),
      url: pageUrl,
      siteName: 'ISKULTRIP SCANS',
      images: [
        {
          url: coverImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'article',
      authors: [(manga.author as string) || 'ISKULTRIP SCANS'],
    },
    twitter: {
      card: 'summary_large_image',
      title: titleBn ? `${title} (${titleBn})` : title,
      description: description.slice(0, 200),
      images: [coverImage],
    },
  };
}

// ─── Server component wrapper ───────────────────────────────────────

export default async function MangaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const manga = await getMangaForMetadata(slug);

  if (!manga) {
    notFound();
  }

  return <MangaDetailClient slug={slug} />;
}
