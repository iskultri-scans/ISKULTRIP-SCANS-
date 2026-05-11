'use client';

import React, { useEffect, useState } from 'react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { getAllGenres, type Genre } from '@/lib/firestore';
import { Mail, Shield } from 'lucide-react';

export default function DmcaPage() {
  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
    getAllGenres().then(setGenres);
  }, []);

  const genreSlugs = genres.map((g) => ({ name: g.name, slug: g.slug }));

  return (
    <PublicLayout genres={genreSlugs}>
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-8">
          <Shield size={32} className="text-[var(--accent)]" />
          <h1 className="font-['Bebas_Neue'] text-4xl tracking-wide text-[var(--text-primary)]">
            DMCA / Disclaimer
          </h1>
        </div>

        <div className="space-y-6 text-[var(--text-secondary)] leading-relaxed">
          <section className="glass-card p-6">
            <h2 className="font-['Bebas_Neue'] text-xl tracking-wide text-[var(--text-primary)] mb-3">
              Important Notice
            </h2>
            <p>
              ISKULTRIP SCANS does not host any manga files, scanlations, or translated content on its servers. This website functions solely as a directory and information resource for manga enthusiasts. All manga cover images, descriptions, and metadata displayed on this site are used for informational purposes only.
            </p>
          </section>

          <section className="glass-card p-6">
            <h2 className="font-['Bebas_Neue'] text-xl tracking-wide text-[var(--text-primary)] mb-3">
              External Links
            </h2>
            <p>
              The &quot;Read Now&quot; buttons on this site redirect users to external third-party websites. ISKULTRIP SCANS has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third-party websites or services. Users are encouraged to review the terms and policies of any external site they visit through our links.
            </p>
          </section>

          <section className="glass-card p-6">
            <h2 className="font-['Bebas_Neue'] text-xl tracking-wide text-[var(--text-primary)] mb-3">
              Fan-Translated Content
            </h2>
            <p>
              Any fan-translated content referenced through external links is the work of independent translation groups. ISKULTRIP SCANS does not produce, commission, or distribute fan translations. We acknowledge the original creators and copyright holders of all manga properties. If you enjoy a manga series, we strongly encourage supporting the official release.
            </p>
          </section>

          <section className="glass-card p-6">
            <h2 className="font-['Bebas_Neue'] text-xl tracking-wide text-[var(--text-primary)] mb-3">
              Takedown Requests
            </h2>
            <p>
              If you are a copyright holder or an authorized representative and believe that content linked from this site infringes on your rights, please contact us using the email below. We take all valid takedown requests seriously and will promptly remove any infringing links upon verification.
            </p>
            <div className="flex items-center gap-2 mt-4">
              <Mail size={18} className="text-[var(--accent)]" />
              <a
                href="mailto:dmca@iskultrip.com"
                className="text-[var(--accent)] hover:underline font-medium"
              >
                dmca@iskultrip.com
              </a>
            </div>
          </section>

          <div className="text-center pt-6 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <p className="text-sm text-[var(--text-muted)]">
              Created by MD MEHADI HASAN
            </p>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
