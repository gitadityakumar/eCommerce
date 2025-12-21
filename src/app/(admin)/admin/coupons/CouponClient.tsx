'use client';

import { Plus, Search, Ticket } from 'lucide-react';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-muted/30 p-6 rounded-lg border">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Ticket className="text-primary h-6 w-6" />
            Coupons Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your store&apos;s promotional codes and discounts.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search coupons..."
              className="pl-9"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <Button asChild className="gap-2">
            <Link href="/admin/coupons/new">
              <Plus className="h-4 w-4" />
              Add Coupon
            </Link>
          </Button>
        </div>
      </div>

      <div className={isPending ? 'opacity-50 pointer-events-none' : ''}>
        <CouponTable data={filteredCoupons} />
      </div>
    </div>
  );
}
