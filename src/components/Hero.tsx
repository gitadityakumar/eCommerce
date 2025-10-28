"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

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
  parentRef: React.RefObject<HTMLDivElement>;
  containerRef: React.RefObject<HTMLDivElement>;
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

  const beams = [
    { initialX: 100, translateX: 100, duration: 6, repeatDelay: 3, delay: 1 },
    { initialX: 300, translateX: 300, duration: 8, repeatDelay: 2, delay: 2 },
    { initialX: 600, translateX: 600, duration: 10, repeatDelay: 4, delay: 3 },
    { initialX: 900, translateX: 900, duration: 5, repeatDelay: 3, delay: 0 },
  ];

  return (
    <div
      ref={parentRef}
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-b from-white to-neutral-100 dark:from-neutral-950 dark:to-neutral-800"
    >
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
      <div className="relative z-20 flex flex-col items-center justify-center px-4 py-20 md:px-8 md:py-40">
        <h2 className="relative z-50 mx-auto mb-4 mt-4 max-w-4xl text-center text-3xl font-semibold tracking-tight text-gray-700 md:text-7xl dark:text-neutral-300">
          <span ref={wrapRef} data-brr="1" className="inline-block align-top bg-gradient-to-l from-red-900 to-stone-800 bg-clip-text text-transparent [text-wrap:balance]">
            Find Your Perfect Premium Hair Bow in Minutes
            <div className="relative mx-auto inline-block w-max drop-shadow-[0_1px_3px_rgba(27,37,80,0.14)]">
              <div className="text-black [text-shadow:0_0_rgba(0,0,0,0.1)] dark:text-white">
                <span ref={spanRef}></span>
              </div>
            </div>
          </span>
        </h2>

        <p className="relative z-50 mx-auto mt-4 max-w-lg px-4 text-center text-base leading-6 text-gray-600 dark:text-gray-200">
          Discover timeless elegance with our handcrafted hair bows.
            Each piece designed to add a touch of sophistication.
              Because true style begins with the smallest details.
        </p>

        <div className="mb-10 mt-8 flex w-full flex-col items-center justify-center gap-4 px-8 sm:flex-row md:mb-20">
          <a
            className="group relative z-20 flex h-10 w-full items-center justify-center space-x-2 rounded-lg bg-black px-4 py-2 text-sm font-semibold leading-6 text-white transition duration-200 sm:w-52 dark:bg-white dark:text-black"
            href="#"
          >
            Buy now
          </a>
          <a
            className="group relative z-20 flex h-10 w-full items-center justify-center space-x-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold leading-6 text-black shadow-input transition duration-200 hover:-translate-y-0.5 sm:w-52 dark:bg-neutral-800 dark:text-white"
            href="/pricing"
          >
            Explore catalogue
          </a>
        </div>

        <div
          ref={containerRef}
          className="relative mx-auto max-w-7xl rounded-4xl border border-neutral-200/50 bg-neutral-100 p-2 backdrop-blur-lg md:p-4 dark:border-neutral-700 dark:bg-neutral-800/50"
        >
          <div className="rounded-3xl border border-neutral-200 bg-white p-2 dark:border-neutral-700 dark:bg-black">
            <img
              alt="header"
              loading="lazy"
              width={1920}
              height={1080}
              decoding="async"
              className="rounded-[20px] text-transparent"
              src="https://ik.imagekit.io/nq9atqhjb/luxury.png?updatedAt=1761674732245"
            />
            
          </div>
        </div>
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
