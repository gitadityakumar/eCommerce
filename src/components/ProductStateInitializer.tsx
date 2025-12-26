'use client';

import { useEffect, useRef } from 'react';
import { useVariantStore } from '@/store/variant';

interface InitializerProps {
  productId: string;
  variants: any[];
  galleryVariants: any[];
}

export default function ProductStateInitializer({ productId, variants, galleryVariants }: InitializerProps) {
  const isInitialized = useRef(false);
  const setSelected = useVariantStore(s => s.setSelected);
  const setSelectedSize = useVariantStore(s => s.setSelectedSize);

  useEffect(() => {
    if (isInitialized.current)
      return;

    // Find the first variant that is in stock
    const firstAvailable = variants.find(v => (v.inventory?.available ?? 0) > 0);

    if (firstAvailable) {
      // 1. Set Size
      if (firstAvailable.size?.name) {
        setSelectedSize(productId, firstAvailable.size.name);
      }

      // 2. Set Color Index
      // We need to find which galleryVariant index matches this variant's color
      if (firstAvailable.color?.name) {
        const colorIndex = galleryVariants.findIndex(gv => gv.color === firstAvailable.color?.name);
        if (colorIndex !== -1) {
          setSelected(productId, colorIndex);
        }
      }

      isInitialized.current = true;
    }
  }, [productId, variants, galleryVariants, setSelected, setSelectedSize]);

  return null;
}
