'use client';

import { Minus, Plus, X } from 'lucide-react';
import Image from 'next/image';
import { useTransition } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { removeFromCartAction, updateCartItemQuantityAction } from '@/lib/actions/storefront-cart';
import { formatINR } from '@/lib/currency';

interface CartItemProps {
  item: any; // Using any for brevity in this step, but ideal would be a proper type
}

export function CartItem({ item }: CartItemProps) {
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
    });
  };

  const handleRemove = () => {
    startTransition(async () => {
      const result = await removeFromCartAction(item.id);
      if (!result.success) {
        toast.error('Failed to remove item');
      }
      else {
        toast.success('Item removed from cart');
      }
    });
  };

  return (
    <div className="flex gap-4 py-6 border-b last:border-0 items-start">
      <div className="relative aspect-square w-24 sm:w-32 bg-secondary rounded-lg overflow-hidden shrink-0">
        <Image
          src={image}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex flex-col flex-1 gap-1">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg leading-tight text-foreground">{product.name}</h3>
            <div className="text-sm text-muted-foreground flex gap-3 mt-1">
              {variant.color && <span>{variant.color.name}</span>}
              {variant.size && (
                <span>
                  Size:
                  {variant.size.name}
                </span>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 -mr-2"
            onClick={handleRemove}
            disabled={isPending}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="flex items-center border rounded-md h-9">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-none border-r"
              onClick={() => handleUpdateQuantity(item.quantity - 1)}
              disabled={isPending || item.quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-10 text-center text-sm tabular-nums">
              {item.quantity}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-none border-l"
              onClick={() => handleUpdateQuantity(item.quantity + 1)}
              disabled={isPending}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <div className="font-bold text-lg">
            {formatINR(Number(variant.price) * item.quantity)}
          </div>
        </div>
      </div>
    </div>
  );
}
