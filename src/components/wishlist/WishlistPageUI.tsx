'use client';

import { IconShoppingBagHeart } from '@tabler/icons-react';
import Link from 'next/link';
import { useEffect } from 'react';
import { useWishlistStore } from '@/store/wishlist';
import { WishlistItem } from './WishlistItem';

interface WishlistPageUIProps {
  items: any[] | null;
}

export function WishlistPageUI({ items }: WishlistPageUIProps) {
  const setItems = useWishlistStore(s => s.setItems);

  useEffect(() => {
    if (items) {
      setItems(items.map(item => item.productId));
    }
  }, [items, setItems]);

  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-8 bg-background transition-colors duration-500">
        <div className="relative">
          <div className="absolute inset-0 bg-accent/10 blur-3xl rounded-full" />
          <div className="relative z-10 w-[280px] h-[280px] md:w-[350px] md:h-[350px] flex items-center justify-center">
            <IconShoppingBagHeart size={200} className="text-accent/20" strokeWidth={1} />
          </div>
        </div>
        <div className="text-center space-y-4 px-6 relative z-10">
          <h1 className="text-4xl font-light text-text-primary tracking-tight font-playfair italic">Your Atelier is Empty</h1>
          <p className="text-text-secondary max-w-sm mx-auto font-light leading-relaxed">
            Curate your selection. Save pieces that resonate with your personal aesthetic.
          </p>
        </div>

        <Link
          href="/products"
          className="bg-accent text-white px-12 py-4 rounded-full font-bold tracking-[0.2em] uppercase hover:bg-accent/90 transition-all shadow-soft active:scale-95"
        >
          Explore Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-500 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col gap-4 items-center mb-16 text-center">
          <span className="text-accent text-xs tracking-[0.4em] uppercase">Private Collection</span>
          <h1 className="text-5xl font-light text-text-primary tracking-tighter">Your Atelier</h1>
          <div className="w-12 h-px bg-border-subtle" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
          {items.map(item => (
            <WishlistItem key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
