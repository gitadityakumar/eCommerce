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
          {mode === 'sign-in' ? 'Welcome back' : 'Join the Collective'}
        </h1>
        <p className="text-text-secondary font-light text-sm tracking-wide">
          {mode === 'sign-in'
            ? 'Enter your credentials to access your curated selection.'
            : 'Enlist today for exclusive access to our seasonal drops.'}
        </p>
      </div>

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
                className="w-full rounded-full bg-background border border-border-subtle px-14 py-4 text-text-primary placeholder:text-text-secondary/40 focus:outline-none focus:ring-1 focus:ring-accent/30 focus:border-accent/40 transition-all font-inter text-sm shadow-soft"
                autoComplete="name"
              />
              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary opacity-50" />
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
              className="w-full rounded-full bg-background border border-border-subtle px-14 py-4 text-text-primary placeholder:text-text-secondary/40 focus:outline-none focus:ring-1 focus:ring-accent/30 focus:border-accent/40 transition-all font-inter text-sm shadow-soft"
              autoComplete="email"
              required
            />
            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary opacity-50" />
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
              className="w-full rounded-full bg-background border border-border-subtle px-14 py-4 text-text-primary placeholder:text-text-secondary/40 focus:outline-none focus:ring-1 focus:ring-accent/30 focus:border-accent/40 transition-all font-inter text-sm shadow-soft"
              autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'}
              minLength={8}
              required
            />
            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary opacity-50" />
            <button
              type="button"
              className="absolute right-6 top-1/2 -translate-y-1/2 text-text-secondary opacity-50 hover:opacity-100 transition-opacity"
              onClick={() => setShow(v => !v)}
              aria-label={show ? 'Hide password' : 'Show password'}
            >
              {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
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
                className="w-4 h-4 rounded border-border-subtle bg-background text-accent focus:ring-0 cursor-pointer transition-all"
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
        <button
          type="submit"
          className="w-full rounded-full bg-accent px-8 py-5 text-white font-bold tracking-[0.3em] uppercase hover:shadow-xl hover:shadow-accent/30 transition-all flex items-center justify-center gap-3 active:scale-95 text-xs"
        >
          <span>{mode === 'sign-in' ? 'Enter' : 'Create Account'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

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

      {/* Divider */}
      <div className="flex items-center gap-6">
        <div className="flex-1 h-px bg-border-subtle opacity-50" />
        <span className="text-[10px] text-text-secondary font-light uppercase tracking-[0.3em] opacity-40">OR</span>
        <div className="flex-1 h-px bg-border-subtle opacity-50" />
      </div>

      {/* Social Providers */}
      <SocialProviders variant={mode} />

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
