'use client';

import { Check } from 'lucide-react';
import Image from 'next/image';
import { useVariantStore } from '@/store/variant';

interface Variant { color: string; images: string[] }

export interface ColorSwatchesProps {
  productId: string;
  variants: Variant[];
  allVariants?: any[]; // Pass all raw variants to check stock
  className?: string;
}

function firstValidImage(images: string[]) {
  return images.find(s => typeof s === 'string' && s.trim().length > 0);
}

export default function ColorSwatches({ productId, variants, allVariants = [], className = '' }: ColorSwatchesProps) {
  const setSelected = useVariantStore(s => s.setSelected);
  const selected = useVariantStore(s => s.getSelected(productId, 0));

  return (
    <div className={`flex flex-wrap gap-3 ${className}`} role="listbox" aria-label="Choose color">
      {variants.map((v, i) => {
        const src = firstValidImage(v.images);
        if (!src)
          return null;

        // precise check: is there ANY variant with this color that is in stock?
        // Note: v.color is the color name. We need to match it against allVariants.
        // Assuming allVariants elements have `color: { name: string }` and `inStock: boolean` (or similar logic)
        // If allVariants is empty (legacy usage), default to available.
        const isAvailable = allVariants.length === 0 || allVariants.some(
          av => av.color?.name === v.color && ((av.inventory?.available ?? 0) > 0),
        );

        const isActive = selected === i;
        return (
          <button
            key={`${v.color}-${i}`}
            onClick={() => isAvailable && setSelected(productId, i)}
            disabled={!isAvailable}
            aria-label={`Color ${v.color}`}
            aria-selected={isActive}
            role="option"
            className={`relative h-[72px] w-[120px] overflow-hidden rounded-lg ring-1 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-dark-500] dark:focus-visible:ring-[--color-light-500] ${
              isActive
                ? 'ring-[--color-dark-500] dark:ring-[--color-light-500]'
                : isAvailable
                  ? 'ring-light-300 dark:ring-dark-300 hover:ring-dark-500 dark:hover:ring-light-500 cursor-pointer'
                  : 'ring-gray-200 opacity-50 cursor-not-allowed grayscale'
            }`}
          >
            <Image src={src} alt={v.color} fill sizes="120px" className="object-cover" />
            {isActive && (
              <span className="absolute right-1 top-1 rounded-full bg-light-100 dark:bg-dark-800 p-1">
                <Check className="h-4 w-4 text-dark-900 dark:text-light-900" />
              </span>
            )}
            {!isAvailable && (
              <span className="absolute inset-0 bg-white/50 dark:bg-black/50" />
            )}
          </button>
        );
      })}
    </div>
  );
}
