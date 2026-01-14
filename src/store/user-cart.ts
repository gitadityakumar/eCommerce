import { create } from 'zustand';
import { getCartCountAction } from '@/lib/actions/storefront-cart';

interface UserCartState {
  count: number;
  setCount: (count: number) => void;
  fetchCount: () => Promise<void>;
}

export const useUserCartStore = create<UserCartState>(set => ({
  count: 0,
  setCount: count => set({ count }),
  fetchCount: async () => {
    try {
      const count = await getCartCountAction();
      set({ count });
    }
    catch (error) {
      console.error('Failed to fetch user cart count:', error);
    }
  },
}));
