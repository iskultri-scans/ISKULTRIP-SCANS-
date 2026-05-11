'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export interface DropdownOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  color?: string;
}

interface CustomDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  size?: 'sm' | 'md';
  align?: 'left' | 'right';
}

export function CustomDropdown({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  className = '',
  size = 'md',
  align = 'left',
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  const sizeClasses = size === 'sm'
    ? 'px-3 py-2 text-xs'
    : 'px-3 py-2.5 text-sm';

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between gap-2 w-full rounded-xl outline-none cursor-pointer transition-all duration-200 ${sizeClasses}`}
        style={{
          background: 'var(--bg-secondary)',
          border: isOpen ? '1px solid var(--accent)' : '1px solid var(--border-color)',
          color: selectedOption ? 'var(--text-primary)' : 'var(--text-muted)',
          boxShadow: isOpen ? '0 0 15px var(--accent-glow)' : 'none',
        }}
      >
        <span className="flex items-center gap-2 truncate">
          {selectedOption?.icon}
          {selectedOption?.label || placeholder}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={size === 'sm' ? 12 : 14} className="flex-shrink-0 text-[var(--text-muted)]" />
        </motion.span>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Invisible overlay to catch clicks on scrollable areas */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ type: 'spring', damping: 25, stiffness: 400, mass: 0.5 }}
              className={`absolute z-50 mt-1.5 w-full min-w-[180px] rounded-xl overflow-hidden shadow-2xl ${
                align === 'right' ? 'right-0' : 'left-0'
              }`}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                boxShadow: '0 0 30px var(--accent-glow), 0 20px 40px -12px rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(20px)',
              }}
            >
              {/* Top accent line */}
              <div
                className="h-0.5 w-full"
                style={{
                  background: 'linear-gradient(90deg, transparent, var(--accent), transparent)',
                }}
              />

              {/* Options */}
              <div className="py-1.5 max-h-[260px] overflow-y-auto no-scrollbar">
                {options.map((option, index) => {
                  const isSelected = option.value === value;
                  const isHovered = hoveredIndex === index;

                  return (
                    <motion.button
                      key={option.value}
                      type="button"
                      onClick={() => handleSelect(option.value)}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03, duration: 0.15 }}
                      className="w-full flex items-center justify-between px-3.5 py-2.5 text-left transition-all duration-150"
                      style={{
                        background: isSelected
                          ? 'var(--accent-glow)'
                          : isHovered
                            ? 'var(--accent-glow)'
                            : 'transparent',
                        color: isSelected
                          ? 'var(--accent)'
                          : isHovered
                            ? 'var(--text-primary)'
                            : 'var(--text-secondary)',
                      }}
                    >
                      <span className="flex items-center gap-2.5 truncate">
                        {option.icon}
                        <span className={`text-sm ${isSelected ? 'font-semibold' : 'font-medium'}`}>
                          {option.label}
                        </span>
                      </span>

                      {/* Selected indicator */}
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', damping: 15, stiffness: 300 }}
                          className="flex-shrink-0 w-2 h-2 rounded-full"
                          style={{ background: 'var(--accent)' }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Bottom accent line */}
              <div
                className="h-0.5 w-full"
                style={{
                  background: 'linear-gradient(90deg, transparent, var(--accent), transparent)',
                  opacity: 0.5,
                }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
