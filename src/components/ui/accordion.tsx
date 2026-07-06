'use client';

import { Accordion as AccordionPrimitive } from '@base-ui/react/accordion';
import { ChevronDownIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

type AccordionValue = string | string[];

type AccordionProps = Omit<
  React.ComponentProps<typeof AccordionPrimitive.Root>,
  'value' | 'defaultValue' | 'onValueChange' | 'multiple'
> & {
  type?: 'single' | 'multiple';
  collapsible?: boolean;
  value?: AccordionValue;
  defaultValue?: AccordionValue;
  onValueChange?: (value: AccordionValue) => void;
};

function toArray(value: AccordionValue | undefined) {
  if (value === undefined) {
    return undefined;
  }

  return Array.isArray(value) ? value : [value];
}

function fromArray(value: unknown[], multiple: boolean) {
  return multiple ? value.map(String) : String(value[0] ?? '');
}

function Accordion({
  type = 'single',
  value,
  defaultValue,
  onValueChange,
  collapsible: _collapsible,
  ...props
}: AccordionProps) {
  const multiple = type === 'multiple';

  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      multiple={multiple}
      value={toArray(value)}
      defaultValue={toArray(defaultValue)}
      onValueChange={
        onValueChange
          ? nextValue => onValueChange(fromArray(nextValue, multiple))
          : undefined
      }
      {...props}
    />
  );
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn('border-b last:border-b-0', className)}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          'focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:ring-[3px] data-disabled:pointer-events-none data-disabled:opacity-50 [&[data-panel-open]>svg]:rotate-180',
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon className="text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Panel>) {
  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-content"
      className="data-ending-style:animate-accordion-up data-open:animate-accordion-down overflow-hidden text-sm"
      {...props}
    >
      <div className={cn('pt-0 pb-4', className)}>{children}</div>
    </AccordionPrimitive.Panel>
  );
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
