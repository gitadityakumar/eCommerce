'use client';

import { IconChevronDown, IconMail, IconMessageCircle } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  title: string;
  icon: string;
  items: FAQItem[];
}

const faqData: FAQCategory[] = [
  {
    title: 'Orders & Shipping',
    icon: '📦',
    items: [
      {
        question: 'How long does shipping take?',
        answer:
          'Standard shipping typically takes 5-7 business days within India. Express shipping options are available at checkout for faster delivery within 2-3 business days. International shipping times vary by location.',
      },
      {
        question: 'How can I track my order?',
        answer:
          'Once your order is shipped, you will receive an email with tracking information. You can also view your order status by logging into your account and visiting the "My Orders" section.',
      },
      {
        question: 'What are the shipping charges?',
        answer:
          'We offer free standard shipping on all orders above ₹999. For orders below this amount, a flat shipping fee of ₹99 applies. Express shipping is available at an additional cost based on your location.',
      },
      {
        question: 'Do you ship internationally?',
        answer:
          'Yes, we ship to select international destinations. International shipping rates and delivery times vary by country. Please contact our support team for specific information about your location.',
      },
    ],
  },
  {
    title: 'Returns & Exchanges',
    icon: '🔄',
    items: [
      {
        question: 'What is your return policy?',
        answer:
          'We offer a 7-day return policy for all unworn, unwashed items with original tags attached. Returns are subject to quality inspection. Customized or personalized items cannot be returned unless defective.',
      },
      {
        question: 'How do I initiate a return?',
        answer:
          'To initiate a return, log into your account, go to "My Orders," select the order, and click "Request Return." You will receive a return shipping label via email. Pack the item securely and drop it off at the nearest courier partner.',
      },
      {
        question: 'When will I receive my refund?',
        answer:
          'Refunds are processed within 7-10 business days after we receive and inspect the returned item. The refund will be credited to your original payment method. For COD orders, refunds are processed via bank transfer.',
      },
      {
        question: 'Can I exchange an item for a different size?',
        answer:
          'Yes, exchanges are available for size changes subject to stock availability. Please initiate an exchange request within 7 days of delivery. There are no additional shipping charges for exchanges.',
      },
    ],
  },
  {
    title: 'Payments',
    icon: '💳',
    items: [
      {
        question: 'What payment methods do you accept?',
        answer:
          'We accept all major credit/debit cards (Visa, Mastercard, RuPay), UPI payments, net banking, popular wallets like PhonePe, Paytm, and Google Pay. Cash on Delivery (COD) is also available for select locations.',
      },
      {
        question: 'Is my payment information secure?',
        answer:
          'Absolutely. We use industry-standard SSL encryption and partner with trusted payment gateways like PhonePe to ensure your payment information is always secure. We never store your complete card details.',
      },
      {
        question: 'Can I pay using EMI?',
        answer:
          'Yes, EMI options are available on select credit cards for orders above ₹3,000. Available EMI plans and interest rates will be displayed at checkout based on your card issuer.',
      },
    ],
  },
  {
    title: 'Products & Care',
    icon: '✨',
    items: [
      {
        question: 'How do I care for my garments?',
        answer:
          'Each product comes with specific care instructions on the label. Generally, we recommend gentle hand washing or dry cleaning for delicate fabrics. Avoid direct sunlight when drying to preserve colors and fabric quality.',
      },
      {
        question: 'Are your products authentic?',
        answer:
          'All our products are 100% authentic and sourced directly from verified manufacturers. We guarantee the quality and authenticity of every item we sell. Each product undergoes strict quality checks before shipping.',
      },
      {
        question: 'Do you offer gift wrapping?',
        answer:
          'Yes, we offer premium gift wrapping services for an additional ₹149. This includes a luxury gift box, tissue paper, and a personalized gift message of your choice. Select this option at checkout.',
      },
    ],
  },
  {
    title: 'Account & Support',
    icon: '👤',
    items: [
      {
        question: 'How do I create an account?',
        answer:
          'Click on the "Sign In" button in the navigation bar and select "Create Account." You can register using your email address or sign in quickly with your Google account.',
      },
      {
        question: 'I forgot my password. What should I do?',
        answer:
          'Click on "Sign In" and then "Forgot Password." Enter your registered email address, and we will send you a link to reset your password. The link is valid for 24 hours.',
      },
      {
        question: 'How can I contact customer support?',
        answer:
          'You can reach our customer support team via email at hello@preetytwist.com, through our Contact page, or via WhatsApp. Our support hours are Monday to Saturday, 10 AM to 7 PM IST.',
      },
    ],
  },
];

