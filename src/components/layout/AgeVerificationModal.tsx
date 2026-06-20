'use client';

/**
 * AgeVerificationModal — 18+ confirmation dialog
 *
 * যখন user প্রথমবার Adult Mode-এ যেতে চায়, এই modal দেখানো হয়।
 * Confirm করলে age verified হিসেবে save হয় এবং Adult Mode চালু হয়।
 * Cancel করলে Family Mode-এ থাকে।
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Check, X, Eye, EyeOff } from 'lucide-react';

interface AgeVerificationModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export function AgeVerificationModal({ onConfirm, onCancel }: AgeVerificationModalProps) {
  const [checked, setChecked] = useState(false);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        style={{ background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(8px)' }}
        onClick={onCancel}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 400 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md rounded-2xl overflow-hidden"
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 60px rgba(239, 68, 68, 0.15)',
          }}
        >
          {/* Top accent line — red for warning */}
          <div
            className="h-1 w-full"
            style={{ background: 'linear-gradient(90deg, transparent, #ef4444, transparent)' }}
          />

          <button
            onClick={onCancel}
            className="absolute top-3 right-3 p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)] transition-colors z-10"
            aria-label="বন্ধ করুন"
          >
            <X size={18} />
          </button>

          <div className="p-6 sm:p-8 text-center">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', damping: 15, delay: 0.1 }}
              className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '2px solid rgba(239, 68, 68, 0.3)',
              }}
            >
              <ShieldAlert size={32} className="text-red-500" />
            </motion.div>

            <h2 className="font-['Bebas_Neue'] text-2xl sm:text-3xl tracking-wide text-[var(--text-primary)] mb-2">
              Adult Mode চালু করুন
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mb-5 leading-relaxed">
              এই মোডে ১৮+ কনটেন্ট দেখানো হবে। অনুগ্রহ করে নিশ্চিত করুন যে আপনি{' '}
              <strong className="text-[var(--text-primary)]">১৮ বছর বা তার বেশি বয়সী</strong>।
            </p>

            {/* What changes — info box */}
            <div
              className="text-left rounded-xl p-3 mb-5 space-y-2"
              style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)' }}
            >
              <div className="flex items-start gap-2">
                <Eye size={14} className="text-red-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-[var(--text-secondary)]">
                  Adult ট্যাগযুক্ত মাঙ্গা দেখা যাবে এবং 18+ badge দেখানো হবে
                </p>
              </div>
              <div className="flex items-start gap-2">
                <EyeOff size={14} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-[var(--text-secondary)]">
                  যেকোনো সময় Family Mode-এ ফিরে যেতে পারবেন
                </p>
              </div>
            </div>

            {/* Confirmation checkbox */}
            <label className="flex items-center justify-center gap-2 cursor-pointer mb-5">
              <input
                type="checkbox"
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
                className="w-4 h-4 rounded accent-red-500"
              />
              <span className="text-xs text-[var(--text-secondary)]">
                আমি নিশ্চিত করছি যে আমি ১৮+ এবং এই কনটেন্ট দেখতে সম্মত
              </span>
            </label>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={onCancel}
                className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-secondary)',
                }}
              >
                বাতিল
              </button>
              <button
                onClick={onConfirm}
                disabled={!checked}
                className="flex-1 px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: checked ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'var(--bg-primary)',
                  color: checked ? '#ffffff' : 'var(--text-muted)',
                  border: checked ? 'none' : '1px solid var(--border-color)',
                  boxShadow: checked ? '0 4px 20px rgba(239, 68, 68, 0.4)' : 'none',
                }}
              >
                <Check size={16} />
                Adult Mode চালু করুন
              </button>
            </div>

            <p className="text-[10px] text-[var(--text-muted)] mt-4">
              🔒 আপনার verification শুধুমাত্র এই ব্রাউজারে save হবে, কোথাও share করা হয় না।
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
