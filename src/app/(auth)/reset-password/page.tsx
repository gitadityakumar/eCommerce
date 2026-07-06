import { Suspense } from 'react';
import ResetPasswordForm from '@/components/ResetPasswordForm';

export default async function Page() {
  return (
    <Suspense fallback={(
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-full max-w-md space-y-5 rounded-3xl bg-surface p-8 shadow-soft">
          <div className="h-8 w-2/3 rounded-full bg-surface-variant animate-pulse" />
          <div className="h-12 rounded-full bg-surface-variant animate-pulse" />
          <div className="h-12 rounded-full bg-surface-variant animate-pulse" />
        </div>
      </div>
    )}
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
