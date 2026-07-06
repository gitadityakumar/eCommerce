'use client';

import { Popover as PopoverPrimitive } from '@base-ui/react/popover';
import * as React from 'react';

import { cn } from '@/lib/utils';

type WithAsChild<T> = T & {
  asChild?: boolean;
};

function renderAsChild(children: React.ReactNode, asChild?: boolean) {
  return asChild && React.isValidElement(children) ? children : undefined;
}

function Popover({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

function PopoverTrigger({
  asChild,
  children,
  ...props
}: WithAsChild<React.ComponentProps<typeof PopoverPrimitive.Trigger>>) {
  return (
    <PopoverPrimitive.Trigger
      data-slot="popover-trigger"
      render={renderAsChild(children, asChild)}
      {...props}
    >
      {asChild ? undefined : children}
    </PopoverPrimitive.Trigger>
  );
}

type PopoverContentProps
  = React.ComponentProps<typeof PopoverPrimitive.Popup>
    & Pick<
      React.ComponentProps<typeof PopoverPrimitive.Positioner>,
      'align' | 'side' | 'sideOffset' | 'alignOffset' | 'collisionPadding'
    >
    & {
      forceMount?: boolean;
    };

function PopoverContent({
  className,
  align = 'center',
  side = 'bottom',
  sideOffset = 4,
  alignOffset,
  collisionPadding,
  forceMount,
  ...props
}: PopoverContentProps) {
  return (
    <PopoverPrimitive.Portal keepMounted={forceMount}>
      <PopoverPrimitive.Positioner
        align={align}
        side={side}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        collisionPadding={collisionPadding}
        className="z-50"
      >
        <PopoverPrimitive.Popup
          data-slot="popover-content"
          className={cn(
            'bg-popover text-popover-foreground data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 w-72 origin-(--transform-origin) rounded-md border p-4 shadow-md outline-hidden',
            className,
          )}
          {...props}
        />
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  );
}

export { Popover, PopoverContent, PopoverTrigger };
