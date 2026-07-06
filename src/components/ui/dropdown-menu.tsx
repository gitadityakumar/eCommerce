'use client';

import { Menu as DropdownMenuPrimitive } from '@base-ui/react/menu';
import { CheckIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

type WithAsChild<T> = T & {
  asChild?: boolean;
};

function renderAsChild(children: React.ReactNode, asChild?: boolean) {
  return asChild && React.isValidElement(children) ? children : undefined;
}

function DropdownMenu({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

function DropdownMenuTrigger({
  asChild,
  children,
  ...props
}: WithAsChild<React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>>) {
  return (
    <DropdownMenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      render={renderAsChild(children, asChild)}
      {...props}
    >
      {asChild ? undefined : children}
    </DropdownMenuPrimitive.Trigger>
  );
}

type DropdownMenuContentProps
  = React.ComponentProps<typeof DropdownMenuPrimitive.Popup>
    & Pick<
      React.ComponentProps<typeof DropdownMenuPrimitive.Positioner>,
      'align' | 'side' | 'sideOffset' | 'alignOffset' | 'collisionPadding'
    >
    & {
      forceMount?: boolean;
    };

function DropdownMenuContent({
  className,
  sideOffset = 4,
  align = 'center',
  side = 'bottom',
  alignOffset,
  collisionPadding,
  forceMount,
  ...props
}: DropdownMenuContentProps) {
  return (
    <DropdownMenuPrimitive.Portal keepMounted={forceMount}>
      <DropdownMenuPrimitive.Positioner
        align={align}
        side={side}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        collisionPadding={collisionPadding}
        className="z-50"
      >
        <DropdownMenuPrimitive.Popup
          data-slot="dropdown-menu-content"
          className={cn(
            'bg-popover text-popover-foreground data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 max-h-(--available-height) min-w-[8rem] origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md',
            className,
          )}
          {...props}
        />
      </DropdownMenuPrimitive.Positioner>
    </DropdownMenuPrimitive.Portal>
  );
}

function DropdownMenuGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Group>) {
  return (
    <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
  );
}

function DropdownMenuItem({
  className,
  inset,
  variant = 'default',
  asChild,
  children,
  ...props
}: WithAsChild<React.ComponentProps<typeof DropdownMenuPrimitive.Item>> & {
  inset?: boolean;
  variant?: 'default' | 'destructive';
}) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      render={renderAsChild(children, asChild)}
      nativeButton={asChild ? false : undefined}
      className={cn(
        'focus:bg-accent/5 focus:text-accent data-[highlighted]:bg-accent/5 data-[highlighted]:text-accent data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:data-[highlighted]:bg-destructive/10 data-[variant=destructive]:data-[highlighted]:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*=\'text-\'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4',
        className,
      )}
      {...props}
    >
      {asChild ? undefined : children}
    </DropdownMenuPrimitive.Item>
  );
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      className={cn(
        'focus:bg-accent/5 focus:text-accent data-[highlighted]:bg-accent/5 data-[highlighted]:text-accent relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4',
        className,
      )}
      checked={checked}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <DropdownMenuPrimitive.CheckboxItemIndicator>
          <CheckIcon className="size-4" />
        </DropdownMenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.GroupLabel> & {
  inset?: boolean;
}) {
  return (
    <DropdownMenuPrimitive.GroupLabel
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn(
        'px-2 py-1.5 text-sm font-medium data-[inset]:pl-8',
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn('bg-border -mx-1 my-1 h-px', className)}
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
};
