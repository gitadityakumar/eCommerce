import { AlertTriangle, Package } from 'lucide-react';
import { StockAdjustmentModal } from '@/app/(admin)/admin/inventory/_components/StockAdjustmentModal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface StockStatusProps {
  items: {
    id: string;
    productName: string;
    sku: string;
    available: number;
  }[];
}

export function DashboardStockStatus({ items }: StockStatusProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Low Stock Items</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </div>
        <CardDescription>Items needing immediate attention.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map(item => (
            <div key={item.id} className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${item.available === 0 ? 'bg-rose-100' : 'bg-amber-100'}`}>
                <AlertTriangle className={`h-4 w-4 ${item.available === 0 ? 'text-rose-600' : 'text-amber-600'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.productName}</p>
                <p className="text-xs text-muted-foreground truncate">{item.sku}</p>
              </div>
              <div className="text-right flex flex-col items-end">
                <span className={`text-sm font-bold ${item.available === 0 ? 'text-rose-600' : 'text-amber-600'}`}>
                  {item.available}
                </span>
                <span className="text-[10px] text-muted-foreground uppercase">Left</span>
              </div>
              <StockAdjustmentModal
                variantId={item.id}
                sku={item.sku}
                productName={item.productName}
                currentAvailable={item.available}
              />
            </div>
          ))}
          {items.length === 0 && (
            <p className="text-sm text-center text-muted-foreground py-4">
              All items are well stocked.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
