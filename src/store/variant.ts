'use client';

import { create } from 'zustand';

interface State {
  selectedByProduct: Record<string, number>;
  selectedSizeByProduct: Record<string, string | null>;
  setSelected: (productId: string, index: number) => void;
  setSelectedSize: (productId: string, sizeId: string | null) => void;
  getSelected: (productId: string, fallback?: number) => number;
  getSelectedSize: (productId: string) => string | null;
}

export const useVariantStore = create<State>((set, get) => ({
  selectedByProduct: {},
  selectedSizeByProduct: {},
  setSelected: (productId, index) =>
    set(s => ({
      selectedByProduct: { ...s.selectedByProduct, [productId]: index },
    })),
  setSelectedSize: (productId, sizeId) =>
    set(s => ({
      selectedSizeByProduct: { ...s.selectedSizeByProduct, [productId]: sizeId },
    })),
  getSelected: (productId, fallback = 0) => {
    const map = get().selectedByProduct;
    return map[productId] ?? fallback;
  },
  getSelectedSize: (productId) => {
    const map = get().selectedSizeByProduct;
    return map[productId] ?? null;
  },
}));
