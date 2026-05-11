'use client';

import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { MangaGrid } from '@/components/manga/MangaGrid';
import { SearchInput } from '@/components/browse/SearchInput';
import { useDebounce } from '@/hooks/useDebounce';
import { searchManga, getAllGenres, type Manga, type Genre } from '@/lib/firestore';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Manga[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [searching, setSearching] = useState(false);
  const fetchIdRef = useRef(0);

  const debouncedQuery = useDebounce(query, 300);
  const hasQuery = debouncedQuery.trim().length > 0;

  useEffect(() => {
    getAllGenres().then(setGenres);
  }, []);

  useEffect(() => {
    if (!hasQuery) return;

    const currentFetchId = ++fetchIdRef.current;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- setting loading before async fetch
    setSearching(true);
    searchManga(debouncedQuery)
      .then((data) => {
        if (currentFetchId === fetchIdRef.current) {
          setResults(data);
          setSearching(false);
        }
      })
      .catch((err) => {
        if (currentFetchId === fetchIdRef.current) {
          console.error(err);
          setSearching(false);
        }
      });
  }, [debouncedQuery, hasQuery]);

  // Reset results when query is cleared
  const displayResults = hasQuery ? results : [];

  const genreSlugs = genres.map((g) => ({ name: g.name, slug: g.slug }));

  return (
    <PublicLayout genres={genreSlugs}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="font-['Bebas_Neue'] text-3xl tracking-wide text-[var(--text-primary)] mb-6">
          Search Manga
        </h1>

        <div className="max-w-lg mb-8">
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Search by title, author..."
          />
        </div>

        {hasQuery ? (
          <>
            <p className="text-sm text-[var(--text-muted)] mb-4">
              {searching ? 'Searching...' : `${displayResults.length} result${displayResults.length !== 1 ? 's' : ''} for "${debouncedQuery}"`}
            </p>
            <MangaGrid
              manga={displayResults}
              loading={searching}
              emptyTitle={`No results found for "${debouncedQuery}"`}
              emptyMessage="Try a different search term."
            />
          </>
        ) : (
          <div className="text-center py-16 text-[var(--text-muted)]">
            <p>Enter a search term to find manga.</p>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
