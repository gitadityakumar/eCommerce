'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Lock, Tag, Truck, X } from 'lucide-react';

import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { validateCoupon } from '@/actions/coupons';
import { formatINR } from '@/lib/currency';
import { useCartStore } from '@/store/cart';

export function ClientOrderSummary() {
  const items = useCartStore(s => s.items);

  const subtotal = items.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);

  // Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; type: string; value: number } | null>(null);

  const discount = appliedCoupon
    ? (appliedCoupon.type === 'percentage' ? (subtotal * appliedCoupon.value) / 100 : appliedCoupon.value)
    : 0;

  const shippingTax = 0; // Placeholder
  const total = subtotal + shippingTax - discount;
  const isFreeShipping = subtotal > 1000; // Example threshold

  const handleApplyCoupon = async () => {
    if (!couponCode.trim())
      return;
    setIsApplying(true);
    try {
      const result = await validateCoupon(couponCode, subtotal);
      if (result.success && result.data) {
        setAppliedCoupon({
          code: result.data.code,
          type: result.data.discountType,
          value: result.data.discountValue,
        });
        toast.success(`Promo code "${result.data.code}" applied successfully!`);
      }
      else {
        toast.error(result.error || 'Invalid promo code');
      }
    }
    catch {
      toast.error('Failed to apply promo code');
    }
    finally {
      setIsApplying(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
  };

  return (
    <div className="bg-surface border border-border-subtle rounded-2xl p-6 md:p-8 flex flex-col gap-6 md:gap-8 sticky top-28 shadow-soft transition-colors duration-500">
      <h2 className="text-2xl font-light text-text-primary tracking-tight">Summary</h2>

      <div className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary font-light">Subtotal</span>
          <span className="text-text-primary font-medium tracking-tight">{formatINR(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary font-light">Shipping</span>
          <span className="text-accent font-bold tracking-widest text-[10px] uppercase">
            {shippingTax === 0 ? 'Complimentary' : formatINR(shippingTax)}
          </span>
        </div>
        {appliedCoupon && (
          <div className="flex justify-between text-sm text-green-600">
            <span className="font-light italic">
              Privilege Discount (
              {appliedCoupon.type === 'percentage' ? `${appliedCoupon.value}%` : `${Math.round((discount / subtotal) * 100)}%`}
              )
            </span>
            <span className="font-medium tracking-tight">
              -
              {formatINR(discount)}
            </span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary font-light">Tax</span>
          <span className="text-text-primary font-medium tracking-tight whitespace-nowrap italic opacity-60">Calculated at checkout</span>
        </div>
      </div>

      <div className="h-px bg-border-subtle opacity-50" />

      <div className="space-y-3">
        <div className="text-xs font-medium text-text-primary flex items-center gap-2 uppercase tracking-widest">
          <Tag className="h-3 w-3 text-accent" />
          <span>Promo Code</span>
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              placeholder="Enter code"
              value={couponCode}
              onChange={e => setCouponCode(e.target.value)}
              disabled={!!appliedCoupon}
              className="w-full bg-background border border-border-subtle rounded-lg px-4 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent/30 transition-all placeholder:text-text-secondary/50 uppercase tracking-wider"
            />
            {appliedCoupon && (
              <button
                onClick={removeCoupon}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-text-secondary hover:text-destructive transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <button
            onClick={handleApplyCoupon}
            disabled={isApplying || !!appliedCoupon || !couponCode}
            className="text-xs font-bold uppercase tracking-widest text-accent hover:text-accent/80 transition-colors px-2 disabled:opacity-50"
          >
            {isApplying ? '...' : 'Apply'}
          </button>
        </div>
        <AnimatePresence>
          {appliedCoupon && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[10px] font-medium text-green-600 flex items-center gap-1.5 uppercase tracking-wider"
            >
              <CheckCircle2 size={12} />
              Applied:
              {' '}
              {appliedCoupon.code}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="h-px bg-border-subtle" />

      <div className="flex justify-between items-end mb-2">
        <span className="text-base md:text-lg font-light text-text-primary">Total</span>
        <span className="text-2xl md:text-3xl font-light text-text-primary tracking-tighter">{formatINR(total)}</span>
      </div>

      <Link href="/checkout">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-accent text-white py-4 md:py-5 px-6 rounded-full text-xs md:text-sm font-bold tracking-[0.2em] uppercase transition-all shadow-soft shadow-accent/20 hover:shadow-accent/40 flex items-center justify-center gap-3 active:scale-95"
        >
          <Lock className="h-4 w-4" />
          Checkout
          <ArrowRight className="h-4 w-4" />
        </motion.button>
      </Link>

      {isFreeShipping && (
        <div className="bg-accent/5 border border-accent/10 rounded-xl p-4 flex gap-4 items-center">
          <div className="h-10 w-10 rounded-full bg-accent text-white flex items-center justify-center shrink-0 shadow-soft">
            <Truck className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-medium text-text-primary tracking-tight">Free Shipping Unlocked</div>
            <div className="text-xs text-text-secondary font-light">Editorial delivery in 3-5 days</div>
          </div>
        </div>
      )}
    </div>
  );
}
