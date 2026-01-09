import { redirect } from 'next/navigation';
import { getCoupons } from '@/lib/actions/coupons';
import { getCurrentUser } from '@/lib/auth/actions';
import { CouponClient } from './CouponClient';

export const dynamic = 'force-dynamic';

export default async function CouponsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    redirect('/');
  }

  const { data: coupons, error } = await getCoupons();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <CouponClient
        initialCoupons={coupons || []}
      />
      {error && (
        <div className="rounded-md bg-destructive/15 p-4 text-destructive text-sm mt-4">
          {error}
        </div>
      )}
    </div>
  );
}
