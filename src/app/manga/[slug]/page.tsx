import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getDocs, collection, query, where, limit } from 'firebase/firestore';
import { getFirebaseDb } from '@/lib/firebase';
import { MangaDetailClient } from './MangaDetailClient';
import type { Manga, Genre, Chapter } from '@/lib/firestore';
import { getAllGenres, getChaptersByMangaId } from '@/lib/firestore';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://iskultrip-scans.vercel.app';

// Enable dynamic rendering for all manga slugs (fixes 404 on direct URL access)
export const dynamicParams = true;

// Revalidate every 5 minutes (ISR — balances freshness with performance)
export const revalidate = 300;

// ─── Server-side manga fetch ──────────────────────────────────────
// Priority: 1) Firebase Client SDK (works with Firestore Security Rules)
//           2) Firebase Admin SDK (bypasses rules, needs service-account env vars)

async function getMangaForServer(slug: string): Promise<{ manga: Manga; docId: string } | null> {
  // Method 1: Firebase Client SDK
  try {
    const db = getFirebaseDb();
    const q = query(collection(db, 'manga'), where('slug', '==', slug), limit(1));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const docSnap = snapshot.docs[0];
      const manga = { id: docSnap.id, ...docSnap.data() } as Manga;
      // Fetch chapters in parallel
      const chapters = await getChaptersByMangaId(manga.id);
      manga.chapters = chapters;
      return { manga, docId: docSnap.id };
    }
  } catch (error) {
    console.error('[getMangaForServer] Client SDK error:', error);
  }

  // Method 2: Firebase Admin SDK fallback
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
      const docSnap = snapshot.docs[0];
      const manga = { id: docSnap.id, ...docSnap.data() } as Manga;
      // Fetch chapters via admin SDK
      const chaptersSnap = await adminDb
        .collection('manga')
        .doc(docSnap.id)
        .collection('chapters')
        .orderBy('chapterNumber', 'desc')
        .get();
      manga.chapters = chaptersSnap.docs.map((d) => ({ id: d.id, ...d.data() }) as Chapter);
      return { manga, docId: docSnap.id };
    }
  } catch (error) {
    console.error('[getMangaForServer] Admin SDK error:', error);
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
  const result = await getMangaForServer(slug);

  if (!result) {
    return {
      title: 'Manga Not Found — ISKULTRIP SCANS',
      description: 'The manga you are looking for could not be found.',
    };
  }

  const manga = result.manga;
  const title = manga.title || 'Manga';
  const description = manga.description || `Read ${title} on ISKULTRIP SCANS — বাংলায় মাঙ্গা পড়ুন`;
  const coverImage = ensureAbsoluteUrl(manga.coverImage);
  const pageUrl = `${SITE_URL}/manga/${slug}`;
  const titleBn = manga.titleBn;

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
      authors: [manga.author || 'ISKULTRIP SCANS'],
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
  const result = await getMangaForServer(slug);

  if (!result) {
    notFound();
  }

  // ✅ Pass manga data as prop — no duplicate fetch on client
  const genres = await getAllGenres().catch(() => [] as Genre[]);
  const genreSlugs = genres.map((g) => ({ name: g.name, slug: g.slug }));

  return <MangaDetailClient manga={result.manga} genreSlugs={genreSlugs} />;
}
