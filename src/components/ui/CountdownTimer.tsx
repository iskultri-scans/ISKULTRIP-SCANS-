'use client';

import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: Date;
  onComplete?: () => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function CountdownTimer({ targetDate, onComplete }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    function calculateTime() {
      const now = new Date().getTime();
      const target = targetDate.getTime();
      const difference = target - now;

      if (difference <= 0) {
        setIsComplete(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        onComplete?.();
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      });
    }

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate, onComplete]);

  const blocks = [
    { value: timeLeft.days, label: 'দিন' },
    { value: timeLeft.hours, label: 'ঘণ্টা' },
    { value: timeLeft.minutes, label: 'মিনিট' },
    { value: timeLeft.seconds, label: 'সেকেন্ড' },
  ];

  if (isComplete) {
    return (
      <div
        className="px-3 py-1.5 rounded-lg text-xs font-bold"
        style={{ background: 'var(--accent-glow)', color: 'var(--accent)' }}
      >
        এখন উপলব্ধ! Available Now!
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      {blocks.map((block, i) => (
        <React.Fragment key={block.label}>
          <div className="flex flex-col items-center">
            <div
              className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-lg text-sm sm:text-base font-bold"
              style={{
                background: 'var(--accent-glow)',
                color: 'var(--accent)',
                border: '1px solid var(--accent)',
                boxShadow: '0 0 10px var(--accent-glow)',
              }}
            >
              {String(block.value).padStart(2, '0')}
            </div>
            <span className="text-[9px] sm:text-[10px] text-[var(--text-muted)] mt-0.5">
              {block.label}
            </span>
          </div>
          {i < blocks.length - 1 && (
            <span className="text-[var(--accent)] font-bold text-sm mb-4">:</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
