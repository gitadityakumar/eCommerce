'use client';

import type {
  ColumnDef,
  SortingState,
} from '@tanstack/react-table';
import {
  IconDotsVertical,
  IconPlus,
} from '@tabler/icons-react';
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import Link from 'next/link';
import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Product {
  id: string;
  name: string;
  slug: string;
  status: string;
  category?: { name: string } | null;
  brand?: { name: string } | null;
}

const columns: ColumnDef<Product>[] = [
  {
    accessorKey: 'name',
    header: 'Product',
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.original.name}</span>
        <span className="text-muted-foreground text-xs">{row.original.slug}</span>
      </div>
    ),
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0">
            <IconDotsVertical className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/admin/products/${row.original.id}`}>Edit</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>Make a copy</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
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
      <div className="rounded-2xl border border-border-subtle bg-surface/50 overflow-hidden shadow-soft">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length
              ? (
                  table.getRowModel().rows.map(row => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map(cell => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )
              : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No products found.
                    </TableCell>
                  </TableRow>
                )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 p-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="rounded-full border-border-subtle text-text-secondary hover:text-accent hover:border-accent/40"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="rounded-full border-border-subtle text-text-secondary hover:text-accent hover:border-accent/40"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
