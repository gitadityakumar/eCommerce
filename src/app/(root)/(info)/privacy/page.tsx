'use client';

import { IconMail, IconShieldCheck } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface PrivacySection {
  title: string;
  icon: string;
  content: string[];
}

const privacyData: PrivacySection[] = [
  {
    title: 'Information We Collect',
    icon: '📋',
    content: [
      'Personal information you provide when creating an account (name, email address, phone number)',
      'Shipping and billing addresses for order fulfillment',
      'Payment information processed securely through our payment partners (we do not store complete card details)',
      'Order history and preferences to personalize your shopping experience',
      'Device information and browsing data to improve our website functionality',
      'Communications with our customer support team',
    ],
  },
  {
    title: 'How We Use Your Information',
    icon: '🎯',
    content: [
      'Process and fulfill your orders, including shipping and delivery',
      'Send order confirmations, shipping updates, and delivery notifications',
      'Provide customer support and respond to your inquiries',
      'Personalize your shopping experience with relevant product recommendations',
      'Send promotional emails and newsletters (with your consent)',
      'Improve our website, products, and services based on usage patterns',
      'Detect and prevent fraudulent transactions and ensure platform security',
    ],
  },
  {
    title: 'Information Sharing',
    icon: '🤝',
    content: [
      'Shipping partners (Shiprocket and courier services) to deliver your orders',
      'Payment processors (PhonePe and other payment gateways) to process transactions securely',
      'Analytics providers to help us understand website usage and improve our services',
      'Legal authorities when required by law or to protect our rights and safety',
      'We never sell your personal information to third parties for marketing purposes',
      'All third-party partners are contractually bound to protect your data',
    ],
  },
  {
    title: 'Data Security',
    icon: '🔐',
    content: [
      'Industry-standard SSL encryption protects all data transmitted to our servers',
      'Secure payment processing through PCI-DSS compliant payment gateways',
      'Regular security audits and vulnerability assessments',
      'Access to personal data is restricted to authorized personnel only',
      'Secure data storage with encrypted backups',
      'We promptly notify affected users in case of any data breach',
    ],
  },
  {
    title: 'Your Rights',
    icon: '⚖️',
    content: [
      'Access and review the personal information we hold about you',
      'Request correction of inaccurate or incomplete data',
      'Request deletion of your account and personal data (subject to legal retention requirements)',
      'Opt-out of marketing communications at any time',
      'Withdraw consent for data processing where applicable',
      'Lodge a complaint with the relevant data protection authority',
      'For Indian residents, rights under the Digital Personal Data Protection Act, 2023 apply',
    ],
  },
  {
    title: 'Cookies & Tracking',
    icon: '🍪',
    content: [
      'Essential cookies to enable basic website functionality and security',
      'Analytics cookies to understand how visitors interact with our website',
      'Preference cookies to remember your settings and choices',
      'Marketing cookies to deliver relevant advertisements (with your consent)',
      'You can manage cookie preferences through your browser settings',
      'Disabling certain cookies may affect website functionality',
    ],
  },
  {
    title: 'Data Retention',
    icon: '📁',
    content: [
      'Account information is retained as long as your account is active',
      'Order and transaction records are kept for 7 years as per tax regulations',
      'Marketing preferences are retained until you withdraw consent',
      'Customer support communications are retained for 3 years',
      'Upon account deletion, personal data is removed within 30 days (except where legally required)',
    ],
  },
  {
    title: 'Children\'s Privacy',
    icon: '👶',
    content: [
      'Our services are not intended for individuals under 18 years of age',
      'We do not knowingly collect personal information from minors',
      'If you believe a minor has provided us with personal data, please contact us immediately',
      'We will take steps to delete such information from our systems',
    ],
  },
];

