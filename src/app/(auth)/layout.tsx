import Image from 'next/image';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex h-[100dvh] items-center justify-center overflow-hidden bg-bg-secondary p-3 transition-colors duration-500 sm:p-4 lg:p-5 xl:p-6">
      {/* Background purely for aesthetic depth */}
      <div className="fixed inset-0 bg-linear-to-br from-accent/5 via-transparent to-accent/5 pointer-events-none" />
      <div className="relative z-10 max-h-[calc(100dvh-1.5rem)] w-full max-w-6xl overflow-hidden rounded-3xl border border-border-subtle bg-surface shadow-soft transition-colors duration-500 sm:max-h-[calc(100dvh-2rem)] lg:max-h-[calc(100dvh-2.5rem)] xl:max-h-[calc(100dvh-3rem)]">
        <div className="grid h-full min-h-0 grid-cols-1 lg:grid-cols-2">
          {/* Left Panel - Image with Gradient Overlay */}
          <section className="hidden lg:flex relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent z-10" />
            <div className="absolute inset-0 bg-accent/20 mix-blend-overlay z-10" />
            <Image
              src="https://cdn.100xadi.com/assets/authpage.webp"
              alt="Authentication"
              fill
              className="object-cover object-[50%_18%] transition-transform duration-10000 hover:scale-[1.02]"
              priority
            />

            {/* Bottom Labels */}
            <div className="absolute right-10 bottom-9 left-10 z-20 space-y-5">
              <div className="flex w-fit items-center gap-4 rounded-2xl border border-white/20 bg-white/10 px-5 py-3.5 shadow-2xl backdrop-blur-xl">
                <Image className="w-6 h-6 invert" width={24} height={24} src="/logo.svg" alt="" />
                <div className="flex flex-col">
                  <span className="text-white text-sm font-bold tracking-[0.2em] uppercase">Preety Twist</span>
                  <span className="text-white/60 text-[10px] tracking-widest uppercase">Editorial Collective</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-white/80 text-xs tracking-widest uppercase">
                <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span>Curated Excellence Since 2024</span>
              </div>
            </div>
          </section>

          {/* Right Panel - Form */}
          <section className="flex min-h-0 items-center justify-center overflow-y-auto bg-surface p-6 transition-colors duration-500 sm:p-8 lg:p-10 xl:p-12">
            <div className="w-full max-w-md">{children}</div>
          </section>
        </div>
      </div>
    </main>
  );
}
