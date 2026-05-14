'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebase';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { useToast } from '@/components/ui/Toast';
import { Shield, Lock, Mail, AlertCircle } from 'lucide-react';

const LOCK_DURATION = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

export default function AdminLoginPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    if (!lockedUntil) return;

    const interval = setInterval(() => {
      const remaining = lockedUntil - Date.now();
      if (remaining <= 0) {
        setLockedUntil(null);
        setFailedAttempts(0);
        setCountdown('');
        clearInterval(interval);
        return;
      }
      const mins = Math.floor(remaining / 60000);
      const secs = Math.floor((remaining % 60000) / 1000);
      setCountdown(`${mins}:${secs.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [lockedUntil]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (lockedUntil && Date.now() < lockedUntil) return;

    setLoading(true);
    try {
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'mdhasan@example.com';
      if (email !== adminEmail) {
        throw new Error('Unauthorized email');
      }

      const cred = await signInWithEmailAndPassword(getFirebaseAuth(), email, password);

      // Set session cookie
      const idToken = await cred.user.getIdToken();
      await fetch('/api/admin/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      setFailedAttempts(0);
      showToast('Signed in successfully!', 'success');
      router.push('/admin');
    } catch (error: unknown) {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);

      if (newAttempts >= MAX_ATTEMPTS) {
        setLockedUntil(Date.now() + LOCK_DURATION);
        showToast('Too many failed attempts. Locked for 15 minutes.', 'error');
      } else {
        showToast(`Invalid credentials. ${MAX_ATTEMPTS - newAttempts} attempts remaining.`, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const isLocked = lockedUntil !== null && Date.now() < lockedUntil;

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg-primary)' }}>
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div
        className="w-full max-w-md rounded-2xl p-8"
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          boxShadow: '0 0 40px var(--accent-glow)',
        }}
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4" style={{ background: 'var(--accent-glow)' }}>
            <Shield size={28} className="text-[var(--accent)]" />
          </div>
          <h1 className="font-['Bebas_Neue'] text-3xl tracking-widest" style={{ color: 'var(--accent)' }}>
            ISKULTRIP SCANS
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">Admin Access</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] mb-1.5">
              <Mail size={14} /> Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLocked}
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]"
              style={{
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
              }}
              placeholder="admin@iskultrip.com"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] mb-1.5">
              <Lock size={14} /> Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLocked}
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]"
              style={{
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
              }}
              placeholder="Enter password"
            />
          </div>

          {isLocked && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
              <AlertCircle size={16} className="text-red-400" />
              <span className="text-sm text-red-400">
                Locked. Try again in {countdown}
              </span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || isLocked}
            className="btn-accent w-full py-3 text-sm flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-[#0a0a0f] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Lock size={16} />
                Sign In
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
