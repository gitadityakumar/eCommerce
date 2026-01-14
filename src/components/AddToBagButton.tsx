'use client';

import { ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { addToCartAction } from '@/lib/actions/storefront-cart';
import { useAuthStore } from '@/store/auth';
import { useCartStore } from '@/store/cart';
import { useUserCartStore } from '@/store/user-cart';
import { useVariantStore } from '@/store/variant';

export interface AddToBagButtonProps {
  productId: string;
  name: string;
  variants: any[];
  galleryVariants: any[];
}

export default function AddToBagButton({ productId, name, variants, galleryVariants }: AddToBagButtonProps) {
  const selectedSize = useVariantStore(s => s.getSelectedSize(productId));
  const selectedColorIndex = useVariantStore(s => s.getSelected(productId, 0));
  const addItem = useCartStore(s => s.addItem);
  const setUserCount = useUserCartStore(s => s.setCount);
  const user = useAuthStore(s => s.user);
  const [isAdding, setIsAdding] = useState(false);

  // Logic to determine if valid variant is selected and in stock
  const selectedColorName = galleryVariants[selectedColorIndex]?.color;

  const specificVariant = variants.find(v =>
    v.color?.name === selectedColorName && v.size?.name === selectedSize,
  );

  const isSelectionComplete = !!selectedColorName && !!selectedSize;
  const inStock = specificVariant ? ((specificVariant.inventory?.available ?? 0) > 0) : false;

  const isDisabled = !isSelectionComplete || !inStock || isAdding;

  const handleAddToBag = async () => {
    if (!specificVariant || isDisabled)
      return;

    const itemName = `${name} - ${selectedColorName} / ${selectedSize}`;

    if (user) {
      setIsAdding(true);
      try {
        const result = await addToCartAction(specificVariant.id, 1);
        if (result.success) {
          if (result.count !== undefined) {
            setUserCount(result.count);
          }
          toast.success('Added to bag', {
            description: `${itemName} has been added to your archival collection.`,
          });
        }
        else {
          toast.error(result.error || 'Failed to add to bag');
        }
      }
      catch (error) {
        console.error('Error adding to bag:', error);
        toast.error('An unexpected error occurred');
      }
      finally {
        setIsAdding(false);
      }
    }
    else {
      addItem({
        id: specificVariant.id,
        name: itemName,
        price: Number(specificVariant.salePrice || specificVariant.price),
        image: galleryVariants[selectedColorIndex]?.images[0],
      });

      toast.success('Added to bag', {
        description: `${itemName} has been added to your guest cart.`,
      });
    }
  };

  return (
    <button
      onClick={handleAddToBag}
      disabled={isDisabled}
      className={`flex items-center justify-center gap-2 rounded-full px-6 py-4 text-body-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
        isDisabled
          ? 'bg-muted text-muted-foreground cursor-not-allowed'
          : 'bg-primary text-primary-foreground hover:opacity-90'
      }`}
    >
      <ShoppingBag className="h-5 w-5" />
      {isAdding ? 'Adding...' : inStock ? 'Add to Bag' : 'Out of Stock'}
    </button>
  );
}
