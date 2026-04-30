'use client';

import { Lock } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import {
  AuthErrorNotice,
  AuthHeading,
  AuthIdentityHeader,
  AuthSubmitButton,
  PasswordToggleButton,
} from '@/components/auth-panel';
import { updatePassword } from '@/lib/auth/actions';

export default function ResetPasswordForm() {
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const password = formData.get('password') as string;

    if (!password || password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (!token) {
      setError('Reset token is missing. Please request a new link.');
      return;
    }

    // Append token to formData for the server action
    formData.append('token', token);

    setIsLoading(true);
    try {
      const result = await updatePassword(formData);

      if (result?.ok) {
        router.push('/sign-in?reset=success');
      }
      else {
        setError(result?.error || 'Failed to update password. Please try again.');
      }
    }
    catch (e: any) {
      setError(e.message || 'An unexpected error occurred. Please try again.');
    }
    finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      <AuthIdentityHeader />

      <AuthHeading
        title="Set New Password"
        description="Enlist your new credentials below to regain full access to your curated selection."
      />

      <AuthErrorNotice error={error} />

      {/* Form */}
      <form className="space-y-8" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label htmlFor="password" className="text-[10px] text-text-secondary font-bold uppercase tracking-widest ml-4">
            New Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={show ? 'text' : 'password'}
              placeholder="••••••••"
              disabled={isLoading}
              className={`w-full rounded-full bg-background border ${error ? 'border-destructive' : 'border-border-subtle'} px-14 py-4 text-text-primary placeholder:text-text-secondary/40 focus:outline-none focus:ring-1 ${error ? 'focus:ring-destructive/30 focus:border-destructive/40' : 'focus:ring-accent/30 focus:border-accent/40'} transition-all font-inter text-sm shadow-soft disabled:opacity-50`}
              autoComplete="new-password"
            />
            <Lock className={`absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 ${error ? 'text-destructive' : 'text-text-secondary'} opacity-50`} />
            <PasswordToggleButton show={show} disabled={isLoading} onToggle={() => setShow(v => !v)} />
          </div>
        </div>

        <AuthSubmitButton isLoading={isLoading} loadingLabel="Updating..." label="Update Password" />
      </form>
    </div>
  );
}
