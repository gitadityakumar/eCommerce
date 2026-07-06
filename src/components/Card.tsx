import Image from 'next/image';
import Link from 'next/link';
import { normalizeImageUrl } from '@/lib/images';

interface CardProps {
  title: string;
  description?: string;
  subtitle?: string;
  meta?: string | string[];
  imageSrc: string;
  imageAlt?: string;
  price?: string | number;
  href?: string;
  priority?: boolean;

  className?: string;
}

export default function Card({
  title,
  description,
  subtitle,
  meta,
  imageSrc,
  imageAlt = title,
  price,
  href,
  priority = false,

  className = '',
}: CardProps) {
  const displayPrice
    = price === undefined ? undefined : typeof price === 'number' ? `₹${price.toFixed(2)}` : price;
  const normalizedImageSrc = normalizeImageUrl(imageSrc) ?? imageSrc;
  const content = (
    <article
      className={`group overflow-hidden rounded-[1.75rem] bg-surface transition-all duration-300 hover:-translate-y-1 hover:shadow-lifted ${className}`}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-bg-secondary">
        <Image
          src={normalizedImageSrc}
          alt={imageAlt}
          fill
          sizes="(min-width: 1280px) 360px, (min-width: 1024px) 300px, (min-width: 640px) 45vw, 90vw"
          priority={priority}
          className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 dark:opacity-80 group-hover:opacity-100"
        />
      </div>
      <div className="px-2 pt-5 pb-1">
        <div className="mb-2 flex items-baseline justify-between gap-3">
          <h3 className="text-lg font-light tracking-[-0.02em] text-text-primary transition-colors group-hover:text-accent">{title}</h3>
          {displayPrice && <span className="font-montserrat text-sm font-semibold text-text-primary tabular-nums">{displayPrice}</span>}
        </div>
        {description && <p className="text-sm text-text-secondary line-clamp-2">{description}</p>}
        {subtitle && <p className="text-sm text-text-secondary mt-1">{subtitle}</p>}
        {meta && (
          <p className="mt-2 text-xs tracking-wider uppercase text-text-secondary opacity-70">
            {Array.isArray(meta) ? meta.join(' • ') : meta}
          </p>
        )}
      </div>
    </article>
  );

  return href
    ? (
        <Link
          href={href}
          aria-label={title}
          className="block rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {content}
        </Link>
      )
    : (
        content
      );
}
