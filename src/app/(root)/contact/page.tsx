'use client';

import {
  IconBrandInstagram,
  IconBrandWhatsapp,
  IconMail,
  IconMapPin,
  IconPhone,
  IconSend,
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { MarketingHero, MarketingPageShell } from '@/components/marketing-page-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const contactInfo = [
  {
    icon: IconMail,
    label: 'Email',
    value: 'hello@preetytwist.com',
    href: 'mailto:hello@preetytwist.com',
  },
  {
    icon: IconPhone,
    label: 'Phone',
    value: '+91 98765 43210',
    href: 'tel:+919876543210',
  },
  {
    icon: IconMapPin,
    label: 'Address',
    value: 'Mumbai, Maharashtra, India',
    href: 'https://www.google.com/maps/search/?api=1&query=Mumbai%2C%20Maharashtra%2C%20India',
  },
];

const socialLinks = [
  {
    icon: IconBrandInstagram,
    label: 'Instagram',
    href: 'https://instagram.com/preetytwist',
  },
  {
    icon: IconBrandWhatsapp,
    label: 'WhatsApp',
    href: 'https://wa.me/919876543210',
  },
];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sent'>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('idle');
    setError(null);

    if (!/^[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(formData.email)) {
      setError('Enter a valid email address.');
      return;
    }

    setStatus('sent');
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <MarketingPageShell>
      <MarketingHero
        eyebrow="Get In Touch"
        title="Contact Us"
        description={(
          <>
            Ask about a piece, a custom color, or an order already in motion.
            We usually reply within one working day.
          </>
        )}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
        {/* Contact Info Section */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-8"
        >
          <div>
            <h2 className="font-playfair text-2xl md:text-3xl font-light mb-8">
              Reach out
            </h2>

            <div className="space-y-6">
              {contactInfo.map((item, index) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="group flex items-center gap-5 p-5 rounded-lg bg-card/50 backdrop-blur-sm border border-border hover:border-accent/30 hover:bg-accent/5 transition-all duration-300"
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white transition-all duration-300">
                    <item.icon size={22} />
                  </div>
                  <div>
                    <span className="block text-xs text-muted-foreground uppercase tracking-widest mb-1">
                      {item.label}
                    </span>
                    <span className="font-montserrat text-foreground group-hover:text-accent transition-colors">
                      {item.value}
                    </span>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h3 className="font-montserrat text-xs uppercase tracking-[0.2em] text-muted-foreground mb-5">
              Follow Us
            </h3>
            <div className="flex gap-4">
              {socialLinks.map(social => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-12 h-12 rounded-full border border-border bg-card/50 hover:border-accent hover:bg-accent hover:text-white text-foreground transition-all duration-300 active:scale-95"
                  aria-label={social.label}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Contact Form Section */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-8 md:p-10">
            <h2 className="font-playfair text-2xl md:text-3xl font-light mb-8">
              Send a note
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {status === 'sent' && (
                <div className="rounded-2xl border border-accent/25 bg-accent/8 px-5 py-4 text-sm text-text-primary">
                  Your message is ready. Email us directly at hello@preetytwist.com and include your preferred piece or order number.
                </div>
              )}
              {error && (
                <div className="rounded-2xl border border-destructive/25 bg-destructive/8 px-5 py-4 text-sm text-destructive">
                  {error}
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">
                    Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Anika Rao"
                    required
                    className="bg-background/50 border-border focus:border-accent focus:ring-accent/20"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="anika@example.com"
                    aria-invalid={Boolean(error)}
                    required
                    className="bg-background/50 border-border focus:border-accent focus:ring-accent/20"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">
                  Subject
                </label>
                <Input
                  id="subject"
                  name="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Custom pearl bow for 12 August"
                  required
                  className="bg-background/50 border-border focus:border-accent focus:ring-accent/20"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">
                  Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us which piece, date, color, or order number we should look at."
                  required
                  rows={5}
                  className="bg-background/50 border-border focus:border-accent focus:ring-accent/20 resize-none"
                />
              </div>

              <Button
                type="submit"
                className="group w-full h-14 bg-accent hover:bg-accent/90 text-white rounded-full font-montserrat uppercase tracking-[0.15em] text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-accent/25"
              >
                <span className="flex items-center justify-center gap-3">
                  Send note
                  <IconSend size={18} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </MarketingPageShell>
  );
}
