'use client';

import { useVariantStore } from '@/store/variant';

export interface SizePickerProps {
  productId: string;
  variants: any[]; // Full raw variants
  galleryVariants: any[]; // Grouped variants for correlating color index
  className?: string;
}

export default function SizePicker({ productId, variants, galleryVariants, className = '' }: SizePickerProps) {
  const setSelectedSize = useVariantStore(s => s.setSelectedSize);
  const selectedSize = useVariantStore(s => s.getSelectedSize(productId));
  const selectedColorIndex = useVariantStore(s => s.getSelected(productId, 0));

  // 1. Determine the currently selected color name
  const selectedColorName = galleryVariants[selectedColorIndex]?.color;

  // 2. Filter variants available for this color
  //    (If no color selected/found, maybe show all sizes? Or sizes for default color?)
  //    Let's stick to "sizes available for valid selected color".
  const availableVariantsForColor = variants.filter(v => v.color?.name === selectedColorName);

  // 3. Derive unique sizes for this color
  //    Each variant has { size: { name: 'M', sortOrder: 2 }, inStock: boolean, ... }
  //    We want a list of ALL possible sizes for this color, sorted.
  const sizesForColor = availableVariantsForColor
    .filter(v => v.size) // ensure variant has a size
    .map(v => ({
      id: v.size.id,
      name: v.size.name,
      sortOrder: v.size.sortOrder,
      inStock: (v.inventory?.available ?? 0) > 0,
    }));

  // Deduplicate sizes (though mostly 1 variant per size-color combo)
  // Sort by sortOrder
  const uniqueSizes = sizesForColor
    .filter((v, i, a) => a.findIndex(t => t.name === v.name) === i)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  if (uniqueSizes.length === 0)
    return null;

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <div className="flex items-center justify-between">
        <p className="text-body-medium text-foreground">Select Size</p>
        <button className="text-caption text-muted-foreground underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          Size Guide
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
        {uniqueSizes.map((s) => {
          const isActive = selectedSize === s.name;
          // Check stock specific to this size (and implicitly the selected color)
          // Since uniqueSizes is derived from `availableVariantsForColor`, `s.inStock` should be correct for this color+size
          const isAvailable = s.inStock;

          return (
            <button
              key={s.name}
              onClick={() => isAvailable && setSelectedSize(productId, s.name)}
              disabled={!isAvailable}
              className={`rounded-lg border px-3 py-3 text-center text-body transition focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                isActive
                  ? 'border-primary text-primary'
                  : isAvailable
                    ? 'border-input text-muted-foreground hover:border-ring'
                    : 'border-input text-gray-300 cursor-not-allowed bg-gray-50'
              }`}
              aria-pressed={isActive}
            >
              {s.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
