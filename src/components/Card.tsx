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
      className={`group overflow-hidden rounded-xl bg-surface transition-all duration-300 hover:-translate-y-1 hover:shadow-lifted ${className}`}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-bg-secondary border border-border-subtle/40">
        <Image
          src={normalizedImageSrc}
          alt={imageAlt}
          fill
          sizes="(min-width: 1280px) 360px, (min-width: 1024px) 300px, (min-width: 640px) 45vw, 90vw"
          priority={priority}
          className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 dark:opacity-85 group-hover:opacity-100"
        />
      </div>
      <div className="px-1.5 pt-4 pb-1">
        <div className="mb-1.5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-3">
          <h3 className="text-sm sm:text-base font-normal tracking-wide text-text-primary capitalize transition-colors group-hover:text-accent font-(--font-playfair) line-clamp-1">
            {title}
          </h3>
          {displayPrice && (
            <span className="font-(--font-montserrat) text-xs sm:text-sm font-semibold text-text-primary tabular-nums shrink-0">
              {displayPrice}
            </span>
          )}
        </div>
        {description && <p className="text-xs text-text-secondary line-clamp-2 font-light">{description}</p>}
        {subtitle && <p className="text-xs text-text-secondary/80 capitalize font-light">{subtitle}</p>}
        {meta && (
          <p className="mt-1.5 text-[11px] tracking-wider uppercase text-text-secondary/70">
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
