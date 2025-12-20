import {
  Activity,
  IndianRupee,
  ShoppingBag,
  Users,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatINR } from '@/lib/currency';

interface KpiCardsProps {
  stats: {
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    activeCarts: number;
    activeSessions: number;
  };
}

export function DashboardKpiCards({ stats }: KpiCardsProps) {
  const items = [
    {
      title: 'Total Revenue',
      value: formatINR(stats.totalRevenue),
      description: 'Total earnings (excl. cancelled)',
      icon: IndianRupee,
      color: 'text-emerald-500',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders.toLocaleString(),
      description: 'Lifetime orders placed',
      icon: ShoppingBag,
      color: 'text-blue-500',
    },
    {
      title: 'Total Customers',
      value: stats.totalCustomers.toLocaleString(),
      description: 'Registered customers',
      icon: Users,
      color: 'text-violet-500',
    },
    {
      title: 'Active Sessions',
      value: stats.activeSessions.toLocaleString(),
      description: 'Users & Guests currently online',
      icon: Activity,
      color: 'text-orange-500',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {items.map(item => (
        <Card key={item.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {item.title}
            </CardTitle>
            <item.icon className={`h-4 w-4 ${item.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
            <p className="text-xs text-muted-foreground">
              {item.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
