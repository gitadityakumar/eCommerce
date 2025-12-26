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
    <div className="flex gap-4 py-6 border-b last:border-0 items-start">
      <div className="relative aspect-square w-24 sm:w-32 bg-secondary rounded-lg overflow-hidden shrink-0">
        <Image
          src={item.image || '/placeholder.png'}
          alt={item.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex flex-col flex-1 gap-1">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg leading-tight text-foreground">{item.name}</h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 -mr-2"
            onClick={handleRemove}
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
              disabled={item.quantity <= 1}
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
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <div className="font-bold text-lg">
            {formatINR(item.price * item.quantity)}
          </div>
        </div>
      </div>
    </div>
  );
}
