'use client';

import type { SelectColor, SelectGender, SelectSize } from '@/lib/db/schema';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { getArrayParam, getStringParam, removeParams, setParam, toggleArrayParam } from '@/lib/utils/query';

const PRICE_MAX = 500; // Adjusted based on current range, can be dynamic

type GroupKey = 'gender' | 'size' | 'color' | 'price';

interface FiltersProps {
  genders: SelectGender[];
  sizes: SelectSize[];
  colors: SelectColor[];
}

export default function Filters({ genders, sizes, colors }: FiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = useMemo(() => `?${searchParams.toString()}`, [searchParams]);

  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<Record<GroupKey, boolean>>({
    gender: true,
    size: true,
    color: true,
    price: true,
  });

  // Price range state
  const initialMin = Number(getStringParam(search, 'priceMin')) || 0;
  const initialMax = Number(getStringParam(search, 'priceMax')) || PRICE_MAX;
  const [priceRange, setPriceRange] = useState<[number, number]>([initialMin, initialMax]);

  // Sync state with URL when search params change externally (e.g., Clear All)
  useEffect(() => {
    setPriceRange([
      Number(getStringParam(search, 'priceMin')) || 0,
      Number(getStringParam(search, 'priceMax')) || PRICE_MAX,
    ]);
  }, [search]);

  const updatePriceParams = (range: [number, number]) => {
    let url = setParam(pathname, search, 'priceMin', range[0] > 0 ? range[0] : undefined);
    url = setParam(pathname, url.split('?')[1] ? `?${url.split('?')[1]}` : '', 'priceMax', range[1] < PRICE_MAX ? range[1] : undefined);

    // Also clear old 'price' array param if it exists to avoid conflicts
    const finalUrl = removeParams(pathname, url.split('?')[1] ? `?${url.split('?')[1]}` : '', ['price']);
    router.push(finalUrl, { scroll: false });
  };

  const activeCounts = {
    gender: getArrayParam(search, 'gender').length,
    size: getArrayParam(search, 'size').length,
    color: getArrayParam(search, 'color').length,
    price: (getStringParam(search, 'priceMin') || getStringParam(search, 'priceMax')) ? 1 : 0,
  };

  useEffect(() => {
    setOpen(false);
  }, [search]);

  const onToggle = (key: GroupKey, value: string) => {
    const url = toggleArrayParam(pathname, search, key, value);
    router.push(url, { scroll: false });
  };

  const clearAll = () => {
    const url = removeParams(pathname, search, ['gender', 'size', 'color', 'price', 'priceMin', 'priceMax', 'page']);
    router.push(url, { scroll: false });
  };

  const Group = ({
    title,
    children,
    k,
  }: {
    title: string;
    children: import('react').ReactNode;
    k: GroupKey;
  }) => (
    <div className="border-b border-border-subtle py-6 last:border-0">
      <button
        className="flex w-full items-center justify-between text-sm font-medium tracking-wide text-text-primary hover:text-accent transition-colors"
        onClick={() => setExpanded(s => ({ ...s, [k]: !s[k] }))}
        aria-expanded={expanded[k]}
        aria-controls={`${k}-section`}
      >
        <span>{title}</span>
        <span className="text-text-secondary opacity-50">{expanded[k] ? '−' : '+'}</span>
      </button>
      <div id={`${k}-section`} className={`${expanded[k] ? 'mt-4 block' : 'hidden'}`}>
        {children}
      </div>
    </div>
  );

  return (
    <>
      <div className="mb-6 flex items-center justify-between md:hidden px-4 py-3 bg-surface rounded-xl border border-border-subtle">
        <button
          className="text-sm font-medium text-text-primary hover:text-accent transition-colors"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
        >
          Filters
        </button>
        <button className="text-xs text-text-secondary underline hover:text-accent transition-colors" onClick={clearAll}>
          Clear all
        </button>
      </div>

      <aside className="sticky top-24 hidden h-fit min-w-64 rounded-2xl border border-border-subtle bg-surface p-6 shadow-soft md:block">
        <div className="mb-6 flex items-center justify-between border-b border-border-subtle pb-4">
          <h3 className="text-lg font-light tracking-tight text-text-primary">Refine</h3>
          <button className="text-xs text-text-secondary underline hover:text-accent transition-colors" onClick={clearAll}>
            Clear all
          </button>
        </div>

        <Group title={`Gender ${activeCounts.gender ? `(${activeCounts.gender})` : ''}`} k="gender">
          <ul className="space-y-3">
            {genders.map((g) => {
              const checked = getArrayParam(search, 'gender').includes(g.slug);
              return (
                <li key={g.id} className="flex items-center gap-3 group cursor-pointer">
                  <input
                    id={`gender-${g.slug}`}
                    type="checkbox"
                    className="h-4 w-4 rounded border-border-subtle bg-background accent-accent transition-all cursor-pointer"
                    checked={checked}
                    onChange={() => onToggle('gender' as GroupKey, g.slug)}
                  />
                  <label htmlFor={`gender-${g.slug}`} className="text-sm text-text-secondary group-hover:text-text-primary transition-colors cursor-pointer">
                    {g.label}
                  </label>
                </li>
              );
            })}
          </ul>
        </Group>

        <Group title={`Size ${activeCounts.size ? `(${activeCounts.size})` : ''}`} k="size">
          <ul className="grid grid-cols-4 gap-2">
            {sizes.map((s) => {
              const checked = getArrayParam(search, 'size').includes(s.slug);
              return (
                <li key={s.id}>
                  <button
                    onClick={() => onToggle('size', s.slug)}
                    className={`w-full flex items-center justify-center rounded-lg border py-2 text-xs transition-all ${
                      checked
                        ? 'bg-accent border-accent text-white shadow-soft shadow-accent/20'
                        : 'border-border-subtle text-text-secondary hover:border-accent/40 hover:text-text-primary'
                    }`}
                  >
                    {s.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </Group>

        <Group title={`Color ${activeCounts.color ? `(${activeCounts.color})` : ''}`} k="color">
          <ul className="grid grid-cols-2 gap-3">
            {colors.map((c) => {
              const checked = getArrayParam(search, 'color').includes(c.slug);
              return (
                <li key={c.id} className="flex items-center gap-3 group cursor-pointer">
                  <input
                    id={`color-${c.slug}`}
                    type="checkbox"
                    className="h-4 w-4 rounded border-border-subtle bg-background accent-accent transition-all cursor-pointer"
                    checked={checked}
                    onChange={() => onToggle('color', c.slug)}
                  />
                  <label htmlFor={`color-${c.slug}`} className="text-sm text-text-secondary group-hover:text-text-primary capitalize transition-colors cursor-pointer">
                    {c.name}
                  </label>
                </li>
              );
            })}
          </ul>
        </Group>

        <Group title={`Price ${activeCounts.price ? '(1)' : ''}`} k="price">
          <div className="px-2 pt-2">
            <Slider
              defaultValue={[0, PRICE_MAX]}
              value={priceRange}
              max={PRICE_MAX}
              step={10}
              onValueChange={v => setPriceRange(v as [number, number])}
              onValueCommit={v => updatePriceParams(v as [number, number])}
              className="mb-6"
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs font-medium text-text-secondary bg-surface-variant/50 px-2 py-1 rounded">
                ₹
                {priceRange[0]}
              </span>
              <span className="text-xs font-medium text-text-secondary bg-surface-variant/50 px-2 py-1 rounded">
                ₹
                {priceRange[1]}
                {priceRange[1] === PRICE_MAX ? '+' : ''}
              </span>
            </div>
          </div>
        </Group>
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            aria-hidden="true"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-80 max-w-[85%] overflow-auto bg-surface p-8 shadow-2xl transition-all duration-300">
            <div className="mb-8 flex items-center justify-between border-b border-border-subtle pb-6">
              <h3 className="text-2xl font-light tracking-tight text-text-primary">Filters</h3>
              <button className="text-xs text-text-secondary underline hover:text-accent transition-colors" onClick={clearAll}>
                Clear all
              </button>
            </div>
            <div className="md:hidden">
              <Group title="Gender" k="gender">
                <ul className="space-y-4">
                  {genders.map((g) => {
                    const checked = getArrayParam(search, 'gender').includes(g.slug);
                    return (
                      <li key={g.id} className="flex items-center gap-4 group">
                        <input
                          id={`m-gender-${g.slug}`}
                          type="checkbox"
                          className="h-5 w-5 rounded border-border-subtle bg-background accent-accent transition-all"
                          checked={checked}
                          onChange={() => onToggle('gender', g.slug)}
                        />
                        <label htmlFor={`m-gender-${g.slug}`} className="text-base text-text-secondary group-hover:text-text-primary transition-colors">
                          {g.label}
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </Group>

              <Group title="Size" k="size">
                <ul className="grid grid-cols-4 gap-3">
                  {sizes.map((s) => {
                    const checked = getArrayParam(search, 'size').includes(s.slug);
                    return (
                      <li key={s.id}>
                        <button
                          onClick={() => onToggle('size', s.slug)}
                          className={`w-full flex items-center justify-center rounded-lg border py-3 text-sm transition-all ${
                            checked
                              ? 'bg-accent border-accent text-white shadow-soft'
                              : 'border-border-subtle text-text-secondary'
                          }`}
                        >
                          {s.name}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </Group>

              <Group title="Color" k="color">
                <ul className="grid grid-cols-2 gap-4">
                  {colors.map((c) => {
                    const checked = getArrayParam(search, 'color').includes(c.slug);
                    return (
                      <li key={c.id} className="flex items-center gap-4 group">
                        <input
                          id={`m-color-${c.slug}`}
                          type="checkbox"
                          className="h-5 w-5 rounded border-border-subtle bg-background accent-accent transition-all"
                          checked={checked}
                          onChange={() => onToggle('color', c.slug)}
                        />
                        <label htmlFor={`m-color-${c.slug}`} className="text-base text-text-secondary group-hover:text-text-primary capitalize transition-colors">
                          {c.name}
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </Group>

              <Group title="Price" k="price">
                <div className="px-2 pt-4 pb-2">
                  <Slider
                    defaultValue={[0, PRICE_MAX]}
                    value={priceRange}
                    max={PRICE_MAX}
                    step={10}
                    onValueChange={v => setPriceRange(v as [number, number])}
                    className="mb-8"
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-widest text-text-secondary/60 mb-1">Min Price</span>
                      <span className="text-lg font-light text-text-primary">
                        ₹
                        {priceRange[0]}
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] uppercase tracking-widest text-text-secondary/60 mb-1">Max Price</span>
                      <span className="text-lg font-light text-text-primary">
                        ₹
                        {priceRange[1]}
                        {priceRange[1] === PRICE_MAX ? '+' : ''}
                      </span>
                    </div>
                  </div>
                </div>
              </Group>
            </div>
            <button
              onClick={() => {
                updatePriceParams(priceRange);
                setOpen(false);
              }}
              className="w-full mt-12 bg-accent text-white py-4 rounded-full text-sm font-bold tracking-widest uppercase hover:bg-accent/90 transition-all shadow-soft active:scale-95"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </>
  );
}
