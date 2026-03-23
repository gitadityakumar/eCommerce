import { Package, Search } from 'lucide-react';
import Image from 'next/image';
import { getInventory } from '@/actions/stock';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { StockAdjustmentModal } from './_components/StockAdjustmentModal';

export default async function InventoryPage() {
  const inventory = await getInventory();

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-4xl font-light tracking-tighter text-text-primary font-playfair italic">Inventory Archive</h2>
          <p className="text-sm text-text-secondary mt-2 font-light tracking-tight">
            Track and manage stock levels with editorial precision across all silhouettes.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 py-6">
        <div className="relative flex-1 max-w-sm group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary group-focus-within:text-accent transition-colors" />
          <Input
            placeholder="Search by SKU or Silhouette..."
            className="pl-10 bg-surface/50 border-border-subtle rounded-full h-11 focus:ring-accent/20 focus:border-accent/40 transition-all placeholder:font-light"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-border-subtle bg-surface/50 overflow-hidden shadow-soft transition-all duration-500">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Product / Variant</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead className="text-right">Available</TableHead>
              <TableHead className="text-right">Reserved</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventory.map((item) => {
              const total = item.available + item.reserved;
              const isLowStock = item.available < 10;
              const isOutOfStock = item.available === 0;

              return (
                <TableRow key={item.variantId}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative size-10 shrink-0 overflow-hidden rounded-lg border border-border-subtle bg-surface-subtle">
                        {(() => {
                          const variantImage = item.variant.images?.find(img => img.isPrimary) || item.variant.images?.[0];
                          const productImage = item.variant.product.images?.find(img => img.isPrimary) || item.variant.product.images?.[0];
                          const displayImage = variantImage || productImage;

                          return displayImage
                            ? (
                                <Image
                                  src={displayImage.url}
                                  alt={item.variant.product.name}
                                  fill
                                  className="object-cover"
                                />
                              )
                            : (
                                <div className="flex size-full items-center justify-center text-[10px] text-muted-foreground bg-accent/5">
                                  No Item
                                </div>
                              );
                        })()}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-text-primary line-clamp-1">{item.variant.product.name}</span>
                        <span className="text-[10px] text-text-secondary font-light tracking-tight">
                          {item.variant.color?.name || 'No Color'}
                          {' '}
                          /
                          {' '}
                          {item.variant.size?.name || 'No Size'}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{item.variant.sku}</TableCell>
                  <TableCell className="text-right">
                    <span className={`font-bold tracking-tight ${isOutOfStock ? 'text-destructive' : isLowStock ? 'text-accent' : 'text-text-primary'}`}>
                      {item.available}
                    </span>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground italic">
                    {item.reserved}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {total}
                  </TableCell>
                  <TableCell className="text-right">
                    {isOutOfStock
                      ? (
                          <Badge variant="destructive" className="bg-destructive/10 text-destructive border-transparent font-bold text-[9px] tracking-widest uppercase py-1">Out of Stock</Badge>
                        )
                      : isLowStock
                        ? (
                            <Badge variant="outline" className="text-accent border-accent/20 bg-accent/5 font-bold text-[9px] tracking-widest uppercase py-1">Low Stock</Badge>
                          )
                        : (
                            <Badge variant="outline" className="text-text-secondary/70 border-border-subtle bg-surface font-bold text-[9px] tracking-widest uppercase py-1">In Stock</Badge>
                          )}
                  </TableCell>
                  <TableCell className="text-right">
                    <StockAdjustmentModal
                      variantId={item.variantId}
                      sku={item.variant.sku}
                      productName={item.variant.product.name}
                      currentAvailable={item.available}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
            {inventory.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <Package className="h-8 w-8 opacity-20" />
                    <p>No inventory records found.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
