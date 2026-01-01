import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatINR } from '@/lib/currency';

interface RecentOrdersProps {
  orders: {
    id: string;
    customerName: string;
    totalAmount: string;
    status: string;
    createdAt: Date;
  }[];
}

export function DashboardRecentOrders({ orders }: RecentOrdersProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-accent/10 text-accent hover:bg-accent/20 border-transparent';
      case 'shipped':
        return 'bg-text-secondary/10 text-text-secondary hover:bg-text-secondary/20 border-transparent';
      case 'processing':
        return 'bg-text-secondary/5 text-text-secondary hover:bg-text-secondary/10 border-transparent italic';
      case 'cancelled':
        return 'bg-destructive/10 text-destructive hover:bg-destructive/20 border-transparent';
      default:
        return 'bg-surface text-text-secondary hover:bg-surface border-border-subtle';
    }
  };

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-3">
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
        <CardDescription>Latest orders placed in the store.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map(order => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">
                  #
                  {order.id.substring(0, 8).toUpperCase()}
                </TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(order.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  {formatINR(Number(order.totalAmount))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
