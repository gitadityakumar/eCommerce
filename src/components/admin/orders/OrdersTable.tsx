'use client';

import type { getOrders } from '@/actions/orders';
import { format } from 'date-fns';
import { ChevronDown, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { cn } from '@/lib/utils';

interface OrdersTableProps {
  orders: Awaited<ReturnType<typeof getOrders>>;
}

export function OrdersTable({ orders }: OrdersTableProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<string[]>([]);
  const [shipmentFilter, setShipmentFilter] = useState<string[]>([]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order: any) => {
      const matchesSearch
        = order.id.toLowerCase().includes(search.toLowerCase())
          || order.user?.email.toLowerCase().includes(search.toLowerCase())
          || order.user?.name?.toLowerCase().includes(search.toLowerCase());

      const pStatus = order.payments?.[0]?.status || 'pending';
      // Normalize database status to filter values
      const normalizedPaymentStatus = pStatus === 'completed' ? 'paid' : (pStatus === 'initiated' ? 'pending' : pStatus);
      const shipmentStatus = order.status;

      const matchesPayment = paymentFilter.length === 0 || paymentFilter.includes(normalizedPaymentStatus);
      const matchesShipment = shipmentFilter.length === 0 || shipmentFilter.includes(shipmentStatus);

      return matchesSearch && matchesPayment && matchesShipment;
    });
  }, [orders, search, paymentFilter, shipmentFilter]);

  const clearFilters = () => {
    setSearch('');
    setPaymentFilter([]);
    setShipmentFilter([]);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
      case 'completed':
      case 'delivered':
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      case 'pending':
      case 'initiated':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'processing':
      case 'shipped':
        return 'bg-accent/10 text-accent border-accent/20';
      case 'failed':
      case 'cancelled':
        return 'bg-rose-500/10 text-rose-600 border-rose-500/20';
      default:
        return 'bg-slate-500/10 text-slate-600 border-slate-500/20';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-surface/30 p-6 rounded-2xl border border-border-subtle backdrop-blur-sm">
        <div className="flex flex-1 items-center gap-4 max-w-md group">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary group-focus-within:text-accent transition-colors" />
            <Input
              placeholder="Search archival orders..."
              className="pl-10 h-11 bg-background/50 border-border-subtle rounded-full focus:ring-accent/20 focus:border-accent/40 transition-all placeholder:text-text-secondary/50"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-11 rounded-full border-border-subtle bg-background/50 text-[10px] font-bold tracking-widest uppercase px-6">
                Payment Status
                <ChevronDown className="ml-2 h-3 w-3 text-accent" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-surface border-border-subtle rounded-xl shadow-soft p-1">
              <DropdownMenuCheckboxItem
                className="rounded-lg text-[10px] font-bold tracking-widest uppercase focus:bg-accent/10 focus:text-accent"
                checked={paymentFilter.includes('pending')}
                onCheckedChange={checked =>
                  setPaymentFilter(prev => checked ? [...prev, 'pending'] : prev.filter(s => s !== 'pending'))}
              >
                Pending
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                className="rounded-lg text-[10px] font-bold tracking-widest uppercase focus:bg-accent/10 focus:text-accent"
                checked={paymentFilter.includes('paid')}
                onCheckedChange={checked =>
                  setPaymentFilter(prev => checked ? [...prev, 'paid'] : prev.filter(s => s !== 'paid'))}
              >
                Paid
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                className="rounded-lg text-[10px] font-bold tracking-widest uppercase focus:bg-accent/10 focus:text-accent"
                checked={paymentFilter.includes('failed')}
                onCheckedChange={checked =>
                  setPaymentFilter(prev => checked ? [...prev, 'failed'] : prev.filter(s => s !== 'failed'))}
              >
                Failed
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-11 rounded-full border-border-subtle bg-background/50 text-[10px] font-bold tracking-widest uppercase px-6">
                Shipment Status
                <ChevronDown className="ml-2 h-3 w-3 text-accent" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-surface border-border-subtle rounded-xl shadow-soft p-1">
              {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                <DropdownMenuCheckboxItem
                  key={s}
                  checked={shipmentFilter.includes(s)}
                  onCheckedChange={checked =>
                    setShipmentFilter(prev => checked ? [...prev, s] : prev.filter(x => x !== s))}
                  className="rounded-lg text-[10px] font-bold tracking-widest uppercase focus:bg-accent/10 focus:text-accent"
                >
                  {s}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {(search || paymentFilter.length > 0 || shipmentFilter.length > 0) && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-accent hover:text-accent/80 text-[10px] font-bold uppercase tracking-widest px-4">
              Reset
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-border-subtle bg-surface/50 overflow-hidden shadow-soft">
        <Table>
          <TableHeader>
            <TableRow className="bg-surface/50 border-b border-border-subtle hover:bg-surface/50">
              <TableHead className="w-14">
                <Checkbox className="rounded-md border-border-subtle data-[state=checked]:bg-accent data-[state=checked]:border-accent" />
              </TableHead>
              <TableHead className="text-[10px] font-bold tracking-widest uppercase text-text-secondary py-5">Order Reference</TableHead>
              <TableHead className="text-[10px] font-bold tracking-widest uppercase text-text-secondary py-5">Date</TableHead>
              <TableHead className="text-[10px] font-bold tracking-widest uppercase text-text-secondary py-5">Client</TableHead>
              <TableHead className="text-[10px] font-bold tracking-widest uppercase text-text-secondary py-5">Shipment</TableHead>
              <TableHead className="text-[10px] font-bold tracking-widest uppercase text-text-secondary py-5">Payment Status</TableHead>
              <TableHead className="text-[10px] font-bold tracking-widest uppercase text-text-secondary py-5 text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length > 0
              ? (
                  filteredOrders.map((order: any, index) => (
                    <TableRow
                      key={order.id}
                      className="group cursor-pointer hover:bg-accent/2 border-b border-border-subtle/50 transition-colors"
                      onClick={() => router.push(`/admin/orders/${order.id}`)}
                    >
                      <TableCell onClick={e => e.stopPropagation()}>
                        <Checkbox className="rounded-md border-border-subtle group-hover:border-accent/40" />
                      </TableCell>
                      <TableCell className="font-mono text-xs tracking-wider text-text-primary">
                        #
                        {10000 + orders.length - index}
                      </TableCell>
                      <TableCell className="text-xs font-light text-text-secondary">
                        {format(new Date(order.createdAt), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell className="text-xs font-medium text-text-primary group-hover:text-accent transition-colors">
                        {order.user?.email || 'Guest Archiver'}
                      </TableCell>
                      <TableCell>
                        <span className={cn('inline-flex items-center px-3 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase border transition-all duration-300', getStatusColor(order.status))}>
                          {order.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={cn('inline-flex items-center px-3 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase border transition-all duration-300', getStatusColor(order.payments?.[0]?.status === 'completed' ? 'paid' : (order.payments?.[0]?.status || 'pending')))}>
                          {order.payments?.[0]?.status === 'completed' ? 'Paid' : (order.payments?.[0]?.status || 'Pending')}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-medium text-text-primary font-playfair italic">
                        $
                        {' '}
                        {Number(order.totalAmount).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))
                )
              : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                      No orders found.
                    </TableCell>
                  </TableRow>
                )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-2 pt-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span>Show</span>
          <select className="border rounded px-1 py-1 h-8 bg-white">
            <option>20</option>
            <option>50</option>
            <option>100</option>
          </select>
          <span>per page</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled>1</Button>
          </div>
          <span>
            {filteredOrders.length}
            {' '}
            records
          </span>
        </div>
      </div>
    </div>
  );
}
