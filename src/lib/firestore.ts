import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  QueryConstraint,
} from 'firebase/firestore';
import { getFirebaseDb } from './firebase';

// Types
export interface Chapter {
  id: string;
  mangaId: string;
  title: string;
  chapterNumber: number;
  readLink: string;
  createdAt: Timestamp;
}

export interface Manga {
  id: string;
  title: string;
  titleBn?: string;
  slug: string;
  description: string;
  coverImage: string;
  bannerImage?: string;
  genres: string[];
  author: string;
  artist: string;
  status: 'ongoing' | 'completed' | 'hiatus';
  rating: number;
  totalChapters: number;
  language: 'en' | 'bn';
  readLink?: string;
  featured: boolean;
  trending: boolean;
  /** 18+ adult content flag. Family Mode-এ এই manga গুলো লুকানো হয়। */
  isAdult?: boolean;
  chapters?: Chapter[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Genre {
  id: string;
  name: string;
  slug: string;
  mangaCount: number;
}

// ─── Announcement Types ────────────────────────────────────
export interface Announcement {
  id: string;
  title: string;
  titleBn?: string;
  content: string;
  contentBn?: string;
  type: 'announcement' | 'upcoming' | 'update';
  mangaId?: string;
  coverImage?: string;
  releaseDate?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─── Notification Types ────────────────────────────────────
export interface Notification {
  id: string;
  title: string;
  titleBn?: string;
  message: string;
  messageBn?: string;
  type: 'new_manga' | 'new_chapter' | 'announcement';
  mangaId?: string;
  mangaSlug?: string;
  createdAt: Timestamp;
}

// ─── Upcoming Release Types ────────────────────────────────
export interface UpcomingRelease {
  id: string;
  title: string;
  titleBn?: string;
  mangaId?: string;
  mangaSlug?: string;
  coverImage?: string;
  releaseDate: Timestamp;
  description?: string;
  createdAt: Timestamp;
}

// ─── Request Types ─────────────────────────────────────────
export interface MangaRequest {
  id: string;
  mangaTitle: string;
  mangaTitleBn?: string;
  description: string;
  requestedBy: string;
  status: 'pending' | 'approved' | 'completed' | 'rejected';
  upvotes: number;
  upvotedBy: string[];
  adminNote?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─── Manga CRUD ────────────────────────────────────────────

export async function getAllManga(constraints: QueryConstraint[] = []): Promise<Manga[]> {
  try {
    const q = query(collection(getFirebaseDb(), 'manga'), ...constraints);
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Manga);
  } catch (error) {
    console.error('Error fetching manga:', error);
    return [];
  }
}

export async function getMangaBySlug(slug: string): Promise<Manga | null> {
  try {
    const q = query(collection(getFirebaseDb(), 'manga'), where('slug', '==', slug), limit(1));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const manga = { id: snap.docs[0].id, ...snap.docs[0].data() } as Manga;

    // Fetch chapters for this manga
    const chapters = await getChaptersByMangaId(manga.id);
    manga.chapters = chapters;

    return manga;
  } catch (error) {
    console.error('Error fetching manga by slug:', error);
    return null;
  }
}

export async function getMangaById(id: string): Promise<Manga | null> {
  try {
    const snap = await getDoc(doc(getFirebaseDb(), 'manga', id));
    if (!snap.exists()) return null;
    const manga = { id: snap.id, ...snap.data() } as Manga;

    // Fetch chapters
    const chapters = await getChaptersByMangaId(id);
    manga.chapters = chapters;

    return manga;
  } catch (error) {
    console.error('Error fetching manga by id:', error);
    return null;
  }
}

// ✅ Uses proper Firestore where() + orderBy() with composite index.
// Composite index required (auto-created on first query failure, or set up in Firebase Console):
//   Collection: manga | Fields: featured (Ascending), updatedAt (Descending)
export async function getFeaturedManga(): Promise<Manga[]> {
  try {
    const allManga = await getAllManga([
      where('featured', '==', true),
      orderBy('updatedAt', 'desc'),
      limit(10),
    ]);
    return allManga;
  } catch (error) {
    // Fallback: client-side filter if composite index not yet created
    console.warn('[getFeaturedManga] Falling back to client-side filter. Create composite index:', error);
    try {
      const allManga = await getAllManga([orderBy('updatedAt', 'desc'), limit(50)]);
      return allManga.filter((m) => m.featured === true).slice(0, 10);
    } catch (err) {
      console.error('Error fetching featured manga:', err);
      return [];
    }
  }
}

// ✅ Uses proper Firestore where() + orderBy() with composite index.
// Composite index required:
//   Collection: manga | Fields: trending (Ascending), rating (Descending)
export async function getTrendingManga(): Promise<Manga[]> {
  try {
    const allManga = await getAllManga([
      where('trending', '==', true),
      orderBy('rating', 'desc'),
      limit(20),
    ]);
    return allManga;
  } catch (error) {
    console.warn('[getTrendingManga] Falling back to client-side filter. Create composite index:', error);
    try {
      const allManga = await getAllManga([orderBy('rating', 'desc'), limit(50)]);
      return allManga.filter((m) => m.trending === true).slice(0, 20);
    } catch (err) {
      console.error('Error fetching trending manga:', err);
      return [];
    }
  }
}

// This one only uses orderBy - no composite index needed
export async function getLatestManga(count = 20): Promise<Manga[]> {
  return getAllManga([orderBy('createdAt', 'desc'), limit(count)]);
}

// ✅ Uses proper Firestore where() + orderBy() with composite index.
// Composite index required:
//   Collection: manga | Fields: language (Ascending), updatedAt (Descending)
export async function getMangaByLanguage(language: 'en' | 'bn', count = 10): Promise<Manga[]> {
  try {
    const allManga = await getAllManga([
      where('language', '==', language),
      orderBy('updatedAt', 'desc'),
      limit(count),
    ]);
    return allManga;
  } catch (error) {
    console.warn('[getMangaByLanguage] Falling back to client-side filter. Create composite index:', error);
    try {
      const allManga = await getAllManga([orderBy('updatedAt', 'desc'), limit(50)]);
      return allManga.filter((m) => m.language === language).slice(0, count);
    } catch (err) {
      console.error('Error fetching manga by language:', err);
      return [];
    }
  }
}

export async function getMangaByGenre(genreSlug: string, constraints: QueryConstraint[] = []): Promise<Manga[]> {
  const allGenre = await getAllManga([orderBy('updatedAt', 'desc'), ...constraints]);
  return allGenre.filter((m) => m.genres.some((g) => g.toLowerCase() === genreSlug.toLowerCase()));
}

export async function searchManga(searchTerm: string): Promise<Manga[]> {
  const all = await getAllManga([orderBy('updatedAt', 'desc'), limit(200)]);
  const lower = searchTerm.toLowerCase();
  return all.filter(
    (m) =>
      m.title.toLowerCase().includes(lower) ||
      (m.titleBn && m.titleBn.includes(searchTerm)) ||
      m.author.toLowerCase().includes(lower)
  );
}

/**
 * Remove undefined values from an object before writing to Firestore.
 * Firestore does NOT accept undefined field values — they cause:
 * "Function addDoc() called with invalid data. Unsupported field value: undefined"
 */
function removeUndefined<T extends Record<string, unknown>>(obj: T): T {
  const cleaned = { ...obj } as Record<string, unknown>;
  for (const key of Object.keys(cleaned)) {
    if (cleaned[key] === undefined) {
      delete cleaned[key];
    }
  }
  return cleaned as T;
}

export async function addManga(data: Omit<Manga, 'id'>): Promise<string> {
  try {
    const db = getFirebaseDb();
    const cleanData = removeUndefined({
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    const docRef = await addDoc(collection(db, 'manga'), cleanData);
    return docRef.id;
  } catch (error: any) {
    console.error('Firestore addManga error:', {
      code: error?.code,
      message: error?.message,
      name: error?.name,
    });
    throw error; // Re-throw so caller can handle
  }
}

export async function updateManga(id: string, data: Partial<Manga>): Promise<void> {
  const cleanData = removeUndefined({
    ...data,
    updatedAt: Timestamp.now(),
  });
  await updateDoc(doc(getFirebaseDb(), 'manga', id), cleanData);
}

export async function deleteManga(id: string): Promise<void> {
  // Delete all chapters first
  const chapters = await getChaptersByMangaId(id);
  for (const ch of chapters) {
    await deleteDoc(doc(getFirebaseDb(), 'manga', id, 'chapters', ch.id));
  }
  await deleteDoc(doc(getFirebaseDb(), 'manga', id));
}

// ─── Chapter CRUD ──────────────────────────────────────────

export async function getChaptersByMangaId(mangaId: string): Promise<Chapter[]> {
  try {
    const q = query(
      collection(getFirebaseDb(), 'manga', mangaId, 'chapters'),
      orderBy('chapterNumber', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Chapter);
  } catch (error) {
    console.error('Error fetching chapters:', error);
    return [];
  }
}

export async function addChapter(mangaId: string, data: Omit<Chapter, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(getFirebaseDb(), 'manga', mangaId, 'chapters'), {
    ...data,
    createdAt: Timestamp.now(),
  });

  // Update totalChapters count on the manga document
  const chapters = await getChaptersByMangaId(mangaId);
  await updateDoc(doc(getFirebaseDb(), 'manga', mangaId), {
    totalChapters: chapters.length,
    updatedAt: Timestamp.now(),
  });

  return docRef.id;
}

export async function updateChapter(mangaId: string, chapterId: string, data: Partial<Chapter>): Promise<void> {
  await updateDoc(doc(getFirebaseDb(), 'manga', mangaId, 'chapters', chapterId), data);
}

export async function deleteChapter(mangaId: string, chapterId: string): Promise<void> {
  await deleteDoc(doc(getFirebaseDb(), 'manga', mangaId, 'chapters', chapterId));

  // Update totalChapters count
  const chapters = await getChaptersByMangaId(mangaId);
  await updateDoc(doc(getFirebaseDb(), 'manga', mangaId), {
    totalChapters: chapters.length,
    updatedAt: Timestamp.now(),
  });
}

// ─── Genre CRUD ────────────────────────────────────────────

export async function getAllGenres(): Promise<Genre[]> {
  try {
    const q = query(collection(getFirebaseDb(), 'genres'), orderBy('name', 'asc'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Genre);
  } catch (error) {
    console.error('Error fetching genres:', error);
    return [];
  }
}

export async function getGenreBySlug(slug: string): Promise<Genre | null> {
  try {
    const q = query(collection(getFirebaseDb(), 'genres'), where('slug', '==', slug), limit(1));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return { id: snap.docs[0].id, ...snap.docs[0].data() } as Genre;
  } catch (error) {
    console.error('Error fetching genre by slug:', error);
    return null;
  }
}

export async function addGenre(data: Omit<Genre, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(getFirebaseDb(), 'genres'), data);
  return docRef.id;
}

export async function updateGenre(id: string, data: Partial<Genre>): Promise<void> {
  await updateDoc(doc(getFirebaseDb(), 'genres', id), data);
}

export async function deleteGenre(id: string): Promise<void> {
  await deleteDoc(doc(getFirebaseDb(), 'genres', id));
}

// ─── Bookmarks ─────────────────────────────────────────────

export interface BookmarkData {
  mangaId: string;
  title: string;
  titleBn?: string;
  slug: string;
  coverImage: string;
  rating: number;
  status: 'ongoing' | 'completed' | 'hiatus';
  totalChapters: number;
  language: 'en' | 'bn';
  genres: string[];
  bookmarkedAt: Timestamp;
}

export async function addBookmark(userId: string, manga: Manga): Promise<void> {
  const bookmarkRef = doc(getFirebaseDb(), 'users', userId, 'bookmarks', manga.id);
  await setDoc(bookmarkRef, {
    mangaId: manga.id,
    title: manga.title,
    titleBn: manga.titleBn || null,
    slug: manga.slug,
    coverImage: manga.coverImage,
    rating: manga.rating,
    status: manga.status,
    totalChapters: manga.totalChapters,
    language: manga.language,
    genres: manga.genres,
    bookmarkedAt: Timestamp.now(),
  }, { merge: true });
}

export async function removeBookmark(userId: string, mangaId: string): Promise<void> {
  await deleteDoc(doc(getFirebaseDb(), 'users', userId, 'bookmarks', mangaId));
}

export async function getUserBookmarks(userId: string): Promise<BookmarkData[]> {
  const q = query(
    collection(getFirebaseDb(), 'users', userId, 'bookmarks'),
    orderBy('bookmarkedAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ mangaId: d.id, ...d.data() }) as BookmarkData);
}

export async function isBookmarked(userId: string, mangaId: string): Promise<boolean> {
  const snap = await getDoc(doc(getFirebaseDb(), 'users', userId, 'bookmarks', mangaId));
  return snap.exists();
}

export async function getBookmarkedManga(userId: string): Promise<Manga[]> {
  const bookmarks = await getUserBookmarks(userId);
  if (bookmarks.length === 0) return [];

  const db = getFirebaseDb();
  const mangaList: Manga[] = [];

  // ✅ Batch fetch using where('in', ...) — Firestore allows up to 10 IDs per query.
  // For more than 10 bookmarks, we chunk and run multiple parallel queries.
  const chunkSize = 10;
  const chunks: string[][] = [];
  for (let i = 0; i < bookmarks.length; i += chunkSize) {
    chunks.push(bookmarks.slice(i, i + chunkSize).map((b) => b.mangaId));
  }

  const results = await Promise.all(
    chunks.map((ids) => getDocs(query(collection(db, 'manga'), where('__name__', 'in', ids))))
  );

  // Preserve bookmark order
  const orderMap = new Map(bookmarks.map((b, i) => [b.mangaId, i]));
  for (const snap of results) {
    for (const docSnap of snap.docs) {
      const manga = { id: docSnap.id, ...docSnap.data() } as Manga;
      mangaList.push(manga);
    }
  }
  mangaList.sort((a, b) => (orderMap.get(a.id) ?? 0) - (orderMap.get(b.id) ?? 0));

  return mangaList;
}

// ─── Stats ─────────────────────────────────────────────────

export async function getStats() {
  const allManga = await getAllManga([orderBy('createdAt', 'desc')]);
  return {
    total: allManga.length,
    en: allManga.filter((m) => m.language === 'en').length,
    bn: allManga.filter((m) => m.language === 'bn').length,
    ongoing: allManga.filter((m) => m.status === 'ongoing').length,
    completed: allManga.filter((m) => m.status === 'completed').length,
    recent: allManga.slice(0, 5),
  };
}

// ─── Announcements / Blog ──────────────────────────────────

export async function addAnnouncement(data: Omit<Announcement, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(getFirebaseDb(), 'announcements'), removeUndefined({
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  }));
  return docRef.id;
}

export async function getAllAnnouncements(): Promise<Announcement[]> {
  try {
    const q = query(collection(getFirebaseDb(), 'announcements'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Announcement);
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return [];
  }
}

export async function getAnnouncementById(id: string): Promise<Announcement | null> {
  try {
    const snap = await getDoc(doc(getFirebaseDb(), 'announcements', id));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as Announcement;
  } catch (error) {
    console.error('Error fetching announcement:', error);
    return null;
  }
}

export async function updateAnnouncement(id: string, data: Partial<Announcement>): Promise<void> {
  await updateDoc(doc(getFirebaseDb(), 'announcements', id), {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteAnnouncement(id: string): Promise<void> {
  await deleteDoc(doc(getFirebaseDb(), 'announcements', id));
}

export async function getLatestAnnouncements(count = 5): Promise<Announcement[]> {
  try {
    const q = query(collection(getFirebaseDb(), 'announcements'), orderBy('createdAt', 'desc'), limit(count));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Announcement);
  } catch (error) {
    console.error('Error fetching latest announcements:', error);
    return [];
  }
}

// ─── Notifications ─────────────────────────────────────────

export async function addNotification(data: Omit<Notification, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(getFirebaseDb(), 'notifications'), removeUndefined({
    ...data,
    createdAt: Timestamp.now(),
  }));
  return docRef.id;
}

export async function getNotifications(count = 20): Promise<Notification[]> {
  try {
    const q = query(collection(getFirebaseDb(), 'notifications'), orderBy('createdAt', 'desc'), limit(count));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Notification);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
}

export async function deleteNotification(id: string): Promise<void> {
  await deleteDoc(doc(getFirebaseDb(), 'notifications', id));
}

// ─── Upcoming Releases ─────────────────────────────────────

export async function addUpcomingRelease(data: Omit<UpcomingRelease, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(getFirebaseDb(), 'upcomingReleases'), {
    ...data,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function getUpcomingReleases(): Promise<UpcomingRelease[]> {
  try {
    // Fetch all ordered by releaseDate, filter client-side for future dates
    const q = query(collection(getFirebaseDb(), 'upcomingReleases'), orderBy('releaseDate', 'asc'), limit(20));
    const snap = await getDocs(q);
    const now = Date.now();
    return snap.docs
      .map((d) => ({ id: d.id, ...d.data() }) as UpcomingRelease)
      .filter((r) => r.releaseDate.toMillis() > now);
  } catch (error) {
    console.error('Error fetching upcoming releases:', error);
    return [];
  }
}

export async function deleteUpcomingRelease(id: string): Promise<void> {
  await deleteDoc(doc(getFirebaseDb(), 'upcomingReleases', id));
}

export async function getAllUpcomingReleases(): Promise<UpcomingRelease[]> {
  try {
    const q = query(collection(getFirebaseDb(), 'upcomingReleases'), orderBy('releaseDate', 'asc'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as UpcomingRelease);
  } catch (error) {
    console.error('Error fetching all upcoming releases:', error);
    return [];
  }
}

// ─── User Requests ─────────────────────────────────────────

export async function addRequest(data: Omit<MangaRequest, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(getFirebaseDb(), 'requests'), {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function getAllRequests(): Promise<MangaRequest[]> {
  try {
    const q = query(collection(getFirebaseDb(), 'requests'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as MangaRequest);
  } catch (error) {
    console.error('Error fetching requests:', error);
    return [];
  }
}

export async function updateRequest(id: string, data: Partial<MangaRequest>): Promise<void> {
  await updateDoc(doc(getFirebaseDb(), 'requests', id), {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteRequest(id: string): Promise<void> {
  await deleteDoc(doc(getFirebaseDb(), 'requests', id));
}

export async function upvoteRequest(id: string, userId: string): Promise<void> {
  const reqDoc = doc(getFirebaseDb(), 'requests', id);
  const snap = await getDoc(reqDoc);
  if (!snap.exists()) return;

  const data = snap.data() as MangaRequest;
  const upvotedBy = data.upvotedBy || [];

  if (upvotedBy.includes(userId)) {
    // Remove upvote
    await updateDoc(reqDoc, {
      upvotes: Math.max(0, (data.upvotes || 0) - 1),
      upvotedBy: upvotedBy.filter((u) => u !== userId),
      updatedAt: Timestamp.now(),
    });
  } else {
    // Add upvote
    await updateDoc(reqDoc, {
      upvotes: (data.upvotes || 0) + 1,
      upvotedBy: [...upvotedBy, userId],
      updatedAt: Timestamp.now(),
    });
  }
}
