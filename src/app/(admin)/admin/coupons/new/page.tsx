import { ArrowLeft, Ticket } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { getCurrentUser } from '@/lib/auth/actions';
import { CouponForm } from '../CouponForm';

export const metadata = {
  title: 'Create New Coupon | Admin Panel',
  description: 'Create and manage store discounts and promotions.',
};

export default async function CreateCouponPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== 'admin') {
    redirect('/');
  }

  return (
    <div className="container mx-auto flex flex-col gap-6 p-4 md:p-6">
      <div className="flex mt-6 items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/coupons">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Ticket className="text-primary h-6 w-6" />
            Create New Coupon
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Add a new promotional code and configure discount settings.
          </p>
        </div>
      </div>

      <div className="bg-card border rounded-lg p-6 shadow-sm">
        <CouponForm />
      </div>
    </div>
  );
}
