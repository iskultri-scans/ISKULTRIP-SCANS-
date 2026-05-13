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
import { db } from './firebase';

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
  readLink: string;
  featured: boolean;
  trending: boolean;
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
    const q = query(collection(db, 'manga'), ...constraints);
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Manga);
  } catch (error) {
    console.error('Error fetching manga:', error);
    return [];
  }
}

export async function getMangaBySlug(slug: string): Promise<Manga | null> {
  try {
    const q = query(collection(db, 'manga'), where('slug', '==', slug), limit(1));
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
    const snap = await getDoc(doc(db, 'manga', id));
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

// FIX: Avoid composite index - use only orderBy, filter client-side
export async function getFeaturedManga(): Promise<Manga[]> {
  try {
    // Fetch manga ordered by updatedAt (single-field index only)
    const allManga = await getAllManga([orderBy('updatedAt', 'desc'), limit(50)]);
    // Filter featured client-side
    return allManga.filter((m) => m.featured === true).slice(0, 10);
  } catch (error) {
    console.error('Error fetching featured manga:', error);
    return [];
  }
}

// FIX: Avoid composite index - use only orderBy, filter client-side
export async function getTrendingManga(): Promise<Manga[]> {
  try {
    // Fetch manga ordered by rating (single-field index only)
    const allManga = await getAllManga([orderBy('rating', 'desc'), limit(50)]);
    // Filter trending client-side
    return allManga.filter((m) => m.trending === true).slice(0, 20);
  } catch (error) {
    console.error('Error fetching trending manga:', error);
    return [];
  }
}

// This one only uses orderBy - no composite index needed
export async function getLatestManga(count = 20): Promise<Manga[]> {
  return getAllManga([orderBy('createdAt', 'desc'), limit(count)]);
}

// FIX: Avoid composite index - use only orderBy, filter client-side
export async function getMangaByLanguage(language: 'en' | 'bn', count = 10): Promise<Manga[]> {
  try {
    // Fetch latest manga ordered by updatedAt (single-field index only)
    const allManga = await getAllManga([orderBy('updatedAt', 'desc'), limit(50)]);
    // Filter by language client-side
    return allManga.filter((m) => m.language === language).slice(0, count);
  } catch (error) {
    console.error('Error fetching manga by language:', error);
    return [];
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

export async function addManga(data: Omit<Manga, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'manga'), {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function updateManga(id: string, data: Partial<Manga>): Promise<void> {
  await updateDoc(doc(db, 'manga', id), {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteManga(id: string): Promise<void> {
  // Delete all chapters first
  const chapters = await getChaptersByMangaId(id);
  for (const ch of chapters) {
    await deleteDoc(doc(db, 'manga', id, 'chapters', ch.id));
  }
  await deleteDoc(doc(db, 'manga', id));
}

// ─── Chapter CRUD ──────────────────────────────────────────

export async function getChaptersByMangaId(mangaId: string): Promise<Chapter[]> {
  try {
    const q = query(
      collection(db, 'manga', mangaId, 'chapters'),
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
  const docRef = await addDoc(collection(db, 'manga', mangaId, 'chapters'), {
    ...data,
    createdAt: Timestamp.now(),
  });

  // Update totalChapters count on the manga document
  const chapters = await getChaptersByMangaId(mangaId);
  await updateDoc(doc(db, 'manga', mangaId), {
    totalChapters: chapters.length,
    updatedAt: Timestamp.now(),
  });

  return docRef.id;
}

export async function updateChapter(mangaId: string, chapterId: string, data: Partial<Chapter>): Promise<void> {
  await updateDoc(doc(db, 'manga', mangaId, 'chapters', chapterId), data);
}

export async function deleteChapter(mangaId: string, chapterId: string): Promise<void> {
  await deleteDoc(doc(db, 'manga', mangaId, 'chapters', chapterId));

  // Update totalChapters count
  const chapters = await getChaptersByMangaId(mangaId);
  await updateDoc(doc(db, 'manga', mangaId), {
    totalChapters: chapters.length,
    updatedAt: Timestamp.now(),
  });
}

// ─── Genre CRUD ────────────────────────────────────────────

export async function getAllGenres(): Promise<Genre[]> {
  try {
    const q = query(collection(db, 'genres'), orderBy('name', 'asc'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Genre);
  } catch (error) {
    console.error('Error fetching genres:', error);
    return [];
  }
}

export async function getGenreBySlug(slug: string): Promise<Genre | null> {
  try {
    const q = query(collection(db, 'genres'), where('slug', '==', slug), limit(1));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return { id: snap.docs[0].id, ...snap.docs[0].data() } as Genre;
  } catch (error) {
    console.error('Error fetching genre by slug:', error);
    return null;
  }
}

export async function addGenre(data: Omit<Genre, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'genres'), data);
  return docRef.id;
}

export async function updateGenre(id: string, data: Partial<Genre>): Promise<void> {
  await updateDoc(doc(db, 'genres', id), data);
}

export async function deleteGenre(id: string): Promise<void> {
  await deleteDoc(doc(db, 'genres', id));
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
  const bookmarkRef = doc(db, 'users', userId, 'bookmarks', manga.id);
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
  await deleteDoc(doc(db, 'users', userId, 'bookmarks', mangaId));
}

export async function getUserBookmarks(userId: string): Promise<BookmarkData[]> {
  const q = query(
    collection(db, 'users', userId, 'bookmarks'),
    orderBy('bookmarkedAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ mangaId: d.id, ...d.data() }) as BookmarkData);
}

export async function isBookmarked(userId: string, mangaId: string): Promise<boolean> {
  const snap = await getDoc(doc(db, 'users', userId, 'bookmarks', mangaId));
  return snap.exists();
}

export async function getBookmarkedManga(userId: string): Promise<Manga[]> {
  const bookmarks = await getUserBookmarks(userId);
  const mangaList: Manga[] = [];

  for (const bm of bookmarks) {
    const snap = await getDoc(doc(db, 'manga', bm.mangaId));
    if (snap.exists()) {
      const manga = { id: snap.id, ...snap.data() } as Manga;
      mangaList.push(manga);
    }
  }

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
  const docRef = await addDoc(collection(db, 'announcements'), {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function getAllAnnouncements(): Promise<Announcement[]> {
  try {
    const q = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Announcement);
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return [];
  }
}

export async function getAnnouncementById(id: string): Promise<Announcement | null> {
  try {
    const snap = await getDoc(doc(db, 'announcements', id));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as Announcement;
  } catch (error) {
    console.error('Error fetching announcement:', error);
    return null;
  }
}

export async function updateAnnouncement(id: string, data: Partial<Announcement>): Promise<void> {
  await updateDoc(doc(db, 'announcements', id), {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteAnnouncement(id: string): Promise<void> {
  await deleteDoc(doc(db, 'announcements', id));
}

export async function getLatestAnnouncements(count = 5): Promise<Announcement[]> {
  try {
    const q = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'), limit(count));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Announcement);
  } catch (error) {
    console.error('Error fetching latest announcements:', error);
    return [];
  }
}

// ─── Notifications ─────────────────────────────────────────

export async function addNotification(data: Omit<Notification, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'notifications'), {
    ...data,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function getNotifications(count = 20): Promise<Notification[]> {
  try {
    const q = query(collection(db, 'notifications'), orderBy('createdAt', 'desc'), limit(count));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Notification);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
}

export async function deleteNotification(id: string): Promise<void> {
  await deleteDoc(doc(db, 'notifications', id));
}

// ─── Upcoming Releases ─────────────────────────────────────

export async function addUpcomingRelease(data: Omit<UpcomingRelease, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'upcomingReleases'), {
    ...data,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function getUpcomingReleases(): Promise<UpcomingRelease[]> {
  try {
    // Fetch all ordered by releaseDate, filter client-side for future dates
    const q = query(collection(db, 'upcomingReleases'), orderBy('releaseDate', 'asc'), limit(20));
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
  await deleteDoc(doc(db, 'upcomingReleases', id));
}

export async function getAllUpcomingReleases(): Promise<UpcomingRelease[]> {
  try {
    const q = query(collection(db, 'upcomingReleases'), orderBy('releaseDate', 'asc'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as UpcomingRelease);
  } catch (error) {
    console.error('Error fetching all upcoming releases:', error);
    return [];
  }
}

// ─── User Requests ─────────────────────────────────────────

export async function addRequest(data: Omit<MangaRequest, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'requests'), {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function getAllRequests(): Promise<MangaRequest[]> {
  try {
    const q = query(collection(db, 'requests'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as MangaRequest);
  } catch (error) {
    console.error('Error fetching requests:', error);
    return [];
  }
}

export async function updateRequest(id: string, data: Partial<MangaRequest>): Promise<void> {
  await updateDoc(doc(db, 'requests', id), {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteRequest(id: string): Promise<void> {
  await deleteDoc(doc(db, 'requests', id));
}

export async function upvoteRequest(id: string, userId: string): Promise<void> {
  const reqDoc = doc(db, 'requests', id);
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
