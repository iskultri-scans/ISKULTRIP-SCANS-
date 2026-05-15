import { NextRequest, NextResponse } from 'next/server';

const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

// Server-side cache for manga slug lookups (used by generateMetadata)
const cache = new Map<string, { data: Record<string, unknown> | null; timestamp: number }>();
const CACHE_TTL = 2 * 60 * 1000; // 2 minutes

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const slug = searchParams.get('slug');

  if (!slug) {
    return NextResponse.json({ error: 'Slug parameter required' }, { status: 400 });
  }

  // Check cache
  const cacheKey = `manga:${slug}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json(cached.data);
  }

  // Method 1: Try Firebase REST API
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
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.length > 0 && data[0].document) {
        const doc = data[0].document;
        const fields = doc.fields || {};
        const docName = doc.name || '';
        const id = docName.split('/').pop() || '';

        // Convert Firestore document format to plain object
        const manga = fieldsToObj(fields);
        manga.id = id;

        cache.set(cacheKey, { data: manga, timestamp: Date.now() });
        return NextResponse.json(manga);
      }
    }
  } catch (error) {
    console.error('REST API fetch error in /api/manga/slug:', error);
  }

  // Method 2: Try Admin SDK
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
      const manga = { id: doc.id, ...doc.data() };
      cache.set(cacheKey, { data: manga as Record<string, unknown>, timestamp: Date.now() });
      return NextResponse.json(manga);
    }
  } catch (error) {
    console.error('Admin SDK fetch error in /api/manga/slug:', error);
  }

  cache.set(cacheKey, { data: null, timestamp: Date.now() });
  return NextResponse.json({ error: 'Manga not found' }, { status: 404 });
}

// Convert Firestore document fields to a plain JS object
function fieldsToObj(fields: Record<string, unknown>): Record<string, unknown> {
  const obj: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(fields)) {
    const f = value as Record<string, unknown>;
    if (f.stringValue !== undefined) obj[key] = f.stringValue;
    else if (f.integerValue !== undefined) obj[key] = parseInt(f.integerValue as string, 10);
    else if (f.doubleValue !== undefined) obj[key] = parseFloat(f.doubleValue as string);
    else if (f.booleanValue !== undefined) obj[key] = f.booleanValue === 'true';
    else if (f.arrayValue) {
      const vals = (f.arrayValue as Record<string, unknown>).values as Array<Record<string, unknown>> | undefined;
      obj[key] = vals ? vals.map((v) => v.stringValue || '').filter(Boolean) : [];
    } else if (f.timestampValue !== undefined) {
      obj[key] = { seconds: Math.floor(new Date(f.timestampValue as string).getTime() / 1000), nanoseconds: 0 };
    } else if (f.mapValue) {
      obj[key] = fieldsToObj((f.mapValue as Record<string, unknown>).fields as Record<string, unknown>);
    } else if (f.nullValue !== undefined) {
      obj[key] = null;
    }
  }
  return obj;
}
