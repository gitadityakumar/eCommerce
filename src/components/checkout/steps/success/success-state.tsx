import type { getOrderById } from '@/actions/orders';
import {
  CheckCircle,
  CreditCard,
  Download,
  MapPin,
  Package,
  Printer,
  Truck,
} from 'lucide-react';
import Image from 'next/image';

import Link from 'next/link';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatINR } from '@/lib/currency';
import { cn } from '@/lib/utils';

type OrderData = NonNullable<Awaited<ReturnType<typeof getOrderById>>>;

interface OrderSuccessPageProps {
  order: OrderData;
  className?: string;
}

function OrderSuccessPage({
  order,
  className,
}: OrderSuccessPageProps) {
  const getStatusBadge = (status: OrderData['status']) => {
    const variants: Record<
      OrderData['status'],
      { label: string; className: string }
    > = {
      pending: {
        label: 'Pending',
        className: 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/10',
      },
      processing: {
        label: 'Processing',
        className: 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/10',
      },
      paid: {
        label: 'Paid',
        className: 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10',
      },
      shipped: {
        label: 'Shipped',
        className: 'bg-blue-500/10 text-blue-600 hover:bg-blue-500/10',
      },
      delivered: {
        label: 'Delivered',
        className: 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10',
      },
      cancelled: {
        label: 'Cancelled',
        className: 'bg-red-500/10 text-red-600 hover:bg-red-500/10',
      },
      failed: {
        label: 'Failed',
        className: 'bg-red-500/10 text-red-600 hover:bg-red-500/10',
      },
      partially_shipped: {
        label: 'Partially Shipped',
        className: 'bg-blue-500/10 text-blue-600 hover:bg-blue-500/10',
      },
      returned: {
        label: 'Returned',
        className: 'bg-gray-500/10 text-gray-600 hover:bg-gray-500/10',
      },
      refunded: {
        label: 'Refunded',
        className: 'bg-gray-500/10 text-gray-600 hover:bg-gray-500/10',
      },
    };
    return variants[status] || { label: status, className: '' };
  };

  const statusBadge = getStatusBadge(order.status);
  const subtotal = order.items.reduce((acc, item) => acc + (Number(item.priceAtPurchase) * item.quantity), 0);
  const total = Number(order.totalAmount);
  // We don't have separate fields for shipping/tax/discount in the DB yet,
  // so we'll treat the difference as "Fees & Discounts" if not zero.
  const extra = total - subtotal;

  return (
    <main className={cn('mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 min-h-screen bg-background transition-colors duration-500', className)}>
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="mb-16 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-green-600/10">
            <CheckCircle className="size-10 text-green-600 transition-transform duration-500 hover:scale-110" />
          </div>
          <h1 className="mb-4 text-4xl md:text-5xl font-playfair font-light text-text-primary tracking-tight">
            Thank you for your order
          </h1>
          <p className="text-text-secondary font-inter font-light tracking-wide max-w-md mx-auto">
            A confirmation email has been sent to
            {' '}
            <span className="font-medium text-text-primary underline decoration-green-600/30 underline-offset-4">{order.user?.email || 'your email'}</span>
          </p>
        </div>

        {/* Order Info Bar */}
        <Card className="mb-10 border-border-subtle bg-surface/30 backdrop-blur-sm shadow-soft rounded-2xl overflow-hidden border">
          <CardContent className="flex flex-wrap items-center justify-between gap-6 p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-x-12 gap-y-4 font-montserrat uppercase tracking-[0.2em] text-[10px]">
              <div>
                <p className="text-text-secondary mb-1">Order Number</p>
                <p className="font-semibold text-text-primary text-sm">{order.id.slice(0, 8).toUpperCase()}</p>
              </div>
              <Separator
                orientation="vertical"
                className="hidden h-12 bg-border-subtle md:block"
              />
              <div>
                <p className="text-text-secondary mb-1">Order Date</p>
                <p className="font-semibold text-text-primary text-sm">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
            </div>
            <Badge className={cn('px-4 py-1.5 rounded-full text-[10px] font-montserrat font-bold tracking-widest uppercase shadow-sm border-none', statusBadge.className)}>
              {statusBadge.label}
            </Badge>
          </CardContent>
        </Card>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Items & Totals */}
          <div className="space-y-8 lg:col-span-2">
            {/* Order Items */}
            <Card className="border-border-subtle bg-surface/30 backdrop-blur-sm shadow-soft rounded-2xl border">
              <CardHeader className="pb-6 border-b border-border-subtle">
                <CardTitle className="flex items-center gap-3 text-sm font-montserrat font-semibold tracking-widest uppercase text-text-primary">
                  <Package className="size-4 text-accent" />
                  Items Ordered
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                {order.items.map((item, index) => (
                  <div key={item.id} className="group">
                    <div className="flex gap-6">
                      <div className="w-24 shrink-0 transition-transform duration-500 group-hover:scale-[1.02]">
                        <AspectRatio
                          ratio={4 / 5}
                          className="overflow-hidden rounded-xl bg-muted border border-border-subtle shadow-sm"
                        >
                          {item.variant?.product?.images?.[0]
                            ? (
                                <Image
                                  src={item.variant.product.images[0].url}
                                  alt={item.variant.product.name}
                                  fill
                                  className="object-cover transition-opacity duration-500 group-hover:opacity-90"
                                />
                              )
                            : (
                                <div className="flex size-full items-center justify-center bg-muted text-text-secondary text-[10px] font-montserrat uppercase tracking-wider text-center p-2 italic leading-relaxed">
                                  Prêt-à-Porter
                                </div>
                              )}
                        </AspectRatio>
                      </div>
                      <div className="min-w-0 flex-1 flex flex-col justify-center">
                        <h3 className="font-playfair text-lg text-text-primary tracking-tight transition-colors group-hover:text-accent duration-300">
                          {item.variant?.product?.name || 'Artisan Accessory'}
                        </h3>
                        <div className="mt-2 flex flex-wrap items-center gap-2 font-inter text-[11px] uppercase tracking-widest text-text-secondary">
                          <span className="bg-muted px-2 py-0.5 rounded transition-colors group-hover:bg-accent/5">{item.variant?.color?.name}</span>
                          {item.variant?.size?.name && (
                            <>
                              <span className="text-border-subtle">|</span>
                              <span className="bg-muted px-2 py-0.5 rounded transition-colors group-hover:bg-accent/5">{item.variant.size.name}</span>
                            </>
                          )}
                        </div>
                        <p className="mt-2 font-inter text-xs text-text-secondary/80">
                          {item.quantity}
                          {' '}
                          Unit
                          {item.quantity > 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className="text-right flex flex-col justify-center">
                        <p className="font-montserrat font-semibold text-text-primary">
                          {formatINR(Number(item.priceAtPurchase) * item.quantity)}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-[10px] text-text-secondary font-inter tracking-wide mt-1">
                            {formatINR(Number(item.priceAtPurchase))}
                            {' '}
                            each
                          </p>
                        )}
                      </div>
                    </div>
                    {index < order.items.length - 1 && (
                      <Separator className="mt-6 bg-border-subtle opacity-50" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Order Totals */}
            <Card className="border-border-subtle bg-surface/30 backdrop-blur-sm shadow-soft rounded-2xl border">
              <CardContent className="p-8">
                <div className="space-y-4 font-inter text-sm">
                  <div className="flex justify-between tracking-wide">
                    <span className="text-text-secondary">Atelier Subtotal</span>
                    <span className="text-text-primary">{formatINR(subtotal)}</span>
                  </div>
                  {extra !== 0 && (
                    <div className="flex justify-between tracking-wide">
                      <span className="text-text-secondary">Shipping & Handling</span>
                      <span className="text-text-primary">
                        {extra > 0 ? formatINR(extra) : `-${formatINR(Math.abs(extra))}`}
                      </span>
                    </div>
                  )}
                  <Separator className="bg-border-subtle" />
                  <div className="flex justify-between text-xl font-playfair text-text-primary tracking-tight">
                    <span>Grand Total</span>
                    <span className="font-semibold">{formatINR(total)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Shipping & Payment */}
          <div className="space-y-8">
            {/* Shipping Information */}
            <Card className="border-border-subtle bg-surface/30 backdrop-blur-sm shadow-soft rounded-2xl border">
              <CardHeader className="pb-4 border-b border-border-subtle">
                <CardTitle className="flex items-center gap-3 text-sm font-montserrat font-semibold tracking-widest uppercase text-text-primary">
                  <MapPin className="size-4 text-accent" />
                  Boutique Delivery
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6 font-inter text-sm">
                {order.shippingAddress
                  ? (
                      <div className="space-y-1.5 leading-relaxed">
                        <p className="font-semibold text-text-primary mb-2 text-base">{order.user?.name || 'Valued Client'}</p>
                        <p className="text-text-secondary">
                          {order.shippingAddress.line1}
                        </p>
                        {order.shippingAddress.line2 && (
                          <p className="text-text-secondary">
                            {order.shippingAddress.line2}
                          </p>
                        )}
                        <p className="text-text-secondary">
                          {order.shippingAddress.city}
                          ,
                          {' '}
                          {order.shippingAddress.state}
                          {' '}
                          {order.shippingAddress.postalCode}
                        </p>
                      </div>
                    )
                  : (
                      <p className="text-text-secondary italic">Standard boutique pickup selected.</p>
                    )}
                {order.courierName && (
                  <>
                    <Separator className="bg-border-subtle opacity-50" />
                    <div className="flex items-start gap-3 bg-accent/5 p-3 rounded-xl border border-accent/10">
                      <Truck className="mt-0.5 size-4 text-accent" />
                      <div>
                        <p className="text-[11px] font-montserrat font-bold tracking-widest uppercase text-accent mb-0.5">
                          Carrier Partner
                        </p>
                        <p className="text-sm font-medium text-text-primary">
                          {order.courierName}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card className="border-border-subtle bg-surface/30 backdrop-blur-sm shadow-soft rounded-2xl border">
              <CardHeader className="pb-4 border-b border-border-subtle">
                <CardTitle className="flex items-center gap-3 text-sm font-montserrat font-semibold tracking-widest uppercase text-text-primary">
                  <CreditCard className="size-4 text-accent" />
                  Transaction
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {order.payments?.map(payment => (
                  <div key={payment.id} className="flex items-center gap-4">
                    <div className="relative size-12 overflow-hidden rounded-xl bg-white shadow-soft border border-border-subtle transition-transform duration-300 hover:scale-110">
                      <Image
                        src="/phone-pay.svg"
                        alt="PhonePe"
                        fill
                        className="object-cover p-1"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-montserrat font-bold tracking-widest uppercase text-text-primary">
                        {payment.method}
                      </p>
                      <p className="text-[11px] text-text-secondary font-inter uppercase mt-1 tracking-tight">
                        Status:
                        {' '}
                        <span className="text-emerald-600 font-medium">{payment.status}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="shadow-none bg-transparent border-none">
              <CardContent className="space-y-4 p-0">
                <Button className="w-full h-12 bg-primary hover:bg-accent text-primary-foreground font-montserrat font-bold tracking-widest uppercase transition-all duration-300 rounded-xl shadow-soft" asChild>
                  <Link href="/my-orders">
                    <Package className="mr-2 size-4" />
                    Order Archives
                  </Link>
                </Button>
                <div className="grid grid-cols-2 gap-4">
                  <Button className="h-11 border-primary/10 text-primary hover:border-accent hover:bg-accent hover:text-white transition-all duration-500 rounded-xl font-montserrat font-bold text-[10px] tracking-widest uppercase bg-primary/5 shadow-sm" variant="outline">
                    <Download className="mr-2 size-3" />
                    Receipt
                  </Button>
                  <Button className="h-11 border-primary/10 text-primary hover:border-accent hover:bg-accent hover:text-white transition-all duration-500 rounded-xl font-montserrat font-bold text-[10px] tracking-widest uppercase bg-primary/5 shadow-sm" variant="outline">
                    <Printer className="mr-2 size-3" />
                    Print
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Continue Shopping */}
        <div className="mt-20 text-center animate-in fade-in slide-in-from-bottom-2 duration-1000">
          <Separator className="mb-10 max-w-xs mx-auto bg-border-subtle opacity-50" />
          <p className="mb-6 text-text-secondary font-inter font-light tracking-wide italic">
            Questions regarding your acquisition?
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            <Link href="/support" className="text-xs font-montserrat font-semibold tracking-[0.2em] uppercase text-text-secondary hover:text-accent transition-colors underline decoration-border-subtle underline-offset-8">
              Client Concierge
            </Link>
            <Link href="/products" className="text-xs font-montserrat font-semibold tracking-[0.2em] uppercase text-text-primary hover:text-accent transition-colors underline decoration-border-subtle underline-offset-8">
              Explore Collection
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export { OrderSuccessPage };
