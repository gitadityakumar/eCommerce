'use client';

import { ArrowRight, Eye, EyeOff, Lock, Mail, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import SocialProviders from './SocialProviders';

interface Props {
  mode: 'sign-in' | 'sign-up';
  onSubmit: (formData: FormData) => Promise<{ ok: boolean; userId?: string } | void>;
}

export default function AuthForm({ mode, onSubmit }: Props) {
  const [show, setShow] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    try {
      const result = await onSubmit(formData);

      if (result?.ok)
        router.push('/');
    }
    catch (e) {
      console.warn('error', e);
    }
  };

  return (
    <div className="space-y-8">
      {/* App Branding */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-xs text-white/50 uppercase tracking-wider font-montserrat">PT</p>
            <h2 className="text-xl font-light text-white font-playfair">PreetyTwist</h2>
          </div>
        </div>
        <span className="text-sm text-white/40">v1.0</span>
      </div>

      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-light text-white font-playfair">
          {mode === 'sign-in' ? 'Welcome back' : 'Create account'}
        </h1>
        <p className="text-white/60 font-light font-inter">
          {mode === 'sign-in'
            ? 'Sign in to continue your shopping.'
            : 'Create your account to start shopping.'}
        </p>
      </div>

      {/* Form */}
      <form className="space-y-6" onSubmit={handleSubmit}>
        {mode === 'sign-up' && (
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm text-white/70 font-inter">
              Full name
            </label>
            <div className="relative">
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your name"
                className="w-full rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 px-12 py-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all font-inter"
                autoComplete="name"
              />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
            </div>
          </div>
        )}

        {/* Email or username */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm text-white/70 font-inter">
            Email or username
          </label>
          <div className="relative">
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@domain.com"
              className="w-full rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 px-12 py-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all font-inter"
              autoComplete="email"
              required
            />
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm text-white/70 font-inter">
              Password
            </label>
            {mode === 'sign-in' && (
              <Link href="/forgot-password" className="text-sm text-orange-400 hover:text-orange-300 font-inter">
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
              className="w-full rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 px-12 py-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all font-inter"
              autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'}
              minLength={8}
              required
            />
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
              onClick={() => setShow(v => !v)}
              aria-label={show ? 'Hide password' : 'Show password'}
            >
              {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Remember me & Need help */}
        {mode === 'sign-in' && (
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-white/30 bg-white/10 text-orange-500 focus:ring-2 focus:ring-orange-500/50"
              />
              <span className="text-white/70 group-hover:text-white transition-colors font-inter">
                Remember me
              </span>
            </label>
            <Link href="/help" className="text-white/70 hover:text-white transition-colors font-inter">
              Need help?
            </Link>
          </div>
        )}

        {/* Sign in/up Button */}
        <button
          type="submit"
          className="w-full rounded-2xl bg-linear-to-r from-orange-400 via-orange-500 to-yellow-400 px-6 py-4 text-white font-semibold hover:shadow-lg hover:shadow-orange-500/50 transition-all flex items-center justify-center gap-2 font-montserrat tracking-wide"
        >
          <span>{mode === 'sign-in' ? 'Sign in' : 'Sign up'}</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        {/* Account toggle */}
        <p className="text-center text-sm text-white/60 font-inter">
          {mode === 'sign-in' ? 'New here? ' : 'Already have an account? '}
          <Link
            href={mode === 'sign-in' ? '/sign-up' : '/sign-in'}
            className="text-white hover:underline font-medium"
          >
            {mode === 'sign-in' ? 'Create account' : 'Sign in'}
          </Link>
        </p>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-4">
        <hr className="flex-1 border-white/20" />
        <span className="text-sm text-white/50 font-inter">Or continue with</span>
        <hr className="flex-1 border-white/20" />
      </div>

      {/* Social Providers */}
      <SocialProviders variant={mode} />

      {/* Terms for sign up */}
      {mode === 'sign-up' && (
        <p className="text-center text-xs text-white/50 font-inter">
          By signing up, you agree to our
          {' '}
          <a href="#" className="underline hover:text-white/70">
            Terms of Service
          </a>
          {' '}
          and
          {' '}
          <a href="#" className="underline hover:text-white/70">
            Privacy Policy
          </a>
        </p>
      )}
    </div>
  );
}
