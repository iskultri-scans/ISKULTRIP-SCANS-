'use client';

import React from 'react';

export function Skeleton({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`skeleton ${className}`} {...props} />;
}

export function MangaCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden" style={{ background: 'var(--bg-card)' }}>
      <Skeleton className="w-full" style={{ aspectRatio: '3/4' }} />
      <div className="p-3 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <Skeleton className="w-full h-[260px] sm:h-[350px] md:h-[450px] lg:h-[500px] rounded-xl" />
  );
}
