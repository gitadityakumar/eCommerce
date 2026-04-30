'use client';

import { useCartStore } from '@/store/cart';
import { OrderSummary } from './OrderSummary';

export function ClientOrderSummary() {
  const items = useCartStore(s => s.items);
  return <OrderSummary items={items} />;
}
