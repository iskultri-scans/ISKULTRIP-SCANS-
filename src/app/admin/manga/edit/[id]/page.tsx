'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { MangaForm } from '@/components/admin/MangaForm';
import { getMangaById, updateManga, getAllGenres, type Genre, type Manga } from '@/lib/firestore';
import { useToast } from '@/components/ui/Toast';

export default function EditMangaPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { showToast } = useToast();
  const [manga, setManga] = useState<Partial<Manga> | null>(null);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    Promise.all([getMangaById(id), getAllGenres()])
      .then(([mangaData, genresData]) => {
        setManga(mangaData);
        setGenres(genresData);
      })
      .catch(console.error)
      .finally(() => setFetching(false));
  }, [id]);

  const handleSubmit = async (data: Record<string, unknown>) => {
    setLoading(true);
    try {
      await updateManga(id, {
        title: data.title as string,
        titleBn: (data.titleBn as string) || undefined,
        slug: data.slug as string,
        description: (data.description as string) || '',
        coverImage: data.coverImage as string,
        bannerImage: (data.bannerImage as string) || undefined,
        genres: data.genres as string[],
        author: (data.author as string) || '',
        artist: (data.artist as string) || '',
        status: data.status as 'ongoing' | 'completed' | 'hiatus',
        rating: Number(data.rating),
        totalChapters: Number(data.totalChapters),
        language: data.language as 'en' | 'bn',
        readLink: data.readLink as string,
        featured: data.featured as boolean,
        trending: data.trending as boolean,
      });
      showToast('Manga updated successfully!', 'success');
      router.push('/admin/manga');
    } catch (error) {
      console.error('Error updating manga:', error);
      showToast('Failed to update manga', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-8 w-48 rounded-lg" />
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="skeleton h-12 rounded-lg" />
        ))}
      </div>
    );
  }

  if (!manga) {
    return (
      <div className="text-center py-12 text-[var(--text-muted)]">
        <p>Manga not found.</p>
      </div>
    );
  }

  return (
    <div>
      <AdminHeader title="Edit Manga" subtitle={`Editing: ${manga.title}`} />

      <MangaForm
        initialData={manga}
        onSubmit={handleSubmit}
        genres={genres.map((g) => ({ name: g.name, slug: g.slug }))}
        loading={loading}
        submitLabel="Save Changes"
      />
    </div>
  );
}
