'use client';

import { Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useTransition } from 'react';
import { toast } from 'sonner';
import { toggleWishlistAction } from '@/lib/actions/wishlist';
import { cn } from '@/lib/utils';
import { useWishlistStore } from '@/store/wishlist';

interface WishlistButtonProps {
  productId: string;
  initialIsWishlisted?: boolean;
}

export default function WishlistButton({ productId, initialIsWishlisted = false }: WishlistButtonProps) {
  const isWishlisted = useWishlistStore(s => s.isWishlisted(productId));
  const addItem = useWishlistStore(s => s.addItem);
  const removeItem = useWishlistStore(s => s.removeItem);

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Initialize store with server state if needed
  useEffect(() => {
    if (initialIsWishlisted) {
      addItem(productId);
    }
  }, [initialIsWishlisted, productId, addItem]);

  const handleToggle = () => {
    startTransition(async () => {
      const result = await toggleWishlistAction(productId);
      if (result.success) {
        if (result.action === 'added') {
          addItem(productId);
          toast.success('Added to Atelier');
        }
        else {
          removeItem(productId);
          toast.success('Removed from Atelier');
        }
        router.refresh();
      }
      else {
        if (result.error === 'User must be logged in') {
          toast.error('Please sign in to save items');
          router.push(`/sign-in?callbackUrl=/products/${productId}`);
        }
        else {
          toast.error(result.error || 'Something went wrong');
        }
      }
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={cn(
        'flex h-14 w-full items-center justify-center gap-3 rounded-full border border-border-subtle px-8 text-[10px] font-bold tracking-[0.2em] uppercase text-text-primary transition-all hover:bg-surface hover:border-accent hover:text-accent group relative overflow-hidden',
        isWishlisted && 'bg-accent/5 border-accent text-accent',
      )}
    >
      <Heart
        className={cn(
          'h-4 w-4 transition-transform group-hover:scale-110',
          isWishlisted && 'fill-accent text-accent',
        )}
      />
      <span>{isWishlisted ? 'Saved to Atelier' : 'Save to Atelier'}</span>
    </button>
  );
}
