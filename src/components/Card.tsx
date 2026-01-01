import Image from 'next/image';
import Link from 'next/link';

export interface CardProps {
  title: string;
  description?: string;
  subtitle?: string;
  meta?: string | string[];
  imageSrc: string;
  imageAlt?: string;
  price?: string | number;
  href?: string;

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

  className = '',
}: CardProps) {
  const displayPrice
    = price === undefined ? undefined : typeof price === 'number' ? `₹${price.toFixed(2)}` : price;
  const content = (
    <article
      className={`group rounded-xl bg-surface border border-border-subtle transition-all duration-300 hover:shadow-soft hover:border-accent/30 ${className}`}
    >
      <div className="relative aspect-square overflow-hidden rounded-t-xl bg-bg-secondary">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="(min-width: 1280px) 360px, (min-width: 1024px) 300px, (min-width: 640px) 45vw, 90vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 dark:opacity-80 group-hover:opacity-100"
        />
      </div>
      <div className="p-5">
        <div className="mb-2 flex items-baseline justify-between gap-3">
          <h3 className="text-lg font-light tracking-wide text-text-primary">{title}</h3>
          {displayPrice && <span className="text-base font-medium text-text-primary">{displayPrice}</span>}
        </div>
        {description && <p className="text-sm text-text-secondary line-clamp-2">{description}</p>}
        {subtitle && <p className="text-sm text-text-secondary mt-1">{subtitle}</p>}
        {meta && (
          <p className="mt-2 text-xs tracking-wider uppercase text-text-secondary opacity-60">
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
