'use client';

import { ShoppingBag } from 'lucide-react';
import Image from 'next/image';

import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { useCartStore } from '@/store/cart';
import { CartItem } from './CartItem';
import { ClientCartItem } from './ClientCartItem';
import { ClientOrderSummary } from './ClientOrderSummary';
import { OrderSummary } from './OrderSummary';

interface CartPageUIProps {
  cart: any;
}

export function CartPageUI({ cart }: CartPageUIProps) {
  // Server-side items
  const serverItems = cart?.items || [];
  const serverItemCount = serverItems.reduce((acc: number, item: any) => acc + item.quantity, 0);

  // Client-side items
  const clientItems = useCartStore(s => s.items);
  const clientItemCount = useCartStore(s => s.getItemCount());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine which data to show
  // If server has items, we prefer showing them (assuming sync exists or will exist)
  // If server is empty, we fall back to client store
  const showingClient = serverItemCount === 0 && mounted;
  const items = showingClient ? clientItems : serverItems;
  const itemCount = showingClient ? clientItemCount : serverItemCount;

  if (!mounted) {
    return <div className="min-h-[50vh] flex items-center justify-center">Loading...</div>;
  }

  if (itemCount === 0) {
    return (
      <div className="flex flex-col mt-5 items-center justify-center min-h-[60vh] gap-10">
        <h1 className="text-3xl font-bold tracking-tight">Your Shopping Cart is Empty</h1>

        <Image
          src="https://cdn.perpetuity.dev/assets/handbagforecomno-bg.png"
          alt="Empty Shopping Bag"
          width={400}
          height={400}
          className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] object-contain"
          priority
        />

        <Link
          href="/products"
          className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-black/90 transition-colors"
        >
          Back to Store
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col gap-2 items-center mb-10 text-center">
        <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center mb-2">
          <ShoppingBag className="h-6 w-6" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Shopping Cart</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        <div className="lg:col-span-2 bg-card border rounded-xl overflow-hidden shadow-sm">
          <div className="p-6 border-b flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            <h2 className="text-xl font-bold">
              Cart Items (
              {itemCount}
              )
            </h2>
          </div>
          <div className="p-6 pt-0">
            {showingClient
              ? (
            // Client items render
                  items.map((item: any) => (
                    <ClientCartItem key={item.id} item={item} />
                  ))
                )
              : (
            // Server items render
                  items.map((item: any) => (
                    <CartItem key={item.id} item={item} />
                  ))
                )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <Suspense fallback={<div className="h-96 w-full bg-secondary animate-pulse rounded-xl" />}>
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
  );
}