function FAQAccordionItem({
  item,
  isOpen,
  onToggle,
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-b border-border last:border-b-0"
    >
      <button
        onClick={onToggle}
        className="w-full py-5 flex items-center justify-between text-left group"
        aria-expanded={isOpen}
      >
        <span className="font-montserrat text-foreground text-sm md:text-base pr-4 group-hover:text-accent transition-colors duration-300">
          {item.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="shrink-0"
        >
          <IconChevronDown
            size={20}
            className={`transition-colors duration-300 ${isOpen ? 'text-accent' : 'text-muted-foreground'}`}
          />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="pb-5 font-inter text-muted-foreground text-sm leading-relaxed">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function FAQCategoryCard({
  category,
  categoryIndex,
}: {
  category: FAQCategory;
  categoryIndex: number;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
      className="bg-card/50 backdrop-blur-sm border border-border rounded-xl overflow-hidden hover:border-accent/20 transition-colors duration-300"
    >
      {/* Category Header */}
      <div className="px-6 py-5 border-b border-border bg-secondary/30">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{category.icon}</span>
          <h3 className="font-playfair text-xl md:text-2xl font-light text-foreground">
            {category.title}
          </h3>
        </div>
      </div>

      {/* FAQ Items */}
      <div className="px-6">
        {category.items.map((item, index) => (
          <FAQAccordionItem
            key={index}
            item={item}
            isOpen={openIndex === index}
            onToggle={() => setOpenIndex(openIndex === index ? null : index)}
          />
        ))}
      </div>
    </motion.div>
  );
}

export default function FAQPage() {
  return (
    <div className="min-h-[80vh] bg-background text-foreground relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 py-24 md:py-32">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 md:mb-20"
        >
          <span className="text-muted-foreground text-xs tracking-[0.3em] uppercase block mb-6">
            Help Center
          </span>
          <h1 className="font-playfair text-4xl md:text-6xl lg:text-7xl font-light tracking-tight mb-6">
            Frequently Asked
            <br />
            <span className="text-accent">Questions</span>
          </h1>
          <p className="font-inter text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
            Find answers to common questions about orders, shipping, returns, and more.
            Can't find what you're looking for? We're here to help.
          </p>
        </motion.div>

        {/* FAQ Categories */}
        <div className="space-y-6 mb-16">
          {faqData.map((category, index) => (
            <FAQCategoryCard key={category.title} category={category} categoryIndex={index} />
          ))}
        </div>

        {/* Still Need Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center bg-card/50 backdrop-blur-sm border border-border rounded-xl p-8 md:p-12"
        >
          <div className="flex justify-center mb-5">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 text-accent">
              <IconMessageCircle size={28} />
            </div>
          </div>
          <h2 className="font-playfair text-2xl md:text-3xl font-light mb-4">
            Still Have Questions?
          </h2>
          <p className="font-inter text-muted-foreground text-base max-w-lg mx-auto mb-8">
            Our customer support team is available to assist you with any queries.
            We typically respond within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              className="group h-12 px-8 bg-accent hover:bg-accent/90 text-white rounded-full font-montserrat uppercase tracking-widest text-xs font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-accent/25"
            >
              <Link href="/contact">
                <IconMail size={16} className="mr-2" />
                Contact Us
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-12 px-8 border-border hover:border-accent rounded-full font-montserrat uppercase tracking-widest text-xs font-semibold transition-all duration-300"
            >
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
              >
                Email Support
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
