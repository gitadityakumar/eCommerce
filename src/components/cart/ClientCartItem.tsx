'use client';

import { Minus, Plus, X } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { formatINR } from '@/lib/currency';
import { useCartStore } from '@/store/cart';

interface ClientCartItemProps {
  item: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  };
}

export function ClientCartItem({ item }: ClientCartItemProps) {
  const updateQuantity = useCartStore(s => s.updateQuantity);
  const removeItem = useCartStore(s => s.removeItem);

  const handleUpdateQuantity = (newQuantity: number) => {
    if (newQuantity < 1)
      return;
    updateQuantity(item.id, newQuantity);
  };

  const handleRemove = () => {
    removeItem(item.id);
    toast.success('Item removed from cart');
  };

  return (
    <div className="flex gap-6 py-8 border-b border-border-subtle last:border-0 items-start group">
      <div className="relative aspect-square w-24 sm:w-32 bg-bg-secondary rounded-xl overflow-hidden shrink-0 shadow-soft">
        <Image
          src={item.image || '/placeholder.png'}
          alt={item.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 dark:opacity-80 group-hover:opacity-100"
        />
      </div>

      <div className="flex flex-col flex-1 min-h-[128px]">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-xl font-light text-text-primary tracking-tight leading-tight group-hover:text-accent transition-colors">{item.name}</h3>
            <p className="text-xs text-text-secondary uppercase tracking-widest mt-2 opacity-70 italic">Essential Piece</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 -mr-2 text-text-secondary hover:text-accent hover:bg-accent/10 transition-all rounded-full"
            onClick={handleRemove}
            aria-label="Remove item"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center border border-border-subtle rounded-full overflow-hidden h-10 bg-surface">
            <button
              className="h-full px-3 text-text-secondary hover:bg-bg-secondary hover:text-text-primary disabled:opacity-30 transition-all"
              onClick={() => handleUpdateQuantity(item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-8 text-center text-xs font-medium tabular-nums text-text-primary">
              {item.quantity}
            </span>
            <button
              className="h-full px-3 text-text-secondary hover:bg-bg-secondary hover:text-text-primary disabled:opacity-30 transition-all"
              onClick={() => handleUpdateQuantity(item.quantity + 1)}
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
          <div className="text-lg font-medium text-text-primary">
            {formatINR(item.price * item.quantity)}
          </div>
        </div>
      </div>
    </div>
  );
}
