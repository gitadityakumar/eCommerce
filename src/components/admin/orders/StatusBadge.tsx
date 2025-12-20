import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  paid: { label: 'Paid', className: 'bg-blue-100 text-blue-800 border-blue-200' },
  partially_shipped: { label: 'Partially Shipped', className: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  shipped: { label: 'Shipped', className: 'bg-purple-100 text-purple-800 border-purple-200' },
  delivered: { label: 'Delivered', className: 'bg-green-100 text-green-800 border-green-200' },
  cancelled: { label: 'Cancelled', className: 'bg-gray-100 text-gray-800 border-gray-200' },
  returned: { label: 'Returned', className: 'bg-orange-100 text-orange-800 border-orange-200' },
  refunded: { label: 'Refunded', className: 'bg-pink-100 text-pink-800 border-pink-200' },
  failed: { label: 'Failed', className: 'bg-red-100 text-red-800 border-red-200' },
};

export function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] || { label: status, className: 'bg-gray-100 text-gray-800' };

  return (
    <Badge variant="outline" className={cn('capitalize px-2 py-0.5 font-medium', config.className)}>
      {config.label}
    </Badge>
  );
}
