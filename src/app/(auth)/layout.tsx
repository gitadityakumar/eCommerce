import Image from 'next/image';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-bg-secondary p-4 sm:p-6 lg:p-8 flex items-center justify-center transition-colors duration-500">
      {/* Background purely for aesthetic depth */}
      <div className="fixed inset-0 bg-linear-to-br from-accent/5 via-transparent to-accent/5 pointer-events-none" />
      <div className="w-full max-w-6xl bg-surface border border-border-subtle rounded-3xl shadow-soft overflow-hidden relative z-10 transition-colors duration-500">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
          {/* Left Panel - Image with Gradient Overlay */}
          <section className="hidden lg:flex relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent z-10" />
            <div className="absolute inset-0 bg-accent/20 mix-blend-overlay z-10" />
            <Image
              src="https://ik.imagekit.io/nq9atqhjb/ChatGPT%20Image%20Dec%2027,%202025,%2005_31_59%20PM.png?q=80&w=1000"
              alt="Authentication"
              fill
              className="object-cover scale-105 hover:scale-100 transition-transform duration-10000"
              priority
            />

            {/* Bottom Labels */}
            <div className="absolute bottom-12 left-12 right-12 z-20 space-y-6">
              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-xl rounded-2xl px-6 py-4 w-fit border border-white/20 shadow-2xl">
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
          <section className="flex items-center justify-center p-8 sm:p-12 lg:p-16 bg-surface transition-colors duration-500">
            <div className="w-full max-w-md">{children}</div>
          </section>
        </div>
      </div>
    </main>
  );
}
