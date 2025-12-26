'use client';

import { useVariantStore } from '@/store/variant';

export interface ColorSelectorProps {
  productId: string;
  variants: { color: string; hexCode: string | null; images: string[] }[];
  allVariants?: any[];
  className?: string;
}

export default function ColorSelector({ productId, variants, allVariants = [], className = '' }: ColorSelectorProps) {
  const setSelected = useVariantStore(s => s.setSelected);
  const selected = useVariantStore(s => s.getSelected(productId, 0));

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <p className="text-body-medium text-foreground">Color</p>
      <div className="flex flex-wrap gap-3" role="listbox" aria-label="Choose color">
        {variants.map((v, i) => {
          // Check stock availability for this color
          const isAvailable = allVariants.length === 0 || allVariants.some(
            av => av.color?.name === v.color && (av.inStock || true),
          );

          const isActive = selected === i;

          // Use a default color if hexCode is missing (should verify db guarantees this)
          const bgColor = v.hexCode || '#CCCCCC';

          return (
            <button
              key={`${v.color}-${i}`}
              onClick={() => isAvailable && setSelected(productId, i)}
              disabled={!isAvailable}
              aria-label={`Color ${v.color}`}
              aria-selected={isActive}
              role="option"
              className={`group relative h-10 w-10 overflow-hidden rounded-full border transition focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                isActive
                  ? 'border-primary ring-2 ring-primary ring-offset-2'
                  : isAvailable
                    ? 'border-transparent hover:ring-2 hover:ring-ring hover:ring-offset-2'
                    : 'border-transparent opacity-50 cursor-not-allowed'
              }`}
              style={{ backgroundColor: bgColor }}
            >
              {!isAvailable && (
                <span className="absolute inset-0 bg-white/50 dark:bg-black/50" />
              )}
              {/* Optional: Show checkmark if active, or just rely on ring? User mockup shows simple circles with selection ring.
                  Let's stick to the ring for now as per "like in this image" request usually implies matching visual style.
                  Wait, the mockup specifically shows a BLACK selected circle with white text "M" for size, but for COLOR it shows circles.
                  The second image User provided shows "Color" section with circles. One black, one white, one grey.
                  The selected one (Black) has a ring around it? Or maybe it's just filled.
                  Usually selected color has a ring offset.
              */}
            </button>
          );
        })}
      </div>
    </div>
  );
}
