'use client';
import React from 'react';
import { cn } from '@/lib/utils';

export function Menu({
  setActive,
  children,
  className,
}: {
  setActive: (item: string | null) => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <nav
      onMouseLeave={() => setActive(null)} // resets the state
      className={cn(
        'relative rounded-full border border-transparent dark:bg-black dark:border-white/20 bg-white shadow-input flex justify-center space-x-4 px-8 py-6 ',
        className,
      )}
    >
      {children}
    </nav>
  );
}
