'use client';

import { ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { useCartStore } from '@/store/cart';
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

  // Logic to determine if valid variant is selected and in stock
  const selectedColorName = galleryVariants[selectedColorIndex]?.color;

  const specificVariant = variants.find(v =>
    v.color?.name === selectedColorName && v.size?.name === selectedSize,
  );

  // If we require strict selection (Color + Size), button is disabled if either is missing or if specific variant is OOS.
  // Exception: If product checks for "only color needed" (no sizes), this logic would need adjustment,
  // but current requirements emphasize sizes.

  const isSelectionComplete = !!selectedColorName && !!selectedSize;
  const inStock = specificVariant ? ((specificVariant.inventory?.available ?? 0) > 0) : false;

  const isDisabled = !isSelectionComplete || !inStock;

  const handleAddToBag = () => {
    if (!specificVariant || isDisabled)
      return;

    addItem({
      id: specificVariant.id,
      name: `${name} - ${selectedColorName} / ${selectedSize}`,
      price: Number(specificVariant.salePrice || specificVariant.price),
      image: galleryVariants[selectedColorIndex]?.images[0],
    });

    toast.success('Added to bag', {
      description: `${name} (${selectedColorName}, ${selectedSize}) has been added to your cart.`,
    });
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
      {inStock ? 'Add to Bag' : 'Out of Stock'}
    </button>
  );
}
