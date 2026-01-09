import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/actions';
import { CouponForm } from '../CouponForm';

export const metadata = {
  title: 'Create New Coupon | Admin Panel',
  description: 'Create and manage store discounts and promotions.',
};

export const dynamic = 'force-dynamic';

export default async function CreateCouponPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== 'admin') {
    redirect('/');
  }

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-10 p-8 py-12">
      <div className="mb-12">
        <h1 className="text-5xl font-light tracking-tighter text-text-primary font-playfair italic">Curate New Incentive</h1>
        <p className="text-sm text-text-secondary mt-2 font-light tracking-tight">Define a high-fidelity promotional code and configure rewards.</p>
      </div>

      <div className="bg-surface/50 border border-border-subtle rounded-3xl p-10 shadow-soft backdrop-blur-sm">
        <CouponForm />
      </div>
    </div>
  );
}
