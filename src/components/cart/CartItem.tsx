'use client';

import { Minus, Plus, X } from 'lucide-react';
import Image from 'next/image';
import { useTransition } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { removeFromCartAction, updateCartItemQuantityAction } from '@/lib/actions/storefront-cart';
import { formatINR } from '@/lib/currency';
import { useUserCartStore } from '@/store/user-cart';

interface CartItemProps {
  item: any; // Using any for brevity in this step, but ideal would be a proper type
}

export function CartItem({ item }: CartItemProps) {
  const setUserCount = useUserCartStore(s => s.setCount);
  const [isPending, startTransition] = useTransition();
  const variant = item.variant;
  const product = variant.product;
  const image = variant.images?.[0]?.url || product.images?.[0]?.url || '/placeholder.png';

  const handleUpdateQuantity = (newQuantity: number) => {
    startTransition(async () => {
      const result = await updateCartItemQuantityAction(item.id, newQuantity);
      if (!result.success) {
        toast.error('Failed to update quantity');
      }
      else if (result.count !== undefined) {
        setUserCount(result.count);
      }
    });
  };

  const handleRemove = () => {
    startTransition(async () => {
      const result = await removeFromCartAction(item.id);
      if (!result.success) {
        toast.error('Failed to remove item');
      }
      else {
        if (result.count !== undefined) {
          setUserCount(result.count);
        }
        toast.success('Item removed from cart');
      }
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 py-6 md:py-8 border-b border-border-subtle last:border-0 items-start group">
      <div className="relative aspect-square w-full sm:w-32 bg-bg-secondary rounded-xl overflow-hidden shrink-0 shadow-soft">
        <Image
          src={image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 dark:opacity-80 group-hover:opacity-100"
        />
      </div>

      <div className="flex flex-col flex-1 w-full min-h-0 sm:min-h-[128px]">
        <div className="flex justify-between items-start mb-2">
          <div className="pr-4">
            <h3 className="text-lg md:text-xl font-light text-text-primary tracking-tight leading-tight group-hover:text-accent transition-colors">{product.name}</h3>
            <div className="text-xs text-text-secondary uppercase tracking-widest flex items-center gap-3 mt-2 opacity-70">
              {variant.color && (
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: variant.color.hex || '#000' }} />
                  <span>{variant.color.name}</span>
                </div>
              )}
              {variant.size && (
                <span>
                  Size:
                  {' '}
                  {variant.size.name}
                </span>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 -mr-2 text-text-secondary hover:text-accent hover:bg-accent/10 transition-all rounded-full"
            onClick={handleRemove}
            disabled={isPending}
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
              disabled={isPending || item.quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-8 text-center text-xs font-medium tabular-nums text-text-primary">
              {item.quantity}
            </span>
            <button
              className="h-full px-3 text-text-secondary hover:bg-bg-secondary hover:text-text-primary disabled:opacity-30 transition-all"
              onClick={() => handleUpdateQuantity(item.quantity + 1)}
              disabled={isPending}
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
          <div className="text-lg font-medium text-text-primary">
            {formatINR(Number(variant.price) * item.quantity)}
          </div>
        </div>
      </div>
    </div>
  );
}
