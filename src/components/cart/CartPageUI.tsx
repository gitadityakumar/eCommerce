'use client';

import { ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth';
import { useCartStore } from '@/store/cart';
import { CartItem } from './CartItem';
import { ClientCartItem } from './ClientCartItem';
import { ClientOrderSummary } from './ClientOrderSummary';
import { OrderSummary } from './OrderSummary';

interface CartPageUIProps {
  cart: any;
}

export function CartPageUI({ cart }: CartPageUIProps) {
  const user = useAuthStore(s => s.user);
  const serverItems = cart?.items || [];
  const serverItemCount = serverItems.reduce((acc: number, item: any) => acc + item.quantity, 0);

  const clientItems = useCartStore(s => s.items);
  const clientItemCount = useCartStore(s => s.getItemCount());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const showingClient = !user && mounted;
  const items = showingClient ? clientItems : serverItems;
  const itemCount = showingClient ? clientItemCount : serverItemCount;

  if (!mounted) {
    return <div className="min-h-[50vh] flex items-center justify-center text-text-secondary font-light">Loading...</div>;
  }

  if (itemCount === 0) {
    return (
      <div className="flex flex-col mt-5 items-center justify-center min-h-[70vh] gap-8 bg-background transition-colors duration-500">
        <div className="relative">
          <div className="absolute inset-0 bg-accent/10 blur-3xl rounded-full" />
          <Image
            src="https://cdn.perpetuity.dev/assets/handbagforecomno-bg.png"
            alt="Empty Shopping Bag"
            width={400}
            height={400}
            className="w-[280px] h-[280px] md:w-[350px] md:h-[350px] object-contain relative z-10 opacity-80 dark:opacity-60 grayscale hover:grayscale-0 transition-all duration-700"
            priority
          />
        </div>
        <div className="text-center space-y-4 px-6 relative z-10">
          <h1 className="text-4xl font-light text-text-primary tracking-tight font-playfair italic">Your Trove is Empty</h1>
          <p className="text-text-secondary max-w-sm mx-auto font-light leading-relaxed">
            The collection awaits. Discover pieces that define your silhouette.
          </p>
        </div>

        <Link
          href="/products"
          className="bg-accent text-white px-12 py-4 rounded-full font-bold tracking-[0.2em] uppercase hover:bg-accent/90 transition-all shadow-soft active:scale-95"
        >
          Discover Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-500 py-8 md:py-16">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="flex flex-col gap-2 md:gap-4 items-center mb-8 md:mb-16 text-center">
          <span className="text-accent text-[10px] md:text-xs tracking-[0.4em] uppercase">Shopping Cart</span>
          <h1 className="text-3xl md:text-5xl font-light text-text-primary tracking-tighter">Your Bag</h1>
          <div className="w-12 h-px bg-border-subtle" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            <div className="bg-surface border border-border-subtle rounded-2xl overflow-hidden shadow-soft">
              <div className="p-6 md:p-8 border-b border-border-subtle flex items-center justify-between">
                <div className="flex items-center gap-2 md:gap-3">
                  <ShoppingBag className="h-5 w-5 text-accent" />
                  <h2 className="text-xl font-light text-text-primary tracking-tight">
                    Cart Items
                  </h2>
                </div>
                <span className="text-sm text-text-secondary font-light">
                  {itemCount}
                  {' '}
                  {itemCount === 1 ? 'Item' : 'Items'}
                </span>
              </div>
              <div className="p-4 md:p-8 pt-2">
                {showingClient
                  ? (
                      items.map((item: any) => (
                        <ClientCartItem key={item.id} item={item} />
                      ))
                    )
                  : (
                      items.map((item: any) => (
                        <CartItem key={item.id} item={item} />
                      ))
                    )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <Suspense fallback={<div className="h-96 w-full bg-surface border border-border-subtle animate-pulse rounded-2xl" />}>
              {showingClient
                ? (
                    <ClientOrderSummary />
                  )
                : (
                    <OrderSummary items={items} />
                  )}
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
