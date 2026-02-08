import { Card } from '@/components';
import Filters from '@/components/Filters';
import Sort from '@/components/Sort';
import { getAllProducts } from '@/lib/actions/product';
import { getFilterOptions } from '@/lib/actions/storefront';
import { parseFilterParams } from '@/lib/utils/query';

type SearchParams = Record<string, string | string[] | undefined>;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;

  const parsed = parseFilterParams(sp);
  const [{ products, totalCount }, filterOptions] = await Promise.all([
    getAllProducts(parsed),
    getFilterOptions(),
  ]);

  const activeBadges: string[] = [];
  (sp.gender ? (Array.isArray(sp.gender) ? sp.gender : [sp.gender]) : []).forEach(g =>
    activeBadges.push(String(g)[0].toUpperCase() + String(g).slice(1)),
  );
  (sp.size ? (Array.isArray(sp.size) ? sp.size : [sp.size]) : []).forEach(s => activeBadges.push(`Size: ${s}`));
  (sp.color ? (Array.isArray(sp.color) ? sp.color : [sp.color]) : []).forEach(c =>
    activeBadges.push(String(c)[0].toUpperCase() + String(c).slice(1)),
  );
  (sp.price ? (Array.isArray(sp.price) ? sp.price : [sp.price]) : []).forEach((p) => {
    const [min, max] = String(p).split('-');
    const label = min && max ? `₹${min} - ₹${max}` : min && !max ? `Over ₹${min}` : `₹0 - ₹${max}`;
    activeBadges.push(label);
  });

  if (parsed.search) {
    activeBadges.push(`Search: ${parsed.search}`);
  }

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 min-h-screen bg-background transition-colors duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12 border-b border-border-subtle pb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-light text-text-primary tracking-tight">
            The Collection
          </h1>
          <p className="text-text-secondary mt-2 font-light">
            {totalCount}
            {' '}
            pieces curated for the modern silhouette.
          </p>
        </div>
        <Sort />
      </header>

      {activeBadges.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {activeBadges.map((b, i) => (
            <span
              key={`${b}-${i}`}
              className="rounded-full border border-border-subtle bg-surface px-4 py-1 text-xs tracking-wider text-text-primary shadow-soft"
            >
              {b}
            </span>
          ))}
        </div>
      )}

      <section className="grid grid-cols-1 gap-12 md:grid-cols-[280px_1fr]">
        <Filters
          genders={filterOptions.genders}
          sizes={filterOptions.sizes}
          colors={filterOptions.colors}
        />
        <div className="space-y-12">
          {products.length === 0
            ? (
                <div className="rounded-2xl border border-dashed border-border-subtle p-20 text-center bg-surface/50">
                  <p className="text-lg text-text-secondary font-light italic">The search yields no results. Try adjusting your filters.</p>
                </div>
              )
            : (
                <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                  {products.map((p) => {
                    const price
                      = p.minPrice !== null && p.maxPrice !== null && p.minPrice !== p.maxPrice
                        ? `₹${p.minPrice.toFixed(0)} - ₹${p.maxPrice.toFixed(0)}`
                        : p.minPrice !== null
                          ? p.minPrice
                          : undefined;
                    return (
                      <Card
                        key={p.id}
                        title={p.name}
                        subtitle={p.subtitle ?? undefined}
                        imageSrc={p.imageUrl ?? '/shoes/shoe-1.jpg'}
                        price={price}
                        href={`/products/${p.id}`}
                      />
                    );
                  })}
                </div>
              )}
        </div>
      </section>
    </main>
  );
}
