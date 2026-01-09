'use client';

import { format } from 'date-fns';
import {
  AlertCircle,
  Clock,
  CreditCard,
  History as HistoryIcon,
  Loader2,
  MapPin,
  Package,
  Save,
  Truck,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { updateOrderStatus, upsertFulfillment } from '@/actions/orders';
import { EntityHistoryTab } from '@/components/admin/EntityHistoryTab';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatusBadge } from './StatusBadge';

interface OrderItem {
  id: string;
  priceAtPurchase: string | number;
  quantity: number;
  variant: {
    sku: string;
    product: { name: string };
    color?: { name: string } | null;
    size?: { name: string } | null;
  };
}

interface Order {
  id: string;
  status: string;
  createdAt: string | Date;
  totalAmount: string | number;
  items: OrderItem[];
  user: {
    id: string;
    name: string | null;
    email: string;
  } | null;
  shippingAddress: {
    line1: string;
    line2?: string | null;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  } | null;
  billingAddress: {
    line1: string;
    line2?: string | null;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  } | null;
  payments: {
    id: string;
    method: string;
    status: string;
    transactionId?: string | null;
  }[];
  fulfillments: {
    id: string;
    trackingNumber: string | null;
    carrier: string | null;
    status: string;
  }[];
}

interface OrderDetailsProps {
  order: Order;
}

