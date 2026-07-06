'use server';

import { eq, sql } from 'drizzle-orm';
import { unstable_noStore as noStore } from 'next/cache';
import { db } from '@/lib/db';
import {
  brands,
  categories,
  collections,
  colors,
  genders,
  inventoryLevels,
  productCollections,
  productImages,
  products,
  productVariants,
  reviews,
  sizes,
} from '@/lib/db/schema';
import { normalizeImageUrl } from '@/lib/images';

export async function getStorefrontCollections() {
  noStore();

  try {
    const data = await db.select({
      id: collections.id,
      name: collections.name,
      slug: collections.slug,
      createdAt: collections.createdAt,
      productCount: sql<number>`count(${productCollections.id})::int`,
    })
      .from(collections)
      .leftJoin(productCollections, eq(collections.id, productCollections.collectionId))
      .groupBy(collections.id)
      .orderBy(collections.createdAt);

    return { success: true, data };
  }
  catch (error) {
    console.error('[getStorefrontCollections] Error fetching collections:', error);
    return { success: false, error: 'Failed to fetch collections' };
  }
}

export async function getStorefrontProduct(productId: string) {
  try {
    // Fetch the base product
    const [product] = await db.select().from(products).where(eq(products.id, productId)).limit(1);

    if (!product) {
      return null;
    }

    // Fetch related data separately to avoid complex join issues
    const [category, brand, gender, images, variants, productReviews] = await Promise.all([
      product.categoryId
        ? db.select().from(categories).where(eq(categories.id, product.categoryId)).limit(1).then(rows => rows[0] || null)
        : Promise.resolve(null),
      product.brandId
        ? db.select().from(brands).where(eq(brands.id, product.brandId)).limit(1).then(rows => rows[0] || null)
        : Promise.resolve(null),
      product.genderId
        ? db.select().from(genders).where(eq(genders.id, product.genderId)).limit(1).then(rows => rows[0] || null)
        : Promise.resolve(null),
      db.select().from(productImages).where(eq(productImages.productId, productId)).orderBy(productImages.sortOrder),
      db.select().from(productVariants).where(eq(productVariants.productId, productId)),
      db.select().from(reviews).where(eq(reviews.productId, productId)),
    ]);

    // Fetch variant-related data
    const variantsWithDetails = await Promise.all(
      variants.map(async (variant) => {
        const [size, color, inventory] = await Promise.all([
          variant.sizeId
            ? db.select().from(sizes).where(eq(sizes.id, variant.sizeId)).limit(1).then(rows => rows[0] || null)
            : Promise.resolve(null),
          variant.colorId
            ? db.select().from(colors).where(eq(colors.id, variant.colorId)).limit(1).then(rows => rows[0] || null)
            : Promise.resolve(null),
          db.select().from(inventoryLevels).where(eq(inventoryLevels.variantId, variant.id)).limit(1).then(rows => rows[0] || null),
        ]);

        return {
          ...variant,
          size,
          color,
          inventory,
        };
      }),
    );

    return {
      ...product,
      category,
      brand,
      gender,
      images: images.map(image => ({
        ...image,
        url: normalizeImageUrl(image.url) ?? image.url,
      })),
      variants: variantsWithDetails,
      reviews: productReviews,
    };
  }
  catch (error) {
    console.error('[getStorefrontProduct] Error fetching product:', error);
    return null;
  }
}

export async function getFilterOptions() {
  try {
    const [fetchedGenders, fetchedSizes, fetchedColors] = await Promise.all([
      db.select().from(genders),
      db.select().from(sizes).orderBy(sizes.sortOrder),
      db.select().from(colors),
    ]);

    return {
      genders: fetchedGenders,
      sizes: fetchedSizes,
      colors: fetchedColors,
    };
  }
  catch (error) {
    console.error('[getFilterOptions] Error fetching filter options:', error);
    return {
      genders: [],
      sizes: [],
      colors: [],
    };
  }
}
