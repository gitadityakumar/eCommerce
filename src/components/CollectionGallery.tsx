'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';

export default function CollectionGallery() {
  const items = [
    {
      id: 'onyx-velvet-bow',
      image: '/editorial/signature-velvet-bow.jpg',
      title: 'Onyx velvet bow',
      collection: 'Noir collection',
      price: '₹8,850',
      offset: 'md:mt-0',
      href: '/products',
    },
    {
      id: 'scarlet-silk-ribbon',
      image: 'https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/c543a9e1-f226-4ced-80b0-feb8445a75b9_1600w.jpg',
      title: 'Scarlet silk ribbon',
      collection: 'Rouge series',
      price: '₹10,400',
      offset: 'md:mt-16',
      href: '/products',
    },
    {
      id: 'ivory-satin-knot',
      image: 'https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/917d6f93-fb36-439a-8c48-884b67b35381_1600w.jpg',
      title: 'Ivory satin knot',
      collection: 'Bridal edit',
      price: '₹12,750',
      offset: 'md:mt-0',
      href: '/products',
    },
  ];

  const handleQuickAdd = (e: React.MouseEvent, title: string) => {
    e.preventDefault();
    e.stopPropagation();
    toast.success(`Reserved ${title} to your bag`);
  };

  return (
    <section className="py-28 md:py-36 overflow-hidden bg-background transition-colors duration-500">
      <div className="max-w-[1800px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-accent text-xs tracking-[0.28em] uppercase font-semibold">Curated series</span>
          <h2 className="text-4xl md:text-5xl text-text-primary mt-4 font-light tracking-[-0.035em] font-(--font-playfair)">
            Winter pieces
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16 md:gap-y-24">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              className={`group flex flex-col items-center ${item.offset}`}
            >
              <Link href={item.href} className="w-full flex flex-col items-center">
                <div className="relative w-full aspect-3/4 overflow-hidden rounded-md bg-surface shadow-soft border border-border-subtle/50">
                  <div
                    className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/60 z-10 flex items-end justify-center pb-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <button
                      type="button"
                      onClick={e => handleQuickAdd(e, item.title)}
                      className="text-white border border-white/40 bg-black/30 px-7 py-2.5 text-xs tracking-widest uppercase backdrop-blur-md transition-all rounded-full hover:bg-white hover:text-black hover:scale-105 active:scale-95"
                    >
                      Quick add
                    </button>
                  </div>
                  <Image
                    src={item.image}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-90 group-hover:opacity-100 dark:opacity-80"
                    alt={item.title}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                  />
                </div>
                <div className="mt-8 text-center px-4">
                  <h3 className="text-xl text-text-primary font-light tracking-wide mb-2 group-hover:text-accent transition-colors font-(--font-playfair)">
                    {item.title}
                  </h3>
                  <p className="text-text-secondary font-serif italic text-sm opacity-80">{item.collection}</p>
                  <p className="text-text-primary mt-3 text-base font-medium tabular-nums">{item.price}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
