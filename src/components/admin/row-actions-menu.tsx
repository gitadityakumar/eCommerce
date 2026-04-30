'use client';

import type { ReactNode } from 'react';
import { IconDotsVertical } from '@tabler/icons-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface RowActionItem {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: ReactNode;
  destructive?: boolean;
  separatorBefore?: boolean;
}

export function RowActionsMenu({ items }: { items: RowActionItem[] }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="size-8 p-0">
          <IconDotsVertical className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {items.map((item, index) => (
          <div key={`${item.label}-${index}`}>
            {item.separatorBefore && <DropdownMenuSeparator />}
            <DropdownMenuItem
              asChild={Boolean(item.href)}
              className={item.destructive ? 'text-destructive' : undefined}
              onClick={item.href ? undefined : item.onClick}
            >
              {item.href
                ? (
                    <Link href={item.href}>
                      {item.icon}
                      {item.label}
                    </Link>
                  )
                : (
                    <>
                      {item.icon}
                      {item.label}
                    </>
                  )}
            </DropdownMenuItem>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
