import type { RecommendedProduct, Review } from '@/lib/actions/product';
import { Star } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import { Card, CollapsibleSection, ProductGallery, SizePicker, WishlistButton } from '@/components';
import AddToBagButton from '@/components/AddToBagButton';
import ColorSelector from '@/components/ColorSelector';
import ProductStateInitializer from '@/components/ProductStateInitializer';
import StockBadge from '@/components/StockBadge';
import { getProductReviews, getRecommendedProducts } from '@/lib/actions/product';
import { getStorefrontProduct } from '@/lib/actions/storefront';
import { getWishlistItemsAction } from '@/lib/actions/wishlist';
import { getCurrentUser } from '@/lib/auth/actions';

interface GalleryVariant { color: string; hexCode: string | null; images: string[] }

function formatPrice(price: number | null | undefined) {
  if (price === null || price === undefined)
    return undefined;
  return `₹${price.toFixed(2)}`;
}

function NotFoundBlock() {
  return (
    <section className="mx-auto max-w-3xl rounded-3xl border border-border-subtle bg-surface/50 p-12 text-center shadow-soft backdrop-blur-md">
      <h1 className="text-4xl font-light tracking-tighter text-text-primary font-playfair italic mb-4">Silhouette Lost</h1>
      <p className="text-sm text-text-secondary font-light max-w-sm mx-auto leading-relaxed">The archival masterpiece you seek has either transitioned to a private collection or never existed in this realm.</p>
      <div className="mt-10">
        <Link
          href="/products"
          className="inline-flex h-12 items-center justify-center rounded-full bg-accent px-8 text-[10px] font-bold tracking-[0.2em] uppercase text-white transition-all hover:bg-accent/90 hover:-translate-y-0.5 shadow-soft shadow-accent/20"
        >
          Explore Catalog
        </Link>
      </div>
    </section>
  );
}

