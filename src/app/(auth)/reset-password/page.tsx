import { Suspense } from 'react';
import ResetPasswordForm from '@/components/ResetPasswordForm';

export default async function Page() {
  return (
    <Suspense fallback={(
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    )}
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
