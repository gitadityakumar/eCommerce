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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-surface/50 p-8 rounded-2xl border border-border-subtle shadow-soft backdrop-blur-md transition-all duration-500">
        <div>
          <h1 className="text-4xl font-light tracking-tighter text-text-primary font-playfair italic flex items-center gap-3">
            <Ticket className="text-accent size-8" strokeWidth={1.5} />
            Coupon Management
          </h1>
          <p className="text-sm text-text-secondary mt-2 font-light tracking-tight">
            Craft exquisite incentives for your distinguished clientele.
          </p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-text-secondary group-focus-within:text-accent transition-colors" />
            <Input
              placeholder="Filter archives..."
              className="pl-11 bg-background/50 border-border-subtle rounded-full h-11 focus:ring-accent/20 focus:border-accent/40 transition-all placeholder:text-text-secondary/50 placeholder:font-light"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <Button asChild className="bg-accent text-white hover:bg-accent/90 rounded-full px-6 font-bold tracking-widest uppercase text-[10px] shadow-soft shadow-accent/20 h-11 transition-all hover:-translate-y-0.5 active:scale-95">
            <Link href="/admin/coupons/new" className="flex items-center gap-2">
              <Plus className="size-3.5" strokeWidth={3} />
              Add Incentive
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
