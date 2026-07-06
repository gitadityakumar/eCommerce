'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { setParam } from '@/lib/utils/query';

const OPTIONS = [
  { label: 'Featured', value: 'featured' },
  { label: 'Newest', value: 'newest' },
  { label: 'Price (High → Low)', value: 'price_desc' },
  { label: 'Price (Low → High)', value: 'price_asc' },
] as const;

export default function Sort() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = useMemo(() => `?${searchParams.toString()}`, [searchParams]);
  const selected = searchParams.get('sort') ?? 'featured';

  const onChange = (value: string) => {
    const withSort = setParam(pathname, search, 'sort', value);
    const withPageReset = setParam(pathname, new URL(withSort, 'http://dummy').search, 'page', '1');
    router.push(withPageReset, { scroll: false });
  };

  return (
    <div className="inline-flex items-center gap-3">
      <span className="text-sm font-medium text-text-secondary">Sort by</span>
      <Select value={selected} onValueChange={onChange}>
        <SelectTrigger
          aria-label="Sort products"
          className="h-12 min-w-60 rounded-2xl border-border-subtle bg-surface px-5 text-base text-text-primary shadow-soft transition-all hover:border-accent/45 hover:bg-accent/5 focus-visible:border-accent focus-visible:ring-accent/25"
        >
          <SelectValue placeholder="Featured" />
        </SelectTrigger>
        <SelectContent className="rounded-2xl border-border-subtle bg-background/98 p-1 text-text-primary shadow-lifted backdrop-blur-md">
          {OPTIONS.map(o => (
            <SelectItem
              key={o.value}
              value={o.value}
              className="rounded-xl px-4 py-3 text-sm text-text-primary transition-colors focus:bg-accent/10 focus:text-accent data-[highlighted]:bg-accent/10 data-[highlighted]:text-accent data-checked:bg-accent data-checked:text-white"
            >
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
