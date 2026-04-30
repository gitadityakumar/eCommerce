'use client';

import { Plus, Ticket } from 'lucide-react';
import { useState, useTransition } from 'react';
import { AdminSearchHeader } from '@/components/admin/admin-search-header';
import { CouponTable } from './CouponTable';

interface Coupon {
  id: string;
  code: string;
  discountType: 'fixed' | 'percentage';
  discountValue: string;
  minOrderAmount: string | null;
  startsAt: Date;
  expiresAt: Date | null;
  maxUsage: number | null;
  usedCount: number;
}

interface CouponClientProps {
  initialCoupons: Coupon[];
}

export function CouponClient({ initialCoupons }: CouponClientProps) {
  const [isPending] = useTransition();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCoupons = initialCoupons.filter(c =>
    c.code.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-6">
      <AdminSearchHeader
        icon={<Ticket className="text-accent size-8" strokeWidth={1.5} />}
        title="Coupon Management"
        description="Craft exquisite incentives for your distinguished clientele."
        searchPlaceholder="Filter archives..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        addHref="/admin/coupons/new"
        addLabel="Add Incentive"
        addIcon={<Plus className="size-3.5" strokeWidth={3} />}
      />

      <div className={isPending ? 'opacity-50 pointer-events-none' : ''}>
        <CouponTable data={filteredCoupons} />
      </div>
    </div>
  );
}
