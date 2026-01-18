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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const contactInfo = [
  {
    icon: IconMail,
    label: 'Email',
    value: 'hello@preetytwist.com',
    href: '#',
  },
  {
    icon: IconPhone,
    label: 'Phone',
    value: '+91 9876543210',
    href: '#',
  },
  {
    icon: IconMapPin,
    label: 'Address',
    value: 'Mumbai, Maharashtra, India',
    href: '#',
  },
];

const socialLinks = [
  {
    icon: IconBrandInstagram,
    label: 'Instagram',
    href: '#',
  },
  {
    icon: IconBrandWhatsapp,
    label: 'WhatsApp',
    href: '#',
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
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
            Get In Touch
          </span>
          <h1 className="font-playfair text-4xl md:text-6xl lg:text-7xl font-light tracking-tight mb-6">
            Contact Us
          </h1>
          <p className="font-inter text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
            We'd love to hear from you. Whether you have a question about our
            collections, orders, or anything else — our team is ready to answer all
            your questions.
          </p>
        </motion.div>

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
                Reach Out
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
                    className="flex items-center justify-center w-12 h-12 rounded-full border border-border bg-card/50 hover:border-accent hover:bg-accent hover:text-white text-foreground transition-all duration-300"
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
                Send a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
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
                      placeholder="Your name"
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
                      placeholder="your@email.com"
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
                    placeholder="How can we help?"
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
                    placeholder="Tell us more..."
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
                    Send Message
                    <IconSend size={18} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
