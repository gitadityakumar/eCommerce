'use client';

import { ArrowRight, Lock, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { formatINR } from '@/lib/currency';

interface OrderSummaryProps {
  items: any[];
}

export function OrderSummary({ items }: OrderSummaryProps) {
  const subtotal = items.reduce((acc, item) => {
    return acc + Number(item.variant.price) * item.quantity;
  }, 0);

  const shippingTax = 0; // Placeholder
  const total = subtotal + shippingTax;
  const isFreeShipping = subtotal > 1000; // Example threshold

  return (
    <div className="bg-card border rounded-xl p-6 flex flex-col gap-6 sticky top-24">
      <h2 className="text-xl font-bold">Order Summary</h2>

      <div className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">{formatINR(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Shipping Tax</span>
          <span className="font-medium text-green-600">
            {shippingTax === 0 ? 'FREE' : formatINR(shippingTax)}
          </span>
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <div className="text-sm font-medium flex items-center gap-2">
          <Truck className="h-4 w-4" />
          <span>Promo Code</span>
        </div>
        <div className="flex gap-2">
          <Input placeholder="Enter code" className="flex-1" />
          <Button variant="outline">Apply</Button>
        </div>
      </div>

      <Separator />

      <div className="flex justify-between items-end">
        <span className="text-base font-semibold">Order Total</span>
        <span className="text-2xl font-bold">{formatINR(total)}</span>
      </div>

      <Button className="w-full py-6 text-base font-semibold" size="lg">
        <Lock className="mr-2 h-4 w-4" />
        Proceed to Checkout
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>

      {isFreeShipping && (
        <div className="bg-green-50 border border-green-100 rounded-lg p-3 flex gap-3 items-center">
          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
            <Truck className="h-4 w-4 text-green-700" />
          </div>
          <div>
            <div className="text-sm font-semibold text-green-800">Free Shipping Applied</div>
            <div className="text-xs text-green-600">Estimated delivery: 3-5 business days</div>
          </div>
        </div>
      )}
    </div>
  );
}
