'use client';

import type { ReactNode } from 'react';
import { ArrowRight, Eye, EyeOff, MessageSquare } from 'lucide-react';

interface AuthHeadingProps {
  title: ReactNode;
  description: ReactNode;
}

interface AuthSubmitButtonProps {
  isLoading: boolean;
  loadingLabel: string;
  label: string;
}

interface PasswordToggleButtonProps {
  show: boolean;
  disabled?: boolean;
  onToggle: () => void;
}

export function AuthIdentityHeader() {
  return (
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
  );
}

export function AuthHeading({ title, description }: AuthHeadingProps) {
  return (
    <div className="space-y-3">
      <h1 className="text-4xl font-light text-text-primary font-playfair tracking-tight leading-none italic">
        {title}
      </h1>
      <p className="text-text-secondary font-light text-sm tracking-wide">{description}</p>
    </div>
  );
}

export function AuthErrorNotice({ error }: { error: string | null }) {
  if (!error) {
    return null;
  }

  return (
    <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 animate-in fade-in slide-in-from-top-2">
      <p className="text-xs text-destructive font-medium tracking-wide flex items-center gap-2">
        <span className="w-1 h-1 rounded-full bg-destructive animate-pulse" />
        {error}
      </p>
    </div>
  );
}

export function AuthSubmitButton({ isLoading, loadingLabel, label }: AuthSubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className="w-full rounded-full bg-accent px-8 py-5 text-white font-bold tracking-[0.3em] uppercase hover:shadow-xl hover:shadow-accent/30 transition-all flex items-center justify-center gap-3 active:scale-95 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading
        ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>{loadingLabel}</span>
            </div>
          )
        : (
            <>
              <span>{label}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
    </button>
  );
}

export function PasswordToggleButton({ show, disabled, onToggle }: PasswordToggleButtonProps) {
  return (
    <button
      type="button"
      className="absolute right-6 top-1/2 -translate-y-1/2 text-text-secondary opacity-50 hover:opacity-100 transition-opacity"
      onClick={onToggle}
      aria-label={show ? 'Hide password' : 'Show password'}
      disabled={disabled}
    >
      {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
    </button>
  );
}
