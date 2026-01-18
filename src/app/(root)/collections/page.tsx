'use client';

import { IconSparkles } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getCollections } from '@/actions/collections';

interface Collection {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  productCount: number;
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCollections() {
      const result = await getCollections();
      if (result.success && result.data) {
        setCollections(result.data);
      }
      setLoading(false);
    }
    fetchCollections();
  }, []);

  return (
    <div className="min-h-[80vh] bg-background text-foreground relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-32">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 md:mb-24"
        >
          <span className="text-muted-foreground text-xs tracking-[0.3em] uppercase block mb-6">
            Curated Collections
          </span>
          <h1 className="font-playfair text-4xl md:text-6xl lg:text-7xl font-light tracking-tight mb-6">
            Our Collections
          </h1>
          <p className="font-inter text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
            Discover our carefully curated collections, each telling a unique story
            of elegance and sophistication.
          </p>
        </motion.div>

        {/* Collections Grid */}
        {loading
          ? (
              <div className="flex items-center justify-center py-20">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                >
                  <IconSparkles size={32} className="text-accent" />
                </motion.div>
              </div>
            )
          : collections.length === 0
            ? (
                <motion.div
                  variants={fadeInUp}
                  initial="initial"
                  animate="animate"
                  className="text-center py-20"
                >
                  <div className="rounded-2xl border border-dashed border-border p-16 bg-card/50 backdrop-blur-sm">
                    <p className="text-lg text-muted-foreground font-light italic">
                      No collections available yet. Check back soon for our curated selections.
                    </p>
                  </div>
                </motion.div>
              )
            : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {collections.map((collection, index) => (
                    <motion.div
                      key={collection.id}
                      variants={fadeInUp}
                      initial="initial"
                      animate="animate"
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <Link
                        href={`/products?collection=${collection.slug}`}
                        className="group block"
                      >
                        <div className="relative h-80 rounded-xl overflow-hidden bg-card/50 backdrop-blur-sm border border-border hover:border-accent/30 transition-all duration-500">
                          {/* Gradient Background */}
                          <div className="absolute inset-0 bg-linear-to-br from-accent/5 via-transparent to-primary/5 group-hover:from-accent/10 group-hover:to-primary/10 transition-all duration-500" />

                          {/* Decorative Elements */}
                          <div className="absolute top-6 right-6 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                            <IconSparkles size={48} className="text-accent" />
                          </div>

                          {/* Content */}
                          <div className="absolute inset-0 flex flex-col justify-end p-8">
                            <div className="transform group-hover:-translate-y-2 transition-transform duration-500">
                              <span className="text-muted-foreground text-xs uppercase tracking-[0.2em] block mb-3">
                                {collection.productCount}
                                {' '}
                                {collection.productCount === 1
                                  ? 'piece'
                                  : 'pieces'}
                              </span>
                              <h2 className="font-playfair text-2xl md:text-3xl font-light text-foreground group-hover:text-accent transition-colors duration-300 mb-2">
                                {collection.name}
                              </h2>
                              <div className="flex items-center gap-2 text-muted-foreground group-hover:text-accent/80 transition-colors duration-300">
                                <span className="font-montserrat text-sm tracking-wider uppercase">
                                  Explore
                                </span>
                                <motion.span
                                  className="inline-block"
                                  initial={{ x: 0 }}
                                  whileHover={{ x: 4 }}
                                >
                                  →
                                </motion.span>
                              </div>
                            </div>
                          </div>

                          {/* Hover Border Glow */}
                          <div className="absolute inset-0 rounded-xl border border-accent/0 group-hover:border-accent/20 transition-all duration-500" />
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-20"
        >
          <Link
            href="/products"
            className="inline-flex items-center gap-3 px-8 py-4 bg-accent hover:bg-accent/90 text-white rounded-full font-montserrat uppercase tracking-[0.15em] text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-accent/25"
          >
            View All Products
            <IconSparkles size={18} />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
