'use client';

import { IconTrash } from '@tabler/icons-react';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { Card } from '@/components';
import { Button } from '@/components/ui/button';
import { removeFromWishlistAction } from '@/lib/actions/wishlist';
import { useWishlistStore } from '@/store/wishlist';

interface WishlistItemProps {
  item: any;
}

export function WishlistItem({ item }: WishlistItemProps) {
  const removeItem = useWishlistStore(s => s.removeItem);
  const [isPending, startTransition] = useTransition();

  const handleRemove = () => {
    startTransition(async () => {
      const result = await removeFromWishlistAction(item.id);
      if (result.success) {
        removeItem(item.product.id);
        toast.success('Item removed from Atelier');
      }
      else {
        toast.error(result.error || 'Failed to remove item');
      }
    });
  };

  const product = item.product;
  const price = product.variants?.[0]?.price;
  const formattedPrice = price ? `₹${Number(price).toFixed(2)}` : undefined;

  return (
    <div className="relative group/item">
      <Card
        title={product.name}
        subtitle={product.subtitle ?? undefined}
        imageSrc={product.images?.[0]?.url ?? '/shoes/shoe-1.jpg'}
        price={formattedPrice}
        href={`/products/${product.id}`}
        className="h-full"
      />
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-3 right-3 opacity-0 group-hover/item:opacity-100 transition-opacity bg-background/80 backdrop-blur-md hover:bg-destructive hover:text-destructive-foreground rounded-full shadow-soft z-10"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleRemove();
        }}
        disabled={isPending}
      >
        <IconTrash size={18} />
      </Button>
    </div>
  );
}