export function OrderDetailsUI({ order }: OrderDetailsProps) {
  const [status, setStatus] = useState(order.status);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Fulfillment state
  const existingFulfillment = order.fulfillments?.[0] || {};
  const [trackingNumber, setTrackingNumber] = useState(existingFulfillment.trackingNumber || '');
  const [carrier, setCarrier] = useState(existingFulfillment.carrier || '');
  const [fulfillmentStatus] = useState(existingFulfillment.status || 'pending');
  const [isUpdatingFulfillment, setIsUpdatingFulfillment] = useState(false);

  const handleStatusUpdate = async () => {
    setIsUpdatingStatus(true);
    try {
      const res = await updateOrderStatus(order.id, status as 'pending' | 'processing' | 'paid' | 'partially_shipped' | 'shipped' | 'delivered' | 'cancelled' | 'returned' | 'refunded' | 'failed');
      if (res.success) {
        toast.success('Order status updated successfully');
      }
      else {
        toast.error(res.error || 'Failed to update status');
      }
    }
    catch {
      toast.error('An error occurred');
    }
    finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleFulfillmentUpdate = async () => {
    setIsUpdatingFulfillment(true);
    try {
      const res = await upsertFulfillment({
        id: existingFulfillment.id,
        orderId: order.id,
        trackingNumber,
        carrier,
        status: fulfillmentStatus,
      });
      if (res.success) {
        toast.success('Fulfillment updated successfully');
      }
      else {
        toast.error(res.error || 'Failed to update fulfillment');
      }
    }
    catch {
      toast.error('An error occurred');
    }
    finally {
      setIsUpdatingFulfillment(false);
    }
  };

  const formatPrice = (price: string | number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(Number(price));
  };

  return (
    <Tabs defaultValue="details" className="space-y-6">
      <div className="flex items-center justify-between">
        <TabsList>
          <TabsTrigger value="details">Order Details</TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <HistoryIcon className="h-4 w-4" />
            History
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="details" className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Order #
              {order.id.slice(0, 8)}
            </h1>
            <div className="flex items-center gap-2 mt-1 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>
                Placed on
                {format(new Date(order.createdAt), 'PPP p')}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={order.status} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ... existing card content ... */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="space-y-1">
                  <CardTitle>Order Items</CardTitle>
                  <CardDescription>
                    {order.items?.length || 0}
                    {' '}
                    items in this order
                  </CardDescription>
                </div>
                <Package className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-center">Qty</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.items?.map((item: OrderItem) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium text-primary">
                              {item.variant?.product?.name || 'Product'}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              SKU:
                              {' '}
                              {item.variant?.sku}
                              {' '}
                              |
                              {item.variant?.color?.name && ` Color: ${item.variant.color.name}`}
                              {item.variant?.size?.name && ` Size: ${item.variant.size.name}`}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {formatPrice(item.priceAtPurchase)}
                        </TableCell>
                        <TableCell className="text-center">{item.quantity}</TableCell>
                        <TableCell className="text-right font-medium">
                          {formatPrice(Number(item.priceAtPurchase) * item.quantity)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="mt-6 space-y-2 max-w-[200px] ml-auto">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(order.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{formatPrice(0)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{formatPrice(order.totalAmount)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-lg">Shipping Address</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-1">
                  {order.shippingAddress
                    ? (
                        <>
                          <p className="font-medium">{order.user?.name}</p>
                          <p>{order.shippingAddress.line1}</p>
                          {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
                          <p>
                            {order.shippingAddress.city}
                            ,
                            {order.shippingAddress.state}
                            {' '}
                            {order.shippingAddress.postalCode}
                          </p>
                          <p>{order.shippingAddress.country}</p>
                        </>
                      )
                    : (
                        <p className="text-muted-foreground italic">No shipping address provided</p>
                      )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center gap-2">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-lg">Billing Address</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-1">
                  {order.billingAddress
                    ? (
                        <>
                          <p className="font-medium">{order.user?.name}</p>
                          <p>{order.billingAddress.line1}</p>
                          {order.billingAddress.line2 && <p>{order.billingAddress.line2}</p>}
                          <p>
                            {order.billingAddress.city}
                            ,
                            {order.billingAddress.state}
                            {' '}
                            {order.billingAddress.postalCode}
                          </p>
                          <p>{order.billingAddress.country}</p>
                        </>
                      )
                    : (
                        <p className="text-muted-foreground italic">Same as shipping address</p>
                      )}
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Order Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Update Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="returned">Returned</SelectItem>
                      <SelectItem value="refunded">Refunded</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={handleStatusUpdate}
                  className="w-full"
                  disabled={isUpdatingStatus || status === order.status}
                >
                  {isUpdatingStatus
                    ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )
                    : (
                        <Save className="mr-2 h-4 w-4" />
                      )}
                  Save Status
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Payment Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {order.payments?.length > 0
                  ? (
                      order.payments.map(payment => (
                        <div key={payment.id} className="space-y-2 text-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Method</span>
                            <Badge variant="secondary" className="uppercase">{payment.method}</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Status</span>
                            <span className={payment.status === 'completed' ? 'text-green-600 font-medium' : 'text-yellow-600 font-medium'}>
                              {payment.status}
                            </span>
                          </div>
                          {payment.transactionId && (
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground">Transaction ID</span>
                              <code className="text-xs bg-muted px-1 rounded">{payment.transactionId}</code>
                            </div>
                          )}
                        </div>
                      ))
                    )
                  : (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground italic">
                        <AlertCircle className="h-4 w-4" />
                        No payment records found
                      </div>
                    )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  Fulfillment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="carrier">Carrier</Label>
                  <Input
                    id="carrier"
                    placeholder="e.g. FedEx, BlueDart"
                    value={carrier}
                    onChange={e => setCarrier(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tracking">Tracking Number</Label>
                  <Input
                    id="tracking"
                    placeholder="e.g. 1Z999..."
                    value={trackingNumber}
                    onChange={e => setTrackingNumber(e.target.value)}
                  />
                </div>
                <Button
                  onClick={handleFulfillmentUpdate}
                  variant="outline"
                  className="w-full"
                  disabled={isUpdatingFulfillment}
                >
                  {isUpdatingFulfillment
                    ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )
                    : (
                        <Truck className="mr-2 h-4 w-4" />
                      )}
                  Update Tracking
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="history">
        <Card>
          <CardHeader>
            <CardTitle>Order History</CardTitle>
            <CardDescription>
              A complete audit trail of all changes made to this order.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EntityHistoryTab entityType="orders" entityId={order.id} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
