'use client';

import { useMemo } from 'react';
import { useVariantStore } from '@/store/variant';

export interface StockBadgeProps {
  productId: string;
  variants: any[];
  galleryVariants: any[];
}

export default function StockBadge({ productId, variants, galleryVariants }: StockBadgeProps) {
  const selectedSize = useVariantStore(s => s.getSelectedSize(productId));
  const selectedColorIndex = useVariantStore(s => s.getSelected(productId, 0));

  const status = useMemo(() => {
    // 1. Identify selected color
    const selectedColorName = galleryVariants[selectedColorIndex]?.color;

    // 2. Identify specific variant
    // We need a variant that matches BOTH color (if applicable) and size (if applicable)
    // Note: If size is NOT selected, we can't be specific about stock unless ALL variants of that color are OOS.
    // But per requirements, we want to show stock for the *specific* variant.

    if (!selectedColorName || !selectedSize) {
      if (!selectedColorName)
        return null; // Should have a color selected by default usually

      // If color is selected but size is NOT, maybe show "Select Size"?
      // Or show generally if that color is available?
      // Let's default to nothing or "Select Size" state if we want strictness.
      // But typically we show "In Stock" if at least one size is available?
      // Let's stick to specific variant check as requested.
      return { label: 'Select Size', color: 'text-muted-foreground' };
    }

    const specificVariant = variants.find(v =>
      v.color?.name === selectedColorName && v.size?.name === selectedSize,
    );

    if (!specificVariant) {
      return { label: 'Unavailable', color: 'text-red-600' };
    }

    // Check specific stock
    // Check specific stock
    const inStock = (specificVariant.inventory?.available ?? 0) > 0;

    if (inStock) {
      return { label: 'In Stock', color: 'text-green-600' };
    }
    else {
      return { label: 'Out of Stock', color: 'text-red-600' };
    }
  }, [variants, galleryVariants, selectedColorIndex, selectedSize]);

  if (!status)
    return null;

  return (
    <span className={`text-body-medium ${status.color}`}>
      {status.label}
    </span>
  );
}
