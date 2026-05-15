import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/config';
import { MangaDetailClient } from './MangaDetailClient';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://iskultrip-scans.vercel.app';
const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

// Enable dynamic rendering for all manga slugs (fixes 404 on direct URL access)
export const dynamicParams = true;

// ─── Server-side manga fetch with multiple fallbacks ────────────────
// Priority: 1) Internal API route  2) Firebase REST API  3) Admin SDK
// This ensures OG tags and page rendering work regardless of env var setup.

async function getMangaForMetadata(slug: string): Promise<Record<string, unknown> | null> {
  // Method 1: Try internal API route (most reliable, uses Firestore client SDK)
  try {
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/manga/slug?slug=${encodeURIComponent(slug)}`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.id) return data;
    }
  } catch (error) {
    // This may fail during build or on localhost — that's OK, we have fallbacks
  }

  // Method 2: Try Firebase REST API directly (no auth needed for public reads)
  try {
    const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents:runQuery`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        structuredQuery: {
          from: [{ collectionId: 'manga' }],
          where: {
            fieldFilter: {
              field: { fieldPath: 'slug' },
              op: 'EQUAL',
              value: { stringValue: slug },
            },
          },
          limit: 1,
        },
      }),
      next: { revalidate: 60 },
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.length > 0 && data[0].document) {
        const doc = data[0].document;
        const fields = doc.fields || {};
        const docName = doc.name || '';
        const id = docName.split('/').pop() || '';

        return {
          id,
          title: extractString(fields, 'title'),
          titleBn: extractString(fields, 'titleBn'),
          description: extractString(fields, 'description'),
          coverImage: extractString(fields, 'coverImage'),
          bannerImage: extractString(fields, 'bannerImage'),
          slug: extractString(fields, 'slug'),
          author: extractString(fields, 'author'),
          status: extractString(fields, 'status'),
          language: extractString(fields, 'language'),
          rating: extractNumber(fields, 'rating'),
          totalChapters: extractNumber(fields, 'totalChapters'),
          genres: extractStringArray(fields, 'genres'),
        };
      }
    }
  } catch (error) {
    console.error('REST API manga fetch error:', error);
  }

  // Method 3: Try Firebase Admin SDK as final fallback
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
    console.error('Admin SDK manga fetch error:', error);
  }

  return null;
}

// ─── Firestore field extraction helpers ─────────────────────────────

type FirestoreField = {
  stringValue?: string;
  integerValue?: string;
  doubleValue?: string;
  booleanValue?: string;
  arrayValue?: { values?: Array<{ stringValue?: string }> };
  timestampValue?: string;
  nullValue?: unknown;
  mapValue?: { fields?: Record<string, FirestoreField> };
};

function extractString(fields: Record<string, FirestoreField>, key: string): string {
  const f = fields[key];
  return f?.stringValue || '';
}

function extractNumber(fields: Record<string, FirestoreField>, key: string): number {
  const f = fields[key];
  if (f?.integerValue) return parseInt(f.integerValue, 10);
  if (f?.doubleValue) return parseFloat(f.doubleValue);
  return 0;
}

function extractStringArray(fields: Record<string, FirestoreField>, key: string): string[] {
  const f = fields[key];
  return f?.arrayValue?.values?.map((v) => v.stringValue || '').filter(Boolean) || [];
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
