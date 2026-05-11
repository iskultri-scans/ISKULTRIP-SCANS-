import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
  DocumentSnapshot,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from './firebase';

// Types
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
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Genre {
  id: string;
  name: string;
  slug: string;
  mangaCount: number;
}

// ─── Manga CRUD ────────────────────────────────────────────

export async function getAllManga(constraints: QueryConstraint[] = []): Promise<Manga[]> {
  const q = query(collection(db, 'manga'), ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Manga);
}

export async function getMangaBySlug(slug: string): Promise<Manga | null> {
  const q = query(collection(db, 'manga'), where('slug', '==', slug), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return { id: snap.docs[0].id, ...snap.docs[0].data() } as Manga;
}

export async function getMangaById(id: string): Promise<Manga | null> {
  const snap = await getDoc(doc(db, 'manga', id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Manga;
}

export async function getFeaturedManga(): Promise<Manga[]> {
  return getAllManga([
    where('featured', '==', true),
    orderBy('updatedAt', 'desc'),
    limit(10),
  ]);
}

export async function getTrendingManga(): Promise<Manga[]> {
  return getAllManga([
    where('trending', '==', true),
    orderBy('rating', 'desc'),
    limit(20),
  ]);
}

export async function getLatestManga(count = 20): Promise<Manga[]> {
  return getAllManga([orderBy('createdAt', 'desc'), limit(count)]);
}

export async function getMangaByLanguage(language: 'en' | 'bn', count = 10): Promise<Manga[]> {
  return getAllManga([
    where('language', '==', language),
    orderBy('updatedAt', 'desc'),
    limit(count),
  ]);
}

export async function getMangaByGenre(genreSlug: string, constraints: QueryConstraint[] = []): Promise<Manga[]> {
  // Firestore doesn't support "array-contains" with other inequality filters easily,
  // so we fetch and filter client-side for genre matching
  const allGenre = await getAllManga([orderBy('updatedAt', 'desc'), ...constraints]);
  return allGenre.filter((m) => m.genres.some((g) => g.toLowerCase() === genreSlug.toLowerCase()));
}

export async function searchManga(searchTerm: string): Promise<Manga[]> {
  // Firestore doesn't support full-text search natively
  // We fetch recent manga and filter client-side
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
  await deleteDoc(doc(db, 'manga', id));
}

// ─── Genre CRUD ────────────────────────────────────────────

export async function getAllGenres(): Promise<Genre[]> {
  const q = query(collection(db, 'genres'), orderBy('name', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Genre);
}

export async function getGenreBySlug(slug: string): Promise<Genre | null> {
  const q = query(collection(db, 'genres'), where('slug', '==', slug), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return { id: snap.docs[0].id, ...snap.docs[0].data() } as Genre;
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
