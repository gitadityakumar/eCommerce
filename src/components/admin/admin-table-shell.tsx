'use client';

import type { RowData, Table as TanstackTable } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface AdminTableShellProps<TData extends RowData> {
  table: TanstackTable<TData>;
  columnsLength: number;
  emptyMessage: string;
  className?: string;
}

export function AdminTableShell<TData extends RowData>({
  table,
  columnsLength,
  emptyMessage,
  className = 'rounded-2xl border border-border-subtle bg-surface/50 overflow-hidden shadow-soft',
}: AdminTableShellProps<TData>) {
  return (
    <>
      <div className={className}>
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
                    <TableCell colSpan={columnsLength} className="h-24 text-center">
                      {emptyMessage}
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
    </>
  );
}
