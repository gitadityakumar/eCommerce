'use client';

import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import Image from 'next/image';

export default function CampaignShowcase() {
  return (
    <section className="py-20 overflow-hidden bg-[#100000]">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-between items-end mb-20 border-b border-white/5 pb-6"
        >
          <h3 className="text-3xl font-light text-white tracking-tight">
            Campaign
            {' '}
            <span className="font-serif italic text-neutral-500">No. 05</span>
          </h3>
          <a href="#" className="text-neutral-400 hover:text-white text-sm tracking-widest uppercase transition-colors">
            View Lookbook
          </a>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 auto-rows-[minmax(200px,auto)]">
          {/* Large Hero Item */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="md:col-span-6 md:row-span-2 relative group cursor-pointer"
          >
            <div className="w-full h-[80vh] overflow-hidden relative bg-neutral-900">
              <Image
                src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/c543a9e1-f226-4ced-80b0-feb8445a75b9_1600w.jpg"
                className="object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 opacity-80 group-hover:opacity-100"
                alt="Model Portrait"
                fill
              />
              <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black/90 to-transparent">
                <p className="text-white text-3xl font-serif italic mb-2">The Grand Bow</p>
                <p className="text-neutral-400 text-sm tracking-widest uppercase">$180.00 USD</p>
              </div>
            </div>
          </motion.div>

          {/* Texture Detail */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="md:col-span-6 md:row-span-1 relative group cursor-pointer overflow-hidden"
          >
            <Image
              src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/4734259a-bad7-422f-981e-ce01e79184f2_1600w.jpg"
              className="object-cover hover:scale-110 transition-transform duration-1000"
              alt="Texture Detail"
              fill
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
            <div className="absolute top-6 right-6">
              <span className="bg-white text-black text-[10px] font-bold px-2 py-1 uppercase tracking-widest">New In</span>
            </div>
            <div className="absolute bottom-6 left-6">
              <h4 className="text-white text-xl font-light">Silver Thread</h4>
              <p className="text-neutral-400 text-xs tracking-widest uppercase mt-1">Details</p>
            </div>
          </motion.div>

          {/* Product Focus Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="md:col-span-3 md:row-span-1 relative group cursor-pointer bg-neutral-900"
          >
            <div className="p-8 flex flex-col justify-between h-full border border-white/5 hover:border-white/20 transition-colors">
              <div className="flex justify-between items-start">
                <span className="text-neutral-500 text-xs">01.</span>
                <Plus className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <Image
                src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/917d6f93-fb36-439a-8c48-884b67b35381_1600w.jpg"
                className="w-32 h-32 object-cover mx-auto my-4 rounded-full shadow-2xl"
                alt="Accessory"
                width={128}
                height={128}
              />
              <div>
                <h4 className="text-white text-lg font-light leading-tight">Petite Noir</h4>
                <p className="text-neutral-500 text-sm mt-1">$85.00</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="md:col-span-3 md:row-span-1 relative group cursor-pointer bg-[#0a0a0a] flex items-center justify-center"
          >
            <div className="text-center p-6">
              <h4 className="text-2xl font-serif italic text-white mb-4">Custom Atelier</h4>
              <p className="text-neutral-400 text-sm font-light leading-relaxed mb-6">
                Bespoke commissions for weddings and galas.
              </p>
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: 'white', color: 'black' }}
                className="text-white border border-white/20 px-6 py-3 text-xs uppercase tracking-widest transition-all"
              >
                Inquire
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
