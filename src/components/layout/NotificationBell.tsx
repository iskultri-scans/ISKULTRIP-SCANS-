'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, ExternalLink, X } from 'lucide-react';
import { useNotifications } from '@/context/NotificationContext';
import Link from 'next/link';

export function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const typeIcons = {
    new_manga: '📚',
    new_chapter: '📖',
    announcement: '📢',
  };

  return (
    <div className="relative" ref={panelRef}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--accent-glow)] transition-all relative"
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 flex items-center justify-center rounded-full text-[9px] font-bold px-1"
            style={{
              background: 'var(--accent)',
              color: '#0a0a0f',
              boxShadow: '0 0 8px var(--accent-glow)',
            }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ type: 'spring', damping: 25, stiffness: 400, mass: 0.5 }}
              className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-xl overflow-hidden shadow-2xl z-50"
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                boxShadow: '0 0 30px var(--accent-glow), 0 20px 40px -12px rgba(0, 0, 0, 0.5)',
              }}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between p-3 border-b"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <h3 className="text-sm font-bold text-[var(--text-primary)]">
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-[var(--accent)] hover:underline flex items-center gap-1"
                  >
                    <Check size={12} />
                    Mark all read
                  </button>
                )}
              </div>

              {/* Notification List */}
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center">
                    <Bell size={24} className="mx-auto text-[var(--text-muted)] mb-2" />
                    <p className="text-sm text-[var(--text-muted)]">No notifications yet</p>
                  </div>
                ) : (
                  notifications.map((notif) => {
                    const isUnread = !notif.id || !localStorage.getItem('iskultrip-read-notifications')?.includes(notif.id);
                    return (
                      <div
                        key={notif.id}
                        onClick={() => markAsRead(notif.id)}
                        className="flex items-start gap-3 p-3 hover:bg-[var(--accent-glow)] transition-colors cursor-pointer border-b"
                        style={{
                          borderColor: 'var(--border-color)',
                          background: isUnread ? 'var(--accent-glow)' : 'transparent',
                        }}
                      >
                        <span className="text-base flex-shrink-0 mt-0.5">
                          {typeIcons[notif.type] || '📢'}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                            {notif.titleBn || notif.title}
                          </p>
                          <p className="text-xs text-[var(--text-muted)] line-clamp-2 mt-0.5">
                            {notif.messageBn || notif.message}
                          </p>
                          {notif.mangaSlug && (
                            <Link
                              href={`/manga/${notif.mangaSlug}`}
                              onClick={() => setIsOpen(false)}
                              className="inline-flex items-center gap-1 text-xs text-[var(--accent)] hover:underline mt-1"
                            >
                              <ExternalLink size={10} />
                              View
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