function PrivacySectionCard({
  section,
  sectionIndex,
}: {
  section: PrivacySection;
  sectionIndex: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: sectionIndex * 0.08 }}
      className="bg-card/50 backdrop-blur-sm border border-border rounded-xl overflow-hidden hover:border-accent/20 transition-colors duration-300"
    >
      {/* Section Header */}
      <div className="px-6 py-5 border-b border-border bg-secondary/30">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{section.icon}</span>
          <h3 className="font-playfair text-xl md:text-2xl font-light text-foreground">
            {section.title}
          </h3>
        </div>
      </div>

      {/* Section Content */}
      <div className="px-6 py-5">
        <ul className="space-y-3">
          {section.content.map((item, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: sectionIndex * 0.08 + index * 0.05 }}
              className="flex items-start gap-3"
            >
              <span className="text-accent mt-1.5 shrink-0">
                <IconShieldCheck size={14} />
              </span>
              <span className="font-inter text-muted-foreground text-sm leading-relaxed">
                {item}
              </span>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

export default function PrivacyPage() {
  const lastUpdated = 'January 2026';

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
            Legal
          </span>
          <h1 className="font-playfair text-4xl md:text-6xl lg:text-7xl font-light tracking-tight mb-6">
            Privacy
            <br />
            <span className="text-accent">Policy</span>
          </h1>
          <p className="font-inter text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
            Your privacy is important to us. This policy outlines how we collect,
            use, and protect your personal information.
          </p>
          <p className="font-montserrat text-xs text-muted-foreground mt-6 tracking-widest uppercase">
            Last Updated:
            {' '}
            {lastUpdated}
          </p>
        </motion.div>

        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 md:p-8 mb-8"
        >
          <p className="font-inter text-muted-foreground text-base leading-relaxed">
            At
            {' '}
            <span className="text-foreground font-medium">Preety Twist</span>
            , we are committed to
            protecting your privacy and ensuring the security of your personal information. This Privacy
            Policy explains how we collect, use, disclose, and safeguard your data when you visit our
            website, make a purchase, or interact with our services. By using our platform, you consent
            to the practices described in this policy.
          </p>
        </motion.div>

        {/* Privacy Sections */}
        <div className="space-y-6 mb-16">
          {privacyData.map((section, index) => (
            <PrivacySectionCard key={section.title} section={section} sectionIndex={index} />
          ))}
        </div>

        {/* Policy Updates Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 md:p-8 mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">📢</span>
            <h3 className="font-playfair text-xl md:text-2xl font-light text-foreground">
              Policy Updates
            </h3>
          </div>
          <p className="font-inter text-muted-foreground text-sm leading-relaxed">
            We may update this Privacy Policy from time to time to reflect changes in our practices,
            technology, legal requirements, or other factors. When we make significant changes, we will
            notify you by posting the updated policy on our website and updating the "Last Updated" date.
            We encourage you to review this policy periodically to stay informed about how we protect
            your information.
          </p>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-center bg-card/50 backdrop-blur-sm border border-border rounded-xl p-8 md:p-12"
        >
          <div className="flex justify-center mb-5">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 text-accent">
              <IconMail size={28} />
            </div>
          </div>
          <h2 className="font-playfair text-2xl md:text-3xl font-light mb-4">
            Questions About Privacy?
          </h2>
          <p className="font-inter text-muted-foreground text-base max-w-lg mx-auto mb-8">
            If you have any questions about this Privacy Policy or how we handle your personal
            information, please don't hesitate to reach out to us.
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
              <a href="mailto:hello@preetytwist.com">
                Email Privacy Team
              </a>
            </Button>
          </div>
        </motion.div>

        {/* Legal Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center mt-12"
        >
          <p className="font-inter text-muted-foreground text-sm">
            Also see our
            {' '}
            <Link href="/terms" className="text-accent hover:underline underline-offset-4">
              Terms of Service
            </Link>
            {' '}
            and
            {' '}
            <Link href="/faq" className="text-accent hover:underline underline-offset-4">
              FAQ
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
