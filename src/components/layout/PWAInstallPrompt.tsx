'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed (standalone mode)
    const standalone = window.matchMedia('(display-mode: standalone)').matches
      || (window.navigator as any).standalone === true;
    setIsStandalone(standalone);

    if (standalone) return;

    // Check for iOS
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(ios);

    // Listen for the beforeinstallprompt event (Android/Chrome)
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // Show prompt after a delay (not immediately)
      const dismissed = sessionStorage.getItem('pwa-prompt-dismissed');
      if (!dismissed) {
        setTimeout(() => setShowPrompt(true), 3000);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Auto-hide if app gets installed
    window.addEventListener('appinstalled', () => {
      setShowPrompt(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    sessionStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  // Don't show if already installed
  if (isStandalone) return null;

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md"
        >
          <div
            className="rounded-2xl p-4 shadow-2xl backdrop-blur-xl"
            style={{
              background: 'rgba(15, 15, 25, 0.95)',
              border: '1px solid var(--border-color)',
              boxShadow: '0 0 30px var(--accent-glow), 0 20px 40px -12px rgba(0, 0, 0, 0.6)',
            }}
          >
            {/* Accent line */}
            <div
              className="h-0.5 w-full rounded-full mb-3"
              style={{
                background: 'linear-gradient(90deg, transparent, var(--accent), transparent)',
              }}
            />

            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: 'linear-gradient(135deg, var(--accent-glow), rgba(0, 212, 255, 0.1))',
                  border: '1px solid rgba(0, 212, 255, 0.2)',
                }}
              >
                <Smartphone size={18} className="text-[var(--accent)]" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1">
                  Install ISKULTRIP SCANS
                </h3>
                {isIOS ? (
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    Tap <span className="inline-flex items-center"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-[var(--accent)]"><path d="M12 16l-6-6h12l-6 6z"/></svg></span> Share button
                    then &quot;Add to Home Screen&quot; to install the app.
                  </p>
                ) : (
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    Add to your home screen for quick access and a better experience!
                  </p>
                )}
              </div>

              <motion.button
                onClick={handleDismiss}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors flex-shrink-0"
              >
                <X size={16} />
              </motion.button>
            </div>

            {!isIOS && deferredPrompt && (
              <motion.button
                onClick={handleInstall}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: 'linear-gradient(135deg, #00d4ff, #0099bb)',
                  color: '#0a0a0f',
                  boxShadow: '0 4px 15px rgba(0, 212, 255, 0.3)',
                }}
              >
                <Download size={16} />
                Install App
              </motion.button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
