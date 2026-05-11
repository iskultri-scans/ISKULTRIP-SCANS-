'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { MangaForm } from '@/components/admin/MangaForm';
import { addManga, getAllGenres, type Genre } from '@/lib/firestore';
import { useToast } from '@/components/ui/Toast';
import { Timestamp } from 'firebase/firestore';

export default function AddMangaPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAllGenres().then(setGenres);
  }, []);

  const handleSubmit = async (data: Record<string, unknown>) => {
    setLoading(true);
    try {
      await addManga({
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
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      showToast('Manga added successfully!', 'success');
      router.push('/admin/manga');
    } catch (error) {
      console.error('Error adding manga:', error);
      showToast('Failed to add manga', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <AdminHeader title="Add Manga" subtitle="Add a new manga to the directory" />

      <MangaForm
        onSubmit={handleSubmit}
        genres={genres.map((g) => ({ name: g.name, slug: g.slug }))}
        loading={loading}
        submitLabel="Add Manga"
      />
    </div>
  );
}
