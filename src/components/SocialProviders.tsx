import Image from 'next/image';

interface Props { variant?: 'sign-in' | 'sign-up' }

export default function SocialProviders({ variant = 'sign-in' }: Props) {
  return (
    <div className="space-y-3">
      <button
        type="button"
        className="flex w-full items-center justify-center gap-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 px-4 py-3 text-white/90 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all font-inter"
        aria-label={`${variant === 'sign-in' ? 'Continue' : 'Sign up'} with Google`}
      >
        <Image src="/google.svg" alt="" width={18} height={18} />
        <span>Continue with Google</span>
      </button>
      <button
        type="button"
        className="flex w-full items-center justify-center gap-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 px-4 py-3 text-white/90 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all font-inter"
        aria-label={`${variant === 'sign-in' ? 'Continue' : 'Sign up'} with Apple`}
      >
        <Image src="/facebook.svg" alt="" width={18} height={18} />
        <span>Continue with Facebook</span>
      </button>
    </div>
  );
}
