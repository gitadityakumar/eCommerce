'use client';

import { Lock, Mail } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  AuthErrorNotice,
  AuthHeading,
  AuthIdentityHeader,
  AuthSubmitButton,
  PasswordToggleButton,
} from '@/components/auth-panel';
import { useAuthStore } from '@/store/auth';

interface Props {
  mode: 'sign-in' | 'sign-up';
  onSubmit: (formData: FormData) => Promise<{ ok: boolean; user?: { id: string; email: string; name: string; image?: string | null }; error?: string; details?: Record<string, string[]> } | void>;
}

export default function AuthForm({ mode, onSubmit }: Props) {
  const [show, setShow] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const setUser = useAuthStore(s => s.setUser);
  const router = useRouter();

  const validate = (formData: FormData) => {
    const errors: Record<string, string> = {};
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;

    if (mode === 'sign-up' && (!name || name.trim().length === 0)) {
      errors.name = 'Full name is required';
    }

    if (!email || !/^[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password || password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const formData = new FormData(e.currentTarget);
    const validationErrors = validate(formData);

    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      const result = await onSubmit(formData);

      if (result?.ok) {
        if (result.user) {
          setUser({
            id: result.user.id,
            email: result.user.email,
            name: result.user.name,
            image: result.user.image ?? undefined,
          });
        }
        router.push('/');
      }
      else if (result?.error) {
        setError(result.error);
        if (result.details) {
          const formattedDetails: Record<string, string> = {};
          Object.entries(result.details).forEach(([key, value]) => {
            formattedDetails[key] = value[0];
          });
          setFieldErrors(formattedDetails);
        }
      }
    }
    catch (e: any) {
      console.warn('error', e);
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
        title={mode === 'sign-in' ? 'Welcome back' : 'Join the Collective'}
        description={mode === 'sign-in'
          ? 'Enter your credentials to access your curated selection.'
          : 'Enlist today for exclusive access to our seasonal drops.'}
      />

      <AuthErrorNotice error={error} />

      {/* Form */}
      <form className="space-y-8" onSubmit={handleSubmit}>
        {mode === 'sign-up' && (
          <div className="space-y-2">
            <label htmlFor="name" className="text-[10px] text-text-secondary font-bold uppercase tracking-widest ml-4">
              Full name
            </label>
            <div className="relative">
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Charlotte Dubois"
                disabled={isLoading}
                className={`w-full rounded-full bg-background border ${fieldErrors.name ? 'border-destructive' : 'border-border-subtle'} px-14 py-4 text-text-primary placeholder:text-text-secondary/40 focus:outline-none focus:ring-1 ${fieldErrors.name ? 'focus:ring-destructive/30 focus:border-destructive/40' : 'focus:ring-accent/30 focus:border-accent/40'} transition-all font-inter text-sm shadow-soft disabled:opacity-50`}
                autoComplete="name"
              />
              <Mail className={`absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 ${fieldErrors.name ? 'text-destructive' : 'text-text-secondary'} opacity-50`} />
              {fieldErrors.name && (
                <p className="absolute left-6 -bottom-5 text-[10px] text-destructive font-bold uppercase tracking-tighter animate-in fade-in slide-in-from-top-1">
                  {fieldErrors.name}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Email or username */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-[10px] text-text-secondary font-bold uppercase tracking-widest ml-4">
            Email or username
          </label>
          <div className="relative">
            <input
              id="email"
              name="email"
              type="email"
              placeholder="curator@luxury.com"
              disabled={isLoading}
              className={`w-full rounded-full bg-background border ${fieldErrors.email ? 'border-destructive' : 'border-border-subtle'} px-14 py-4 text-text-primary placeholder:text-text-secondary/40 focus:outline-none focus:ring-1 ${fieldErrors.email ? 'focus:ring-destructive/30 focus:border-destructive/40' : 'focus:ring-accent/30 focus:border-accent/40'} transition-all font-inter text-sm shadow-soft disabled:opacity-50`}
              autoComplete="email"
            />
            <Mail className={`absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 ${fieldErrors.email ? 'text-destructive' : 'text-text-secondary'} opacity-50`} />
            {fieldErrors.email && (
              <p className="absolute left-6 -bottom-5 text-[10px] text-destructive font-bold uppercase tracking-tighter animate-in fade-in slide-in-from-top-1">
                {fieldErrors.email}
              </p>
            )}
          </div>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-4 mb-2">
            <label htmlFor="password" className="text-[10px] text-text-secondary font-bold uppercase tracking-widest">
              Password
            </label>
            {mode === 'sign-in' && (
              <Link href="/forgot-password" className="text-[10px] text-accent font-bold uppercase tracking-widest hover:opacity-80 transition-opacity">
                Forgot?
              </Link>
            )}
          </div>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={show ? 'text' : 'password'}
              placeholder="••••••••"
              disabled={isLoading}
              className={`w-full rounded-full bg-background border ${fieldErrors.password ? 'border-destructive' : 'border-border-subtle'} px-14 py-4 text-text-primary placeholder:text-text-secondary/40 focus:outline-none focus:ring-1 ${fieldErrors.password ? 'focus:ring-destructive/30 focus:border-destructive/40' : 'focus:ring-accent/30 focus:border-accent/40'} transition-all font-inter text-sm shadow-soft disabled:opacity-50`}
              autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'}
            />
            <Lock className={`absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 ${fieldErrors.password ? 'text-destructive' : 'text-text-secondary'} opacity-50`} />
            <PasswordToggleButton show={show} disabled={isLoading} onToggle={() => setShow(v => !v)} />
            {fieldErrors.password && (
              <p className="absolute left-6 -bottom-5 text-[10px] text-destructive font-bold uppercase tracking-tighter animate-in fade-in slide-in-from-top-1">
                {fieldErrors.password}
              </p>
            )}
          </div>
        </div>

        {/* Remember me & Need help */}
        {mode === 'sign-in' && (
          <div className="flex items-center justify-between text-[10px] px-4">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                disabled={isLoading}
                className="w-4 h-4 rounded border-border-subtle bg-background text-accent focus:ring-0 cursor-pointer transition-all disabled:opacity-50"
              />
              <span className="text-text-secondary group-hover:text-text-primary transition-colors font-bold uppercase tracking-widest">
                Stay signed in
              </span>
            </label>
            <Link href="/help" className="text-text-secondary hover:text-text-primary transition-colors font-bold uppercase tracking-widest">
              Support
            </Link>
          </div>
        )}

        {/* Sign in/up Button */}
        <AuthSubmitButton isLoading={isLoading} loadingLabel="Authenticating..." label={mode === 'sign-in' ? 'Enter' : 'Create Account'} />

        {/* Account toggle */}
        <p className="text-center text-[10px] text-text-secondary font-bold uppercase tracking-widest">
          {mode === 'sign-in' ? 'New to our world? ' : 'Already enlisted? '}
          <Link
            href={mode === 'sign-in' ? '/sign-up' : '/sign-in'}
            className="text-accent underline underline-offset-4 hover:text-accent/80 transition-colors"
          >
            {mode === 'sign-in' ? 'Enlist Now' : 'Sign in'}
          </Link>
        </p>
      </form>

      {/* Terms for sign up */}
      {mode === 'sign-up' && (
        <p className="text-center text-[10px] text-text-secondary/40 font-light leading-relaxed px-8">
          By enlisting, you agree to our
          {' '}
          <a href="#" className="text-text-secondary hover:text-accent underline transition-colors">
            Terms of Service
          </a>
          {' '}
          and
          {' '}
          <a href="#" className="text-text-secondary hover:text-accent underline transition-colors">
            Privacy Policy
          </a>
        </p>
      )}
    </div>
  );
}
