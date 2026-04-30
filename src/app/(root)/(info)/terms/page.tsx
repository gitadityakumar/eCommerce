'use client';

import type { ReactNode } from 'react';
import {
  IconAlertCircle,
  IconCheck,
  IconCopyright,
  IconCreditCard,
  IconFileText,
  IconGavel,
  IconMail,
  IconPackage,
  IconRefresh,
  IconScale,
  IconShieldCheck,
  IconShoppingBag,
  IconUser,
  IconX,
} from '@tabler/icons-react';
import {
  LegalContactCard,
  LegalHero,
  LegalIntroCard,
  LegalLinks,
  LegalNoticeCard,
  LegalPageShell,
  LegalSectionCard,
} from '@/components/legal-page';

interface TermsSection {
  title: string;
  icon: ReactNode;
  content: string[];
}

const termsData: TermsSection[] = [
  {
    title: 'Acceptance of Terms',
    icon: <IconCheck size={24} />,
    content: [
      'By accessing or using Preety Twist ("we," "our," or "us"), you agree to be bound by these Terms of Service.',
      'These terms apply to all visitors, users, and customers of our website and services.',
      'If you do not agree with any part of these terms, you must not use our website or services.',
      'We reserve the right to update these terms at any time, and continued use constitutes acceptance of changes.',
      'You must be at least 18 years old to use our services or have parental consent.',
    ],
  },
  {
    title: 'Account Registration',
    icon: <IconUser size={24} />,
    content: [
      'You may need to create an account to access certain features of our website.',
      'You are responsible for maintaining the confidentiality of your account credentials.',
      'You agree to provide accurate, current, and complete information during registration.',
      'You are solely responsible for all activities that occur under your account.',
      'You must notify us immediately of any unauthorized use of your account.',
      'We reserve the right to suspend or terminate accounts that violate these terms.',
    ],
  },
  {
    title: 'Products & Orders',
    icon: <IconShoppingBag size={24} />,
    content: [
      'All products displayed on our website are subject to availability.',
      'We strive to display accurate colors and images, but cannot guarantee exact representation on all devices.',
      'Prices are in Indian Rupees (INR) and include applicable taxes unless otherwise stated.',
      'We reserve the right to refuse or cancel any order for any reason, including pricing errors.',
      'Order confirmation does not constitute acceptance; acceptance occurs upon shipping.',
      'Product descriptions are for informational purposes and do not constitute a warranty.',
    ],
  },
  {
    title: 'Payments & Pricing',
    icon: <IconCreditCard size={24} />,
    content: [
      'We accept various payment methods including credit/debit cards, UPI, net banking, and popular wallets.',
      'All payments are processed securely through our trusted payment partners.',
      'Prices may change without notice, but orders placed at the previous price will be honored.',
      'In case of payment failure, orders will be automatically cancelled after 24 hours.',
      'Refunds, if applicable, will be processed to the original payment method.',
      'For COD orders, payment must be made at the time of delivery.',
    ],
  },
  {
    title: 'Shipping & Delivery',
    icon: <IconPackage size={24} />,
    content: [
      'We aim to dispatch orders within 1-3 business days of order confirmation.',
      'Delivery times are estimates and may vary based on location and other factors.',
      'Risk of loss passes to you upon delivery to the shipping carrier.',
      'We are not responsible for delays caused by shipping carriers, customs, or natural events.',
      'You must provide accurate shipping information; we are not liable for misdelivery due to incorrect addresses.',
      'For international orders, you are responsible for any customs duties or import taxes.',
    ],
  },
  {
    title: 'Returns & Refunds',
    icon: <IconRefresh size={24} />,
    content: [
      'Returns are accepted within 7 days of delivery for unworn, unwashed items with original tags.',
      'Customized, personalized, or sale items are not eligible for return unless defective.',
      'Return shipping costs may be borne by the customer unless the item is defective.',
      'Refunds are processed within 7-10 business days after receiving and inspecting the return.',
      'We reserve the right to refuse returns that do not meet our return policy criteria.',
      'Exchanges are subject to product availability at the time of request.',
    ],
  },
  {
    title: 'Intellectual Property',
    icon: <IconCopyright size={24} />,
    content: [
      'All content on our website, including text, graphics, logos, and images, is our property.',
      'You may not reproduce, distribute, or create derivative works without our written consent.',
      'Our trademarks and trade dress may not be used in connection with any product or service without permission.',
      'User-generated content (reviews, comments) grants us a non-exclusive, royalty-free license to use.',
      'You must not upload content that infringes on third-party intellectual property rights.',
    ],
  },
  {
    title: 'Prohibited Activities',
    icon: <IconX size={24} />,
    content: [
      'Using our website for any unlawful purpose or to violate any laws.',
      'Attempting to gain unauthorized access to our systems or user accounts.',
      'Interfering with or disrupting the integrity or performance of our website.',
      'Collecting or harvesting user information without consent.',
      'Using automated systems (bots, scrapers) to access our website without permission.',
      'Submitting false information or impersonating another person or entity.',
      'Engaging in any activity that could damage our reputation or business.',
    ],
  },
  {
    title: 'Limitation of Liability',
    icon: <IconGavel size={24} />,
    content: [
      'Our website and services are provided "as is" without warranties of any kind.',
      'We do not warrant that our website will be uninterrupted, error-free, or secure.',
      'We are not liable for any indirect, incidental, or consequential damages.',
      'Our maximum liability shall not exceed the amount paid by you for the specific product or service.',
      'We are not responsible for third-party content, links, or services.',
      'Some jurisdictions do not allow limitation of liability, so these limitations may not apply to you.',
    ],
  },
  {
    title: 'Indemnification',
    icon: <IconShieldCheck size={24} />,
    content: [
      'You agree to indemnify and hold us harmless from any claims, damages, or expenses.',
      'This includes claims arising from your use of our website or violation of these terms.',
      'You will cooperate fully in the defense of any claim.',
      'We reserve the right to assume exclusive defense of any matter subject to indemnification.',
    ],
  },
  {
    title: 'Governing Law',
    icon: <IconFileText size={24} />,
    content: [
      'These terms are governed by the laws of India.',
      'Any disputes shall be subject to the exclusive jurisdiction of courts in [City, State], India.',
      'If any provision of these terms is found unenforceable, other provisions remain in effect.',
      'These terms constitute the entire agreement between you and Preety Twist.',
      'Our failure to enforce any right does not constitute a waiver of that right.',
    ],
  },
];

