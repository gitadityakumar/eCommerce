'use client';

import { ArrowRight, Eye, EyeOff, Lock, MessageSquare } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
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
      {/* App Branding */}
      <div className="flex items-center justify-between border-b border-border-subtle pb-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20">
            <MessageSquare className="w-5 h-5 text-accent" />
          </div>
          <div>
            <p className="text-[10px] text-text-secondary uppercase tracking-[0.3em] font-montserrat opacity-60">Identity</p>
            <h2 className="text-lg font-light text-text-primary font-playfair tracking-tighter">PreetyTwist</h2>
          </div>
        </div>
        <span className="text-[10px] text-text-secondary tracking-widest font-light opacity-40">EDITION 2024</span>
      </div>

      {/* Header */}
      <div className="space-y-3">
        <h1 className="text-4xl font-light text-text-primary font-playfair tracking-tight leading-none italic">
          Set New Password
        </h1>
        <p className="text-text-secondary font-light text-sm tracking-wide">
          Enlist your new credentials below to regain full access to your curated selection.
        </p>
      </div>

      {/* General Error Message */}
      {error && (
        <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 animate-in fade-in slide-in-from-top-2">
          <p className="text-xs text-destructive font-medium tracking-wide flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-destructive animate-pulse" />
            {error}
          </p>
        </div>
      )}

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
            <button
              type="button"
              className="absolute right-6 top-1/2 -translate-y-1/2 text-text-secondary opacity-50 hover:opacity-100 transition-opacity"
              onClick={() => setShow(v => !v)}
              aria-label={show ? 'Hide password' : 'Show password'}
              disabled={isLoading}
            >
              {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-full bg-accent px-8 py-5 text-white font-bold tracking-[0.3em] uppercase hover:shadow-xl hover:shadow-accent/30 transition-all flex items-center justify-center gap-3 active:scale-95 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading
            ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Updating...</span>
                </div>
              )
            : (
                <>
                  <span>Update Password</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
        </button>
      </form>
    </div>
  );
}
