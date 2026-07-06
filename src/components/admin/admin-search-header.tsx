'use client';

import type { ReactNode } from 'react';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AdminSearchHeaderProps {
  icon: ReactNode;
  title: string;
  description: string;
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  addHref?: string;
  addLabel?: string;
  addIcon?: ReactNode;
}

export function AdminSearchHeader({
  icon,
  title,
  description,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  addHref,
  addLabel,
  addIcon,
}: AdminSearchHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-surface/50 p-8 rounded-2xl border border-border-subtle shadow-soft backdrop-blur-md transition-all duration-500">
      <div>
        <h1 className="text-4xl font-light tracking-tighter text-text-primary font-playfair italic flex items-center gap-3">
          {icon}
          {title}
        </h1>
        <p className="text-sm text-text-secondary mt-2 font-light tracking-tight">
          {description}
        </p>
      </div>

      <div className="flex items-center gap-4 w-full md:w-auto">
        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-text-secondary group-focus-within:text-accent transition-colors" />
          <Input
            placeholder={searchPlaceholder}
            className="pl-11 bg-background/50 border-border-subtle rounded-full h-11 focus:ring-accent/20 focus:border-accent/40 transition-all placeholder:text-text-secondary/50 placeholder:font-light"
            value={searchValue}
            onChange={e => onSearchChange(e.target.value)}
          />
        </div>
        {addHref && addLabel && (
          <Button asChild className="bg-accent text-white hover:bg-accent/90 rounded-full px-6 font-bold tracking-widest uppercase text-[10px] shadow-soft shadow-accent/20 h-11 transition-all hover:-translate-y-0.5 active:scale-95">
            <Link href={addHref} className="flex items-center gap-2">
              {addIcon}
              {addLabel}
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
