'use server';

import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import {
  products,
  reviews,
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
