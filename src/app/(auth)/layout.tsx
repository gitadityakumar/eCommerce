import Image from 'next/image';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-linear-to-br from-rose-500 via-purple-500 to-orange-400 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
      <div className="w-full max-w-6xl bg-black/20 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
          {/* Left Panel - Image with Gradient Overlay */}
          <section className="hidden lg:flex relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-red-500/80 via-purple-600/60 to-cyan-500/80 z-10" />
            <Image
              src="https://ik.imagekit.io/nq9atqhjb/ChatGPT%20Image%20Dec%2027,%202025,%2005_31_59%20PM.png?q=80&w=1000"
              alt="Authentication"
              fill
              className="object-cover"
              priority
            />

            {/* Bottom Labels */}
            <div className="absolute bottom-8 left-8 right-8 z-20 space-y-3">
              <div className="flex items-center gap-3 bg-black/30 backdrop-blur-md rounded-lg px-4 py-3 w-fit">
                <Image className="w-5 h-5 opacity-80" width={20} height={20} src="/logo.svg" alt="" />
                <span className="text-white/90 text-sm font-medium">Preety Twist</span>
              </div>

              <div className="flex items-center gap-2 text-amber-300/80 text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" strokeWidth="2" />
                </svg>
                <span>End-to-end ready</span>
              </div>
            </div>
          </section>

          {/* Right Panel - Form */}
          <section className="flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-linear-to-br from-slate-800/50 via-slate-900/70 to-slate-800/50">
            <div className="w-full max-w-md">{children}</div>
          </section>
        </div>
      </div>
    </main>
  );
}
