'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
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
    <label className="inline-flex items-center gap-3">
      <span className="text-sm font-medium text-text-secondary">Sort by</span>
      <select
        className="rounded-lg border border-border-subtle bg-surface px-4 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all cursor-pointer shadow-soft hover:border-accent/40"
        value={selected}
        onChange={e => onChange(e.target.value)}
        aria-label="Sort products"
      >
        {OPTIONS.map(o => (
          <option key={o.value} value={o.value} className="bg-surface text-text-primary">
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
