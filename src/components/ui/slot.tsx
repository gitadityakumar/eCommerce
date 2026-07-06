import * as React from 'react';

import { cn } from '@/lib/utils';

type SlotProps = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode;
};

const Slot = React.forwardRef<HTMLElement, SlotProps>(
  ({ children, className, style, ...props }, ref) => {
    if (!React.isValidElement<{ className?: string; style?: React.CSSProperties }>(children)) {
      return null;
    }

    const slotProps: React.HTMLAttributes<HTMLElement> & React.RefAttributes<HTMLElement> = {
      ...props,
      className: cn(children.props.className, className),
      style: {
        ...children.props.style,
        ...style,
      },
    };

    if (ref) {
      slotProps.ref = ref;
    }

    return React.cloneElement(children, slotProps);
  },
);
Slot.displayName = 'Slot';

export { Slot };
