'use server';

import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import {
  colors,
  genders,
  products,
  reviews,
  sizes,
} from '@/lib/db/schema';

export async function getStorefrontProduct(productId: string) {
  try {
    const product = await db.query.products.findFirst({
      where: eq(products.id, productId),
      with: {
        category: true,
        brand: true,
        gender: true,
        images: {
          orderBy: (images, { asc }) => [asc(images.sortOrder)],
        },
        variants: {
          with: {
            size: true,
            color: true,
            inventory: true,
          },
        },
      },
    });

    if (!product) {
      return null;
    }

    // Fetch reviews separately to avoid potential join issues if any
    const productReviews = await db
      .select()
      .from(reviews)
      .where(eq(reviews.productId, productId));

    return {
      ...product,
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