async function ReviewsSection({ productId }: { productId: string }) {
  const reviews: Review[] = await getProductReviews(productId);
  const count = reviews.length;
  const avg
    = count > 0 ? ((reviews || []).reduce((s, r) => s + (r?.rating || 0), 0) / count) : 0;

  return (
    <CollapsibleSection
      title={`Editorial Reviews (${count})`}
      className="border-t border-border-subtle pt-6"
      rightMeta={count > 0 && (
        <span className="flex items-center gap-1.5 text-accent">
          <Star className="h-3.5 w-3.5 fill-accent" />
          <span className="text-sm font-bold tracking-tighter text-text-primary">{avg.toFixed(1)}</span>
        </span>
      )}
    >
      {reviews.length === 0
        ? (
            <p className="text-sm text-text-secondary font-light italic">No narratives shared yet.</p>
          )
        : (
            <ul className="space-y-6 pt-4">
              {reviews.slice(0, 10).map(r => (
                <li key={r.id} className="rounded-2xl border border-border-subtle bg-background/30 p-6 transition-all hover:bg-background/50">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold tracking-widest uppercase text-text-primary">{r.author}</p>
                      <p className="text-[9px] text-text-secondary font-light uppercase tracking-tighter mt-0.5">{new Date(r.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</p>
                    </div>
                    <span className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map(i => (
                        <Star key={i} className={`h-3 w-3 ${i <= r.rating ? 'fill-accent text-accent' : 'text-border-subtle'}`} />
                      ))}
                    </span>
                  </div>
                  {r.title && <p className="text-sm font-bold tracking-tight text-text-primary mb-2">{r.title}</p>}
                  {r.content && <p className="text-sm leading-relaxed text-text-secondary font-light">{r.content}</p>}
                </li>
              ))}
            </ul>
          )}
    </CollapsibleSection>
  );
}

async function AlsoLikeSection({ productId }: { productId: string }) {
  const recs: RecommendedProduct[] = await getRecommendedProducts(productId);
  if (!recs.length)
    return null;
  return (
    <section>
      <h2 className="mb-12 text-3xl font-light tracking-tighter text-text-primary font-playfair italic">Parallels</h2>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {recs.map(p => (
          <Card
            key={p.id}
            title={p.title}
            imageSrc={p.imageUrl}
            price={p.price ?? undefined}
            href={`/products/${p.id}`}
            className="group"
          />
        ))}
      </div>
    </section>
  );
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, user] = await Promise.all([
    getStorefrontProduct(id),
    getCurrentUser(),
  ]);

  if (!product) {
    return (
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="py-4 text-caption text-muted-foreground">
          <Link href="/" className="hover:underline">Home</Link>
          {' '}
          /
          <Link href="/products" className="hover:underline">Products</Link>
          {' '}
          /
          {' '}
          <span className="text-foreground">Not found</span>
        </nav>
        <NotFoundBlock />
      </main>
    );
  }

  const { variants, images } = product;

  // Check if wishlisted
  let isWishlisted = false;
  if (user) {
    const wishlistItems = await getWishlistItemsAction();
    isWishlisted = !!wishlistItems?.some(item => item.productId === product.id);
  }

  const galleryVariants: GalleryVariant[] = variants.map((v) => {
    const imgs = images
      .filter(img => img.variantId === v.id)
      .map(img => img.url);

    const fallback = images
      .filter(img => img.variantId === null)
      .sort((a, b) => {
        if (a.isPrimary && !b.isPrimary)
          return -1;
        if (!a.isPrimary && b.isPrimary)
          return 1;
        return (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
      })
      .map(img => img.url);

    return {
      color: v.color?.name || 'Default',
      hexCode: v.color?.hexCode || null,
      images: imgs.length ? imgs : fallback,
    };
  }).filter(gv => gv.images.length > 0);

  const defaultVariant = variants[0];

  const basePrice = defaultVariant ? Number(defaultVariant.price) : null;
  const salePrice = defaultVariant?.salePrice ? Number(defaultVariant.salePrice) : null;

  const displayPrice = salePrice !== null && !Number.isNaN(salePrice) ? salePrice : basePrice;
  const compareAt = salePrice !== null && !Number.isNaN(salePrice) ? basePrice : null;

  const discount
    = compareAt && displayPrice && compareAt > displayPrice
      ? Math.round(((compareAt - displayPrice) / compareAt) * 100)
      : null;

  const subtitle
    = product.gender?.label ? `${product.gender.label}` : undefined;

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 py-10">
      <nav className="pb-10 flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-text-secondary">
        <Link href="/" className="hover:text-accent transition-colors">House</Link>
        <span className="text-border-subtle">/</span>
        <Link href="/products" className="hover:text-accent transition-colors">Catalog</Link>
        <span className="text-border-subtle">/</span>
        <span className="text-accent truncate">{product.name}</span>
      </nav>

      <section className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_480px]">
        {galleryVariants.length > 0 && (
          <div className="relative group">
            <ProductGallery productId={product.id} variants={galleryVariants} className="lg:sticky lg:top-32 rounded-3xl overflow-hidden shadow-soft" />
          </div>
        )}

        <div className="flex flex-col gap-10">
          <header className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              {subtitle && <p className="text-[10px] text-accent font-bold uppercase tracking-[0.3em] mb-1">{subtitle}</p>}
              <h1 className="text-4xl md:text-5xl font-light tracking-tighter text-text-primary font-playfair italic leading-[1.1]">{product.name}</h1>
            </div>

            <div className="flex items-baseline gap-4 mt-2">
              <p className="text-3xl font-light tracking-tighter text-text-primary">{formatPrice(displayPrice)}</p>
              {compareAt && (
                <>
                  <span className="text-lg text-text-secondary line-through font-light opacity-60 tracking-tighter">{formatPrice(compareAt)}</span>
                  {discount !== null && (
                    <span className="text-[10px] font-black tracking-widest uppercase text-accent bg-accent/5 px-2 py-0.5 rounded">
                      -
                      {discount}
                      %
                    </span>
                  )}
                </>
              )}
            </div>
          </header>

          <div className="space-y-8">
            <StockBadge productId={product.id} variants={variants} galleryVariants={galleryVariants} />

            <ProductStateInitializer productId={product.id} variants={variants} galleryVariants={galleryVariants} />

            <div className="space-y-6 py-8 border-y border-border-subtle">
              <ColorSelector productId={product.id} variants={galleryVariants} allVariants={variants} />
              <SizePicker productId={product.id} variants={variants} galleryVariants={galleryVariants} />
            </div>

            <div className="flex flex-col gap-4">
              <AddToBagButton productId={product.id} name={product.name} variants={variants} galleryVariants={galleryVariants} />
              <WishlistButton productId={product.id} initialIsWishlisted={isWishlisted} />
            </div>
          </div>

          <div className="space-y-2">
            <CollapsibleSection title="Aesthetic Narrative" defaultOpen className="border-b border-border-subtle pb-6">
              <p className="text-sm leading-relaxed text-text-secondary font-light italic">{product.description}</p>
            </CollapsibleSection>

            <CollapsibleSection title="Archival Logistics" className="border-b border-border-subtle pb-6">
              <div className="text-sm leading-relaxed text-text-secondary font-light space-y-4 pt-2">
                <p>Complimentary artisanal delivery and global archival tracing on all acquisitions.</p>
                <p>30-day temporal window for returns to our atelier.</p>
              </div>
            </CollapsibleSection>

            <Suspense
              fallback={(
                <CollapsibleSection title="Narratives">
                  <p className="text-[10px] font-bold tracking-widest text-text-secondary uppercase animate-pulse">Tracing echoes...</p>
                </CollapsibleSection>
              )}
            >
              <ReviewsSection productId={product.id} />
            </Suspense>
          </div>
        </div>
      </section>

      <Suspense
        fallback={(
          <section className="mt-24 border-t border-border-subtle pt-20">
            <h2 className="mb-12 text-3xl font-light tracking-tighter text-text-primary font-playfair italic">Parallels</h2>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="aspect-4/5 animate-pulse rounded-3xl bg-surface/50 border border-border-subtle shadow-soft" />
              ))}
            </div>
          </section>
        )}
      >
        <div className="mt-24 border-t border-border-subtle pt-20">
          <AlsoLikeSection productId={product.id} />
        </div>
      </Suspense>
    </main>
  );
}
