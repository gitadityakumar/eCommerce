import Image from 'next/image';

interface Props { variant?: 'sign-in' | 'sign-up' }

export default function SocialProviders({ variant = 'sign-in' }: Props) {
  return (
    <div className="space-y-3">
      <button
        type="button"
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-input bg-card px-4 py-3 text-body-medium text-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label={`${variant === 'sign-in' ? 'Continue' : 'Sign up'} with Google`}
      >
        <Image src="/google.svg" alt="" width={18} height={18} />
        <span>Continue with Google</span>
      </button>
      <button
        type="button"
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-input bg-card px-4 py-3 text-body-medium text-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label={`${variant === 'sign-in' ? 'Continue' : 'Sign up'} with Apple`}
      >
        <Image src="/apple.svg" alt="" width={18} height={18} />
        <span>Continue with Apple</span>
      </button>
    </div>
  );
}
