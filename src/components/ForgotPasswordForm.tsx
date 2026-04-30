'use client';

import { Mail } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import {
  AuthErrorNotice,
  AuthHeading,
  AuthIdentityHeader,
  AuthSubmitButton,
} from '@/components/auth-panel';
import { forgotPassword } from '@/lib/auth/actions';

export default function ForgotPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!email || !/^[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('email', email);

      const result = await forgotPassword(formData);

      if (result?.ok) {
        setSuccess(true);
      }
      else {
        setError(result?.error || 'Failed to send magic link. Please try again.');
      }
    }
    catch (e: any) {
      setError(e.message || 'An unexpected error occurred. Please try again.');
    }
    finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <AuthIdentityHeader />

        <AuthHeading
          title="Check your inbox"
          description={(
            <>
              We've sent a magic link to
              {' '}
              <span className="text-text-primary font-medium">{email}</span>
              . Click the link to securely sign in and reset your password.
            </>
          )}
        />

        <div className="pt-4">
          <Link
            href="/sign-in"
            className="w-full rounded-full border border-border-subtle px-8 py-5 text-text-primary font-bold tracking-[0.3em] uppercase hover:bg-surface transition-all flex items-center justify-center gap-3 active:scale-95 text-xs"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <AuthIdentityHeader />

      <AuthHeading
        title="Forgot Password"
        description="Enter your email address and we'll send you a magic link to regain access to your account."
      />

      <AuthErrorNotice error={error} />

      {/* Form */}
      <form className="space-y-8" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label htmlFor="email" className="text-[10px] text-text-secondary font-bold uppercase tracking-widest ml-4">
            Email address
          </label>
          <div className="relative">
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="curator@luxury.com"
              disabled={isLoading}
              className={`w-full rounded-full bg-background border ${error ? 'border-destructive' : 'border-border-subtle'} px-14 py-4 text-text-primary placeholder:text-text-secondary/40 focus:outline-none focus:ring-1 ${error ? 'focus:ring-destructive/30 focus:border-destructive/40' : 'focus:ring-accent/30 focus:border-accent/40'} transition-all font-inter text-sm shadow-soft disabled:opacity-50`}
              autoComplete="email"
            />
            <Mail className={`absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 ${error ? 'text-destructive' : 'text-text-secondary'} opacity-50`} />
          </div>
        </div>

        <AuthSubmitButton isLoading={isLoading} loadingLabel="Sending link..." label="Send Magic Link" />

        <p className="text-center text-[10px] text-text-secondary font-bold uppercase tracking-widest">
          Remembered your password?
          {' '}
          <Link
            href="/sign-in"
            className="text-accent underline underline-offset-4 hover:text-accent/80 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
