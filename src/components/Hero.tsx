"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
} from "@/components/ui/carousel";

const images = ['https://ik.imagekit.io/nq9atqhjb/luxury.png?updatedAt=1761674732245','https://ik.imagekit.io/nq9atqhjb/cute.png?updatedAt=1761674732210', 'https://ik.imagekit.io/nq9atqhjb/minimilistic.png?updatedAt=1761674732139','https://ik.imagekit.io/nq9atqhjb/Generated%20Image%20October%2031,%202025%20-%205_29PM.png?updatedAt=1761912072822','https://ik.imagekit.io/nq9atqhjb/Generated%20Image%20October%2031,%202025%20-%205_28PM.png?updatedAt=1761912072772','https://ik.imagekit.io/nq9atqhjb/Generated%20Image%20October%2031,%202025%20-%205_17PM.png?updatedAt=1761912072319']

interface BeamOptions {
  initialX?: number;
  translateX?: number;
  initialY?: string;
  translateY?: string;
  duration?: number;
  delay?: number;
  repeatDelay?: number;
  className?: string;
}

interface CollisionMechanismProps {
  parentRef: React.RefObject<HTMLDivElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  beamOptions: BeamOptions;
}

interface ExplosionProps {
  style: React.CSSProperties;
}

interface Coordinates {
  x: number;
  y: number;
}

interface CollisionState {
  detected: boolean;
  coordinates: Coordinates | null;
}




