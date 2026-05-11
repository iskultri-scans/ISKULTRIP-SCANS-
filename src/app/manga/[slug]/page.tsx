import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAdminApp } from '@/lib/firebase-admin';
import { SITE_CONFIG } from '@/lib/config';
import { MangaDetailClient } from './MangaDetailClient';

// Server-side: fetch manga data for metadata using Admin SDK
async function getMangaForMetadata(slug: string) {
  try {
    const adminApp = getAdminApp();
    const adminDb = adminApp.firestore();

    const snapshot = await adminDb
      .collection('manga')
      .where('slug', '==', slug)
      .limit(1)
      .get();

    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
    } as Record<string, unknown>;
  } catch (error) {
    console.error('Server-side manga fetch error:', error);
    return null;
  }
}

// Generate dynamic metadata for OG previews (Telegram, Facebook, Twitter)
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
    };
  }

  const title = (manga.title as string) || 'Manga';
  const description = (manga.description as string) || `Read ${title} on ISKULTRIP SCANS`;
  const coverImage = (manga.coverImage as string) || '/og-default.png';
  const pageUrl = `${SITE_CONFIG.url}/manga/${slug}`;
  const titleBn = manga.titleBn as string | undefined;

  return {
    title: `${title} — ISKULTRIP SCANS`,
    description: description.slice(0, 200),
    openGraph: {
      title: titleBn ? `${title} (${titleBn})` : title,
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
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description.slice(0, 200),
      images: [coverImage],
    },
  };
}

// Server component wrapper
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
