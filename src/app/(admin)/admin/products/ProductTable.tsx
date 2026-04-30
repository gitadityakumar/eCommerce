'use client';

import type {
  ColumnDef,
  SortingState,
} from '@tanstack/react-table';
import {
  IconPlus,
} from '@tabler/icons-react';
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';
import { AdminTableShell } from '@/components/admin/admin-table-shell';
import { RowActionsMenu } from '@/components/admin/row-actions-menu';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { normalizeImageUrl } from '@/lib/images';

interface Product {
  id: string;
  name: string;
  slug: string;
  status: string;
  category?: { name: string } | null;
  brand?: { name: string } | null;
  images?: { url: string; isPrimary: boolean }[];
}

const columns: ColumnDef<Product>[] = [
  {
    accessorKey: 'name',
    header: 'Product',
    cell: ({ row }) => {
      const primaryImage = row.original.images?.find(img => img.isPrimary) || row.original.images?.[0];
      const imageUrl = normalizeImageUrl(primaryImage?.url);
      return (
        <div className="flex items-center gap-3">
          <div className="relative size-10 shrink-0 overflow-hidden rounded-lg border border-border-subtle bg-surface-subtle">
            {imageUrl
              ? (
                  <Image
                    src={imageUrl}
                    alt={row.original.name}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                )
              : (
                  <div className="flex size-full items-center justify-center text-[10px] text-muted-foreground bg-accent/5">
                    No Item
                  </div>
                )}
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-text-primary line-clamp-1">{row.original.name}</span>
            <span className="text-muted-foreground text-[10px] font-mono leading-none tracking-tight">
              ID:
              {row.original.id.slice(0, 8)}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'category.name',
    header: 'Category',
    cell: ({ row }) => row.original.category?.name || '-',
  },
  {
    accessorKey: 'brand.name',
    header: 'Brand',
    cell: ({ row }) => row.original.brand?.name || '-',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant="outline" className="capitalize font-bold text-[10px] tracking-widest border-border-subtle text-text-secondary">
        {row.original.status}
      </Badge>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <RowActionsMenu
        items={[
          { label: 'Edit', href: `/admin/products/${row.original.id}` },
          { label: 'Make a copy' },
          { label: 'Delete', destructive: true, separatorBefore: true },
        ]}
      />
    ),
  },
];

export function ProductTable({ data }: { data: Product[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6">
      <div className="flex items-center justify-between p-4">
        <h1 className="text-4xl font-light tracking-tighter text-text-primary font-playfair italic">Products</h1>
        <Button asChild size="sm" className="bg-accent text-white hover:bg-accent/90 rounded-full px-6 font-bold tracking-widest uppercase text-[10px] shadow-soft shadow-accent/20 transition-all hover:-translate-y-0.5 active:scale-95">
          <Link href="/admin/products/new" className="flex items-center gap-2">
            <IconPlus className="size-3.5" />
            Add Product
          </Link>
        </Button>
      </div>
      <AdminTableShell table={table} columnsLength={columns.length} emptyMessage="No products found." />
    </div>
  );
}