export default function Hero() {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  const [api, setApi] = useState<CarouselApi>();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; initialX: number; initialY: number; duration: number; delay: number; leftPercent: number }>>([]);

  // Generate particles only on client side to avoid hydration mismatch
  useEffect(() => {
    const generatedParticles = [...Array(20)].map((_, i) => ({
      id: i,
      initialX: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
      initialY: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5,
      leftPercent: Math.random() * 100,
    }));
    setParticles(generatedParticles);
  }, []);

  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 3000);

    return () => clearInterval(interval);
  }, [api]);

  // Mouse tracking for interactive light effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!parentRef.current) return;
      const rect = parentRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    const parent = parentRef.current;
    if (parent) {
      parent.addEventListener('mousemove', handleMouseMove);
      parent.addEventListener('mouseenter', handleMouseEnter);
      parent.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (parent) {
        parent.removeEventListener('mousemove', handleMouseMove);
        parent.removeEventListener('mouseenter', handleMouseEnter);
        parent.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  const beams = [
    { initialX: 100, translateX: 100, duration: 6, repeatDelay: 3, delay: 1 },
    { initialX: 300, translateX: 300, duration: 8, repeatDelay: 2, delay: 2 },
    { initialX: 600, translateX: 600, duration: 10, repeatDelay: 4, delay: 3 },
    { initialX: 900, translateX: 900, duration: 5, repeatDelay: 3, delay: 0 },
  ];

  return (
    <div
      ref={parentRef}
      className="relative hero-bg flex min-h-[70vh] sm:min-h-[80vh] lg:min-h-[90vh] w-full items-center justify-center overflow-hidden"
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30 dark:from-black/40 dark:to-black/50 z-10" />

      {/* Floating Decorative Elements */}
      <div className="absolute inset-0 z-10 overflow-hidden">
        {/* Floating Shape 1 - Top Left */}
        <motion.div
          initial={{ opacity: 0, x: -100, y: -100 }}
          animate={{
            opacity: 0.6,
            x: [-50, -30, -50],
            y: [-50, -70, -50],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute left-4 sm:left-10 top-20 h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-gradient-to-br from-pink-400/20 to-purple-400/20 blur-xl dark:from-pink-600/10 dark:to-purple-600/10"
        />

        {/* Floating Shape 2 - Top Right */}
        <motion.div
          initial={{ opacity: 0, x: 100, y: -100 }}
          animate={{
            opacity: 0.5,
            x: [50, 70, 50],
            y: [-30, -50, -30],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute right-4 sm:right-20 top-40 h-28 w-28 sm:h-40 sm:w-40 rounded-full bg-gradient-to-br from-amber-400/20 to-orange-400/20 blur-xl dark:from-amber-600/10 dark:to-orange-600/10"
        />

        {/* Floating Shape 3 - Bottom Left */}
        <motion.div
          initial={{ opacity: 0, x: -100, y: 100 }}
          animate={{
            opacity: 0.4,
            x: [-50, -70, -50],
            y: [50, 70, 50],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute left-[10%] sm:left-1/4 bottom-20 h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 blur-xl dark:from-purple-600/10 dark:to-pink-600/10"
        />
      </div>

      {/* Mouse-Following Light Effect */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute inset-0 z-[15]"
            style={{
              background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(236, 72, 153, 0.15), transparent 40%)`,
            }}
          />
        )}
      </AnimatePresence>

      {/* Enhanced Particle System */}
      <div className="absolute inset-0 z-[5] overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute h-1 w-1 rounded-full bg-gradient-to-r from-pink-400/30 to-purple-400/30"
            initial={{
              x: particle.initialX,
              y: particle.initialY,
              opacity: 0,
            }}
            animate={{
              y: [null, -100],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "linear",
            }}
            style={{
              left: `${particle.leftPercent}%`,
              filter: 'blur(1px)',
            }}
          />
        ))}
      </div>

      {/* Animated beams */}
      {beams.map((beam, idx) => (
        <CollisionMechanism
          key={idx}
          beamOptions={beam}
          containerRef={containerRef}
          parentRef={parentRef}
        />
      ))}

      {/* Hero Content */}
      <div className="relative z-20 flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 py-20 md:py-32">
        {/* Special Offer - Now at Top */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-50 -mt-4 mb-6 group"
        >
          <div className="relative rounded-full bg-gradient-to-r from-amber-500 to-orange-600 px-4 sm:px-6 py-2 text-xs sm:text-sm font-bold uppercase tracking-wide text-white shadow-lg transition-all duration-300 hover:from-amber-600 hover:to-orange-700 hover:shadow-xl hover:shadow-orange-500/30 hover:-translate-y-0.5 overflow-hidden">
            {/* Glare Effect */}
            <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full transition-transform duration-1000 ease-out group-hover:translate-x-full" />
            <span className="relative z-10">Limited Time: 20% Off Today Only!</span>
          </div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="relative z-50 mx-auto mb-6 mt-2 max-w-3xl sm:max-w-4xl lg:max-w-5xl text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl dark:text-white"
        >
          <span ref={wrapRef} data-brr="1" className="inline-block align-top [text-wrap:balance]">
            Find Your Perfect Premium Hair Bow in Minutes
            <div className="relative mx-auto inline-block w-max drop-shadow-[0_1px_3px_rgba(27,37,80,0.14)]">
              <div className="text-black [text-shadow:0_0_rgba(0,0,0,0.1)] dark:text-white">
                <span ref={spanRef}></span>
              </div>
            </div>
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="relative z-50 mx-auto mt-4 max-w-xl sm:max-w-2xl lg:max-w-3xl px-4 text-center text-lg sm:text-base md:text-lg lg:text-xl leading-relaxed text-gray-600 dark:text-gray-200"
        >
          Discover timeless elegance with our handcrafted hair bows.
          Each piece designed to add a touch of sophistication.
          Because true style begins with the smallest details.
        </motion.p>

        {/* Trust Badges & Social Proof with Glassmorphism */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="relative z-50 mt-8 rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-xl shadow-2xl dark:border-white/10 dark:bg-black/20"
        >
          {/* Rating with Pink/Purple Stars */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="h-4 w-4 md:h-5 md:w-5 fill-current text-transparent bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
            <span className="text-sm sm:text-xs font-semibold text-gray-700 md:text-sm dark:text-gray-300 whitespace-nowrap">
              Rated 4.9/5 by 2,000+ customers
            </span>
          </div>

          {/* Benefits */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm sm:text-xs md:text-sm lg:text-base text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2 rounded-full bg-white/20 px-3 py-1.5 backdrop-blur-sm dark:bg-black/30">
              <svg className="h-4 w-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="whitespace-nowrap font-medium">Handcrafted</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/20 px-3 py-1.5 backdrop-blur-sm dark:bg-black/30">
              <svg className="h-4 w-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="whitespace-nowrap font-medium">Premium Quality</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/20 px-3 py-1.5 backdrop-blur-sm dark:bg-black/30">
              <svg className="h-4 w-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="whitespace-nowrap font-medium">Free Shipping</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="mb-10 mt-12 flex w-full flex-col items-center justify-center gap-6 sm:gap-5 md:gap-4 lg:gap-6 px-4 sm:px-8 sm:flex-row md:mb-20"
        >
          <a
            className="group relative z-20 flex h-12 w-full max-w-[280px] items-center justify-center space-x-2 rounded-xl bg-black px-8 py-3 text-sm font-bold leading-6 text-white transition-all duration-300 before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-red-500 before:to-red-600 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100 hover:shadow-2xl hover:shadow-red-400/40 hover:-translate-y-1 active:scale-95 sm:w-52 overflow-hidden"
            href="#"
          >
            {/* Glare Effect */}
            <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full transition-transform duration-1000 ease-out group-hover:translate-x-full" />
            <span className="relative z-10 transition-transform duration-300 group-hover:scale-110 whitespace-nowrap">Buy now</span>
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            {/* Ripple Effect */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute inset-0 rounded-xl bg-white/20 scale-0 group-active:scale-100 transition-transform duration-300" />
            </div>
          </a>
          <a
            className="group relative z-20 flex h-12 w-full max-w-[280px] items-center justify-center space-x-2 rounded-xl bg-white px-6 py-3 text-sm font-bold leading-6 text-black border-2 border-gray-300 transition-all duration-300 hover:border-red-400/60 hover:shadow-2xl hover:shadow-red-400/30 hover:-translate-y-1 hover:bg-red-50 active:scale-95 before:absolute before:inset-0 before:rounded-xl before:bg-red-500/10 before:scale-0 before:transition-transform before:duration-300 hover:before:scale-100 dark:bg-neutral-800 dark:text-white dark:border-neutral-700 dark:hover:border-red-400/60 dark:hover:bg-neutral-700 sm:w-52 overflow-hidden"
            href="/pricing"
          >
            <svg className="h-5 w-5 transition-all duration-300 group-hover:translate-x-2 group-hover:scale-110 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            <span className="transition-transform duration-300 group-hover:scale-105 whitespace-nowrap">Explore catalogue</span>
          </a>
        </motion.div>

        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="relative mx-auto mt-16 max-w-5xl rounded-3xl border border-white/20 bg-white/20 p-4 sm:p-5 md:p-6 backdrop-blur-xl shadow-[0_8px_32px_rgba(248,113,113,0.25)] transition-all duration-500 hover:shadow-[0_8px_32px_rgba(248,113,113,0.4)] hover:border-pink-300/30 dark:border-white/10 dark:bg-white/5"
        >
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            setApi={setApi}
            className="w-full group"
          >
            <CarouselContent>
              {images.map((imageUrl, index) => (
                <CarouselItem key={index}>
                  <div className="relative overflow-hidden rounded-xl transition-transform duration-500 hover:scale-105">
                    <img
                      alt={`Slide ${index + 1}`}
                      loading="lazy"
                      width={1920}
                      height={1080}
                      decoding="async"
                      className="rounded-xl text-transparent transition-transform duration-500 h-48 sm:h-64 md:h-80 lg:h-96 object-cover"
                      src={imageUrl}
                    />
                    {/* Image Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100" />
                    {/* Hover Label */}
                    <div className="absolute bottom-4 left-4 translate-y-4 opacity-0 transition-all duration-300 hover:translate-y-0 hover:opacity-100">
                      <div className="rounded-full bg-white/90 px-4 py-2 text-sm font-bold text-gray-900 backdrop-blur-sm">
                        Premium Collection
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {/* Custom Dots Indicator */}
            <div className="flex justify-center gap-2 mt-4">
              {images.map((_, index) => (
                <div
                  key={index}
                  className="h-2 w-2 rounded-full bg-gray-300 transition-all duration-300 hover:bg-pink-500 dark:bg-gray-600"
                />
              ))}
            </div>
          </Carousel>
        </motion.div>
      </div>
    </div>
  );
}

const CollisionMechanism = React.forwardRef<HTMLDivElement, CollisionMechanismProps>(
  ({ parentRef, containerRef, beamOptions }, ref) => {
    const beamRef = useRef<HTMLDivElement>(null);
    const [collision, setCollision] = useState<CollisionState>({ detected: false, coordinates: null });
    const [beamKey, setBeamKey] = useState(0);
    const [cycleCollisionDetected, setCycleCollisionDetected] = useState(false);

    useEffect(() => {
      const checkCollision = () => {
        const beam = beamRef.current;
        const container = containerRef.current;
        const parent = parentRef.current;
        
        if (beam && container && parent && !cycleCollisionDetected) {
          const beamRect = beam.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          const parentRect = parent.getBoundingClientRect();

          if (beamRect.bottom >= containerRect.top) {
            const relativeX = beamRect.left - parentRect.left + beamRect.width / 2;
            const relativeY = beamRect.bottom - parentRect.top;
            setCollision({ detected: true, coordinates: { x: relativeX, y: relativeY } });
            setCycleCollisionDetected(true);
          }
        }
      };

      const animationInterval = setInterval(checkCollision, 50);
      return () => clearInterval(animationInterval);
    }, [cycleCollisionDetected, containerRef]);

    useEffect(() => {
      if (collision.detected && collision.coordinates) {
        setTimeout(() => {
          setCollision({ detected: false, coordinates: null });
          setCycleCollisionDetected(false);
        }, 2000);

        setTimeout(() => {
          setBeamKey((prevKey) => prevKey + 1);
        }, 2000);
      }
    }, [collision]);

    return (
      <>
        <motion.div
          key={beamKey}
          ref={beamRef}
          animate="animate"
          initial={{ translateY: beamOptions.initialY || "-200px", translateX: beamOptions.initialX || "0px" }}
          variants={{ animate: { translateY: beamOptions.translateY || "1800px", translateX: beamOptions.translateX || "0px" } }}
          transition={{
            duration: beamOptions.duration || 8,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
            delay: beamOptions.delay || 0,
            repeatDelay: beamOptions.repeatDelay || 0,
          }}
          className={cn(
            "absolute left-0 top-20 m-auto h-14 w-px rounded-full bg-gradient-to-t from-orange-500 via-yellow-500 to-transparent",
            beamOptions.className
          )}
        />

        <AnimatePresence>
          {collision.detected && collision.coordinates && (
            <Explosion
              key={`${collision.coordinates.x}-${collision.coordinates.y}`}
              style={{
                left: `${collision.coordinates.x}px`,
                top: `${collision.coordinates.y}px`,
                transform: "translate(-50%, -50%)",
              }}
            />
          )}
        </AnimatePresence>
      </>
    );
  }
);

CollisionMechanism.displayName = "CollisionMechanism";

const Explosion: React.FC<ExplosionProps> = ({ style }) => {
  const spans = Array.from({ length: 20 }, (_, index) => ({
    id: index,
    initialX: 0,
    initialY: 0,
    directionX: Math.floor(Math.random() * 80 - 40),
    directionY: Math.floor(Math.random() * -50 - 10),
  }));

  return (
    <div style={style} className="absolute z-50 h-2 w-2">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute -inset-x-10 top-0 m-auto h-2 w-10 rounded-full bg-gradient-to-r from-transparent via-orange-500 to-transparent blur-sm"
      ></motion.div>
      {spans.map((span) => (
        <motion.span
          key={span.id}
          initial={{ x: span.initialX, y: span.initialY, opacity: 1 }}
          animate={{ x: span.directionX, y: span.directionY, opacity: 0 }}
          transition={{ duration: Math.random() * 1.5 + 0.5, ease: "easeOut" }}
          className="absolute h-1 w-1 rounded-full bg-gradient-to-b from-orange-500 to-yellow-500"
        />
      ))}
    </div>
  );
}
