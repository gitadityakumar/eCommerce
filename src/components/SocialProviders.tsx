import Image from 'next/image';

interface Props { variant?: 'sign-in' | 'sign-up' }

export default function SocialProviders({ variant = 'sign-in' }: Props) {
  return (
    <div className="space-y-4">
      <button
        type="button"
        className="flex w-full items-center justify-center gap-4 rounded-full bg-background border border-border-subtle px-6 py-4 text-text-primary hover:bg-surface hover:border-accent/40 transition-all font-bold text-[10px] tracking-[0.2em] uppercase shadow-soft group"
        aria-label={`${variant === 'sign-in' ? 'Continue' : 'Sign up'} with Google`}
      >
        <Image src="/google.svg" alt="" width={18} height={18} className="group-hover:scale-110 transition-transform" />
        <span>Continue with Google</span>
      </button>
      <button
        type="button"
        className="flex w-full items-center justify-center gap-4 rounded-full bg-background border border-border-subtle px-6 py-4 text-text-primary hover:bg-surface hover:border-accent/40 transition-all font-bold text-[10px] tracking-[0.2em] uppercase shadow-soft group"
        aria-label={`${variant === 'sign-in' ? 'Continue' : 'Sign up'} with Apple`}
      >
        <Image src="/facebook.svg" alt="" width={18} height={18} className="group-hover:scale-110 transition-transform" />
        <span>Continue with Facebook</span>
      </button>
    </div>
  );
}
