import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import OrderManagement from '@/components/my-orders/my-orders';
import { getCurrentUser } from '@/lib/auth/actions';

async function MyOrdersContent() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/sign-in?callbackUrl=/my-orders');
  }

  return (
    <main className="w-full">
      <OrderManagement />
    </main>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={(
        <div className="container max-w-6xl mx-auto py-20 md:py-32 px-4 min-h-[60vh]">
          <div className="mb-10 h-10 w-56 rounded-full bg-surface-variant animate-pulse" />
          <div className="space-y-5">
            {[0, 1, 2].map(item => (
              <div key={item} className="rounded-3xl bg-surface p-6 shadow-soft">
                <div className="mb-5 h-5 w-1/3 rounded-full bg-surface-variant animate-pulse" />
                <div className="h-4 w-2/3 rounded-full bg-surface-variant animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      )}
    >
      <MyOrdersContent />
    </Suspense>
  );
}
