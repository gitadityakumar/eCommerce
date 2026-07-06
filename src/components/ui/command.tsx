'use client';

import { SearchIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

interface CommandContextValue {
  query: string;
  setQuery: (query: string) => void;
  registerItem: (id: string, visible: boolean) => () => void;
  itemCount: number;
  visibleCount: number;
}

const CommandContext = React.createContext<CommandContextValue | null>(null);

function useCommand() {
  const context = React.useContext(CommandContext);
  if (!context) {
    throw new Error('Command components must be used within <Command>');
  }

  return context;
}

function Command({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const [query, setQuery] = React.useState('');
  const [counts, setCounts] = React.useState({ itemCount: 0, visibleCount: 0 });
  const itemsRef = React.useRef(new Map<string, boolean>());

  const registerItem = React.useCallback((id: string, visible: boolean) => {
    itemsRef.current.set(id, visible);
    const values = Array.from(itemsRef.current.values());
    setCounts({
      itemCount: values.length,
      visibleCount: values.filter(Boolean).length,
    });

    return () => {
      itemsRef.current.delete(id);
      const nextValues = Array.from(itemsRef.current.values());
      setCounts({
        itemCount: nextValues.length,
        visibleCount: nextValues.filter(Boolean).length,
      });
    };
  }, []);

  const contextValue = React.useMemo<CommandContextValue>(
    () => ({
      query,
      setQuery,
      registerItem,
      itemCount: counts.itemCount,
      visibleCount: counts.visibleCount,
    }),
    [counts.itemCount, counts.visibleCount, query, registerItem],
  );

  return (
    <CommandContext.Provider value={contextValue}>
      <div
        data-slot="command"
        className={cn(
          'bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md',
          className,
        )}
        {...props}
      />
    </CommandContext.Provider>
  );
}

function CommandInput({
  className,
  value,
  onChange,
  ...props
}: Omit<React.ComponentProps<'input'>, 'value' | 'onChange'> & {
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}) {
  const { query, setQuery } = useCommand();
  const inputValue = value ?? query;

  return (
    <div
      data-slot="command-input-wrapper"
      className="flex h-9 items-center gap-2 border-b px-3"
    >
      <SearchIcon className="size-4 shrink-0 opacity-50" />
      <input
        data-slot="command-input"
        value={inputValue}
        onChange={(event) => {
          setQuery(event.target.value);
          onChange?.(event);
        }}
        className={cn(
          'placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...props}
      />
    </div>
  );
}

function CommandList({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="command-list"
      role="listbox"
      className={cn(
        'max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto',
        className,
      )}
      {...props}
    />
  );
}

function CommandEmpty({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const { itemCount, visibleCount } = useCommand();

  if (itemCount > 0 && visibleCount > 0) {
    return null;
  }

  return (
    <div
      data-slot="command-empty"
      className={cn('py-6 text-center text-sm', className)}
      {...props}
    />
  );
}

function CommandGroup({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="command-group"
      className={cn(
        'text-foreground overflow-hidden p-1',
        className,
      )}
      {...props}
    />
  );
}

function CommandItem({
  className,
  value,
  onSelect,
  children,
  onClick,
  onKeyDown,
  ...props
}: Omit<React.ComponentProps<'div'>, 'onSelect'> & {
  value?: string;
  onSelect?: (value: string) => void;
}) {
  const id = React.useId();
  const { query, registerItem } = useCommand();
  const searchValue = value ?? (typeof children === 'string' ? children : '');
  const visible = searchValue.toLowerCase().includes(query.trim().toLowerCase());

  React.useEffect(() => {
    return registerItem(id, visible);
  }, [id, registerItem, visible]);

  if (!visible) {
    return null;
  }

  return (
    <div
      data-slot="command-item"
      role="option"
      tabIndex={0}
      data-selected="false"
      className={cn(
        'data-[selected=true]:bg-accent/5 data-[selected=true]:text-accent [&_svg:not([class*=\'text-\'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 hover:bg-accent/5 hover:text-accent focus:bg-accent/5 focus:text-accent [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4',
        className,
      )}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          onSelect?.(searchValue);
        }
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented) {
          return;
        }

        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect?.(searchValue);
        }
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
};
