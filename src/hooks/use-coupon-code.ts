'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { validateCoupon } from '@/actions/coupons';

interface AppliedCoupon {
  code: string;
  type: string;
  value: number;
}

export function useCouponCode(amount: number) {
  const [couponCode, setCouponCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      return;
    }

    setIsApplying(true);
    try {
      const result = await validateCoupon(couponCode, amount);
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

  return {
    appliedCoupon,
    couponCode,
    handleApplyCoupon,
    isApplying,
    removeCoupon,
    setCouponCode,
  };
}
