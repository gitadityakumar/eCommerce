'use client';

import { IconMail, IconShieldCheck } from '@tabler/icons-react';
import {
  LegalContactCard,
  LegalHero,
  LegalIntroCard,
  LegalLinks,
  LegalNoticeCard,
  LegalPageShell,
  LegalSectionCard,
} from '@/components/legal-page';

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

export default function PrivacyPage() {
  const lastUpdated = 'January 2026';

  return (
    <LegalPageShell>
      <LegalHero
        title={(
          <>
            Privacy
            <br />
            <span className="text-accent">Policy</span>
          </>
        )}
        description="Your privacy is important to us. This policy outlines how we collect, use, and protect your personal information."
        meta={(
          <p className="font-montserrat text-xs text-muted-foreground tracking-widest uppercase">
            Last Updated:
            {lastUpdated}
          </p>
        )}
      />

      <LegalIntroCard>
        At
        {' '}
        <span className="text-foreground font-medium">Preety Twist</span>
        , we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your data when you visit our website, make a purchase, or interact with our services. By using our platform, you consent to the practices described in this policy.
      </LegalIntroCard>

      <div className="space-y-6 mb-16">
        {privacyData.map((section, index) => (
          <LegalSectionCard
            key={section.title}
            title={section.title}
            headerIcon={<span className="text-2xl">{section.icon}</span>}
            items={section.content}
            itemIcon={<IconShieldCheck size={14} />}
            sectionIndex={index}
          />
        ))}
      </div>

      <LegalNoticeCard title="Policy Updates" icon={<span className="text-2xl">📢</span>}>
        We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. When we make significant changes, we will notify you by posting the updated policy on our website and updating the "Last Updated" date. We encourage you to review this policy periodically to stay informed about how we protect your information.
      </LegalNoticeCard>

      <LegalContactCard
        icon={<IconMail size={28} />}
        title="Questions About Privacy?"
        description="If you have any questions about this Privacy Policy or how we handle your personal information, please don't hesitate to reach out to us."
        emailHref="mailto:hello@preetytwist.com"
        emailLabel="Email Privacy Team"
      />

      <LegalLinks primaryHref="/terms" primaryLabel="Terms of Service" />
    </LegalPageShell>
  );
}