export default function TermsPage() {
  const lastUpdated = 'January 2026';
  const effectiveDate = 'January 15, 2026';

  return (
    <LegalPageShell>
      <LegalHero
        title={(
          <>
            Terms of
            <br />
            <span className="text-accent">Service</span>
          </>
        )}
        description={(
          <>
            Please read these terms carefully before using our services.
            By using our website, you agree to be bound by these terms.
          </>
        )}
        meta={(
          <div className="flex flex-wrap justify-center gap-4">
            <p className="font-montserrat text-xs text-muted-foreground tracking-widest uppercase">
              Last Updated:
              {lastUpdated}
            </p>
            <span className="text-muted-foreground/50">•</span>
            <p className="font-montserrat text-xs text-muted-foreground tracking-widest uppercase">
              Effective:
              {effectiveDate}
            </p>
          </div>
        )}
      />

      <LegalIntroCard>
        Welcome to
        {' '}
        <span className="text-foreground font-medium">Preety Twist</span>
        . These Terms of Service ("Terms") govern your access to and use of our website, products, and services. By accessing our website, placing an order, or using any of our services, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree to these Terms, please do not use our website or services.
      </LegalIntroCard>

      <div className="space-y-6 mb-16">
        {termsData.map((section, index) => (
          <LegalSectionCard
            key={section.title}
            title={section.title}
            headerIcon={<span className="text-accent">{section.icon}</span>}
            items={section.content}
            itemIcon={<IconScale size={14} />}
            sectionIndex={index}
          />
        ))}
      </div>

      <LegalNoticeCard title="Important Notice" icon={<span className="text-accent"><IconAlertCircle size={28} /></span>}>
        These Terms of Service, together with our Privacy Policy, constitute the entire agreement between you and Preety Twist. If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions will remain in full force and effect. We recommend printing or saving a copy of these Terms for your records.
      </LegalNoticeCard>

      <LegalContactCard
        icon={<IconMail size={28} />}
        title="Questions About Our Terms?"
        description="If you have any questions or concerns about these Terms of Service, please don't hesitate to reach out to our legal team."
        emailHref="mailto:legal@preetytwist.com"
        emailLabel="Email Legal Team"
      />

      <LegalLinks primaryHref="/privacy" primaryLabel="Privacy Policy" />
    </LegalPageShell>
  );
}
