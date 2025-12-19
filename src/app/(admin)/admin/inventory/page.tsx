import { getInventory } from "@/actions/stock";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { StockAdjustmentModal } from "./_components/StockAdjustmentModal";
import { Package, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default async function InventoryPage() {
  const inventory = await getInventory();

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Inventory Management</h2>
          <p className="text-muted-foreground">
            Track and manage stock levels across all product variants.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 py-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search SKU or Product..."
            className="pl-8"
          />
        </div>
      </div>

      <div className="rounded-md border bg-white">
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
                    <div className="flex flex-col">
                      <span className="font-medium">{item.variant.product.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {item.variant.color?.name || 'No Color'} / {item.variant.size?.name || 'No Size'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{item.variant.sku}</TableCell>
                  <TableCell className="text-right">
                    <span className={`font-bold ${isOutOfStock ? 'text-rose-600' : isLowStock ? 'text-amber-600' : ''}`}>
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
                    {isOutOfStock ? (
                      <Badge variant="destructive">Out of Stock</Badge>
                    ) : isLowStock ? (
                      <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">Low Stock</Badge>
                    ) : (
                      <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50">In Stock</Badge>
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
