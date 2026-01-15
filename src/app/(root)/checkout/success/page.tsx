import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { getCachedOrderById } from '@/actions/orders';
import { getStoreSettings } from '@/actions/settings';
import { OrderSuccessPage } from '@/components/checkout/steps/success/success-state';
import { auth } from '@/lib/auth';

interface PageProps {
  searchParams: Promise<{ orderId?: string }>;
}

async function OrderSuccessContent({ searchParams }: { searchParams: PageProps['searchParams'] }) {
  const { orderId } = await searchParams;

  if (!orderId) {
    redirect('/');
  }

  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session) {
    redirect('/auth/login');
  }

  const [order, settings] = await Promise.all([
    getCachedOrderById(orderId, session.user.id),
    getStoreSettings(),
  ]);

  if (!order) {
    redirect('/');
  }

  // Basic ownership check
  if (order.userId !== session.user.id) {
    redirect('/');
  }

  return <OrderSuccessPage order={order} settings={settings} />;
}

export default function Page({ searchParams }: PageProps) {
  return (
    <Suspense fallback={<div className="container py-24 text-center">Loading your order details...</div>}>
      <OrderSuccessContent searchParams={searchParams} />
    </Suspense>
  );
}
