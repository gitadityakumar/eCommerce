'use client';

import { Slider as SliderPrimitive } from '@base-ui/react/slider';
import * as React from 'react';

import { cn } from '@/lib/utils';

type SliderProps = Omit<
  React.ComponentProps<typeof SliderPrimitive.Root<readonly number[]>>,
  'onValueCommitted'
> & {
  onValueCommit?: (
    value: readonly number[],
    eventDetails: SliderPrimitive.Root.CommitEventDetails,
  ) => void;
};

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  onValueCommit,
  ...props
}: SliderProps) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max],
  );

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      onValueCommitted={onValueCommit}
      className={cn(
        'relative w-full data-disabled:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto',
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Control className="relative flex w-full touch-none items-center select-none data-[orientation=vertical]:h-full data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col">
        <SliderPrimitive.Track
          data-slot="slider-track"
          className={cn(
            'bg-border-subtle/30 relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-1 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1',
          )}
        >
          <SliderPrimitive.Indicator
            data-slot="slider-range"
            className={cn(
              'bg-accent absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full',
            )}
          />
        </SliderPrimitive.Track>
        {Array.from({ length: _values.length }, (_, index) => (
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            index={index}
            key={index}
            className="border-accent ring-accent/20 block size-4 shrink-0 rounded-full border-2 bg-background shadow-soft transition-all hover:scale-110 focus-visible:ring-4 focus-visible:outline-hidden data-disabled:pointer-events-none data-disabled:opacity-50 cursor-pointer"
          />
        ))}
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  );
}

export { Slider };
