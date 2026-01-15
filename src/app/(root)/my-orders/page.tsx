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
        <div className="container max-w-6xl mx-auto py-20 md:py-32 px-4 flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
          <p className="font-montserrat text-[10px] font-bold tracking-[0.2em] uppercase text-text-secondary animate-pulse">
            Authenticating your session…
          </p>
        </div>
      )}
    >
      <MyOrdersContent />
    </Suspense>
  );
}
