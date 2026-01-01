'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function CollectionGallery() {
  const items = [
    {
      image: 'https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/4734259a-bad7-422f-981e-ce01e79184f2_1600w.jpg',
      title: 'Onyx Velvet',
      collection: 'Noir Collection',
      price: '₹120',
      offset: 'md:mt-0',
    },
    {
      image: 'https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/c543a9e1-f226-4ced-80b0-feb8445a75b9_1600w.jpg',
      title: 'Scarlet Silk',
      collection: 'Rouge Series',
      price: '₹145',
      offset: 'md:mt-20',
    },
    {
      image: 'https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/917d6f93-fb36-439a-8c48-884b67b35381_1600w.jpg',
      title: 'Ivory Satin',
      collection: 'Bridal Edit',
      price: '₹160',
      offset: 'md:mt-0',
    },
  ];

  return (
    <section className="py-32 overflow-hidden bg-background transition-colors duration-500">
      <div className="max-w-[1800px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <span className="text-accent text-xs tracking-[0.3em] uppercase">Curated Series</span>
          <h2 className="text-4xl text-text-primary mt-4 font-light tracking-tight">Winter Exhibition</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-24">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className={`group flex flex-col items-center ${item.offset}`}
            >
              <div className="relative w-full aspect-3/4 overflow-hidden bg-surface shadow-soft">
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 bg-linear-to-b from-transparent to-black/60 z-10 flex items-end justify-center pb-8"
                >
                  <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: 'white', color: 'black' }}
                    className="text-white border border-white/30 px-8 py-3 text-xs tracking-widest uppercase backdrop-blur-md transition-all rounded-full"
                  >
                    Quick Add
                  </motion.button>
                </motion.div>
                <Image
                  src={item.image}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-90 group-hover:opacity-100 dark:opacity-80"
                  alt={item.title}
                  fill
                />
              </div>
              <div className="mt-8 text-center px-4">
                <h3 className="text-xl text-text-primary font-light tracking-wide mb-2 group-hover:text-accent transition-colors">
                  {item.title}
                </h3>
                <p className="text-text-secondary font-serif italic text-sm opacity-80">{item.collection}</p>
                <p className="text-text-primary mt-3 text-base font-medium">{item.price}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
