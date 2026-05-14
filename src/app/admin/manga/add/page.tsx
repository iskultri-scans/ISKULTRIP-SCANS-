'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { MangaForm } from '@/components/admin/MangaForm';
import { addManga, getAllGenres, addNotification, type Genre } from '@/lib/firestore';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/context/AuthContext';
import { getFirebaseAuth } from '@/lib/firebase';
import { Timestamp } from 'firebase/firestore';

export default function AddMangaPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { user, isAdmin } = useAuth();
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAllGenres().then(setGenres);
  }, []);

  const handleSubmit = async (data: Record<string, unknown>) => {
    // Pre-flight auth check
    if (!user) {
      showToast('You must be logged in to add manga', 'error');
      return;
    }
    if (!isAdmin) {
      showToast('You do not have admin permission to add manga', 'error');
      return;
    }

    setLoading(true);
    try {
      // Force-refresh the auth token before writing to Firestore
      // This prevents stale-token permission errors
      const auth = getFirebaseAuth();
      const currentUser = auth.currentUser;
      if (currentUser) {
        await currentUser.getIdToken(true); // Force token refresh
      }

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
        featured: data.featured as boolean,
        trending: data.trending as boolean,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      // Create notification for new manga
      try {
        const title = data.title as string;
        const titleBn = (data.titleBn as string) || undefined;
        const slug = data.slug as string;
        await addNotification({
          title: `New Manga: ${title}`,
          titleBn: titleBn ? `নতুন মাঙ্গা: ${titleBn}` : undefined,
          message: `${title} has been added to the directory!`,
          messageBn: titleBn ? `${titleBn} ডিরেক্টরিতে যোগ হয়েছে!` : undefined,
          type: 'new_manga',
          mangaSlug: slug,
          createdAt: Timestamp.now(),
        });
      } catch (notifError) {
        console.error('Failed to create notification:', notifError);
        // Don't fail the main operation
      }

      showToast('Manga added successfully!', 'success');
      router.push('/admin/manga');
    } catch (error: any) {
      console.error('Error adding manga:', error);
      const errorMsg = error?.message || 'Failed to add manga';
      // Show more specific error messages
      if (errorMsg.includes('permission-denied') || errorMsg.includes('PERMISSION_DENIED')) {
        showToast('Permission denied — make sure you are logged in as admin', 'error');
      } else if (errorMsg.includes('network') || errorMsg.includes('offline')) {
        showToast('Network error — check your internet connection', 'error');
      } else if (errorMsg.includes('already exists') || errorMsg.includes('duplicate')) {
        showToast('A manga with this slug already exists', 'error');
      } else {
        showToast(`Failed to add manga: ${errorMsg}`, 'error');
      }
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
