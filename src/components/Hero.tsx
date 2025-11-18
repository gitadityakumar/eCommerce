"use client";
import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
} from "@/components/ui/carousel";

const images = [
  'https://ik.imagekit.io/nq9atqhjb/luxury.png?updatedAt=1761674732245',
  'https://ik.imagekit.io/nq9atqhjb/cute.png?updatedAt=1761674732210',
  'https://ik.imagekit.io/nq9atqhjb/Generated%20Image%20October%2031,%202025%20-%205_29PM.png?updatedAt=1761912072822',
  'https://ik.imagekit.io/nq9atqhjb/Generated%20Image%20October%2031,%202025%20-%205_28PM.png?updatedAt=1761912072772',
  'https://ik.imagekit.io/nq9atqhjb/Generated%20Image%20October%2031,%202025%20-%205_17PM.png?updatedAt=1761912072319'
];

export default function Hero() {
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 3000);

    return () => clearInterval(interval);
  }, [api]);

  return (
    <div className="relative hero-bg h-screen w-full overflow-hidden">
      {/* Full Viewport Carousel Background */}
      <div className="absolute inset-0 z-[5]">
                <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          setApi={setApi}
          className="h-screen w-full group"
        >
          <CarouselContent className="h-screen flex">
            {images.map((imageUrl, index) => (
              <CarouselItem key={index} className="h-screen basis-full pl-4 md:pl-6 md:basis-1/2 lg:basis-1/3 flex">
                <div className="flex h-full items-center justify-end w-full overflow-hidden">
                  <img
                    alt={`Featured premium hair bow ${index + 1}`}
                    loading="lazy"
                    width={1920}
                    height={1080}
                    decoding="async"
                    className="h-full w-auto object-cover object-right"
                    src={imageUrl}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/20 dark:from-black/70 dark:via-black/50 dark:to-black/30 z-[10]" />
      
      {/* Floating Decorative Elements */}
      <div className="absolute inset-0 z-[8] overflow-hidden pointer-events-none">
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

      {/* Left Side Content Overlay */}
      <div className="relative z-20 h-full w-full flex">
        {/* Content Container - Fixed to left side */}
        <div className="flex h-full w-full flex-col justify-center px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 lg:w-1/2 xl:w-2/5 2xl:w-1/3">
          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="relative z-50 mb-6 text-left text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl"
          >
            <span className="inline-block align-top [text-wrap:balance]">
              Find Your Perfect Premium Hair Bow in Minutes
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="relative z-50 mb-8 max-w-xl text-left text-base sm:text-lg leading-relaxed text-gray-100 dark:text-gray-200"
          >
            Discover handcrafted luxury hair bows made with premium materials for everyday elegance.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="relative z-50 flex flex-col gap-4 sm:flex-row"
          >
            <a
              className="group relative z-20 flex h-12 items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-red-400 to-red-500 px-8 py-3 text-sm font-bold leading-6 text-white transition-all duration-300 before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-red-500 before:to-red-600 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100 hover:shadow-2xl hover:shadow-red-500/40 hover:-translate-y-1 active:scale-95 overflow-hidden"
              href="/products"
            >
              {/* Glare Effect */}
              <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full transition-transform duration-1000 ease-out group-hover:translate-x-full" />
              <span className="relative z-10 transition-transform duration-300 group-hover:scale-110 whitespace-nowrap">Buy now</span>
              {/* Ripple Effect */}
              <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 rounded-xl bg-white/20 scale-0 group-active:scale-100 transition-transform duration-300" />
              </div>
            </a>
            <a
              className="group relative z-20 flex h-12 items-center justify-center space-x-2 rounded-xl border-2 border-white/30 bg-transparent px-6 py-3 text-sm font-bold leading-6 text-white backdrop-blur-sm transition-all duration-300 hover:border-white/60 hover:bg-white/10 hover:shadow-2xl hover:shadow-white/20 hover:-translate-y-1 active:scale-95"
              href="/products"
            >
              <svg className="h-5 w-5 transition-all duration-300 group-hover:translate-x-2 group-hover:scale-110 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              <span className="transition-transform duration-300 group-hover:scale-105 whitespace-nowrap">Explore catalogue</span>
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
}