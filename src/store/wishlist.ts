import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistState {
  itemIds: string[];
  setItems: (ids: string[]) => void;
  addItem: (id: string) => void;
  removeItem: (id: string) => void;
  clearWishlist: () => void;
  getItemCount: () => number;
  isWishlisted: (id: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      itemIds: [],
      setItems: ids => set({ itemIds: ids }),
      addItem: (id) => {
        const itemIds = get().itemIds;
        if (!itemIds.includes(id)) {
          set({ itemIds: [...itemIds, id] });
        }
      },
      removeItem: (id) => {
        set({ itemIds: get().itemIds.filter(itemId => itemId !== id) });
      },
      clearWishlist: () => set({ itemIds: [] }),
      getItemCount: () => get().itemIds.length,
      isWishlisted: id => get().itemIds.includes(id),
    }),
    {
      name: 'wishlist-storage',
    },
  ),
);
