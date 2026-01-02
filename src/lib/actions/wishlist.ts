'use server';

import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/lib/auth/actions';
import { db } from '@/lib/db';
import { wishlists } from '@/lib/db/schema';

/**
 * Get all items in the current user's wishlist.
 */
export async function getWishlistItemsAction() {
  const user = await getCurrentUser();
  if (!user)
    return null;

  try {
    const items = await db.query.wishlists.findMany({
      where: eq(wishlists.userId, user.id),
      with: {
        product: {
          with: {
            images: {
              where: (images, { eq }) => eq(images.isPrimary, true),
              limit: 1,
            },
            variants: true,
          },
        },
      },
      orderBy: (wishlists, { desc }) => [desc(wishlists.addedAt)],
    });

    return items;
  }
  catch (error) {
    console.error('[getWishlistItemsAction] Error fetching wishlist:', error);
    return [];
  }
}

/**
 * Toggle a product in the user's wishlist.
 * Adds if it doesn't exist, removes if it does.
 */
export async function toggleWishlistAction(productId: string) {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: 'User must be logged in' };
  }

  try {
    const existing = await db.query.wishlists.findFirst({
      where: and(
        eq(wishlists.userId, user.id),
        eq(wishlists.productId, productId),
      ),
    });

    if (existing) {
      await db.delete(wishlists).where(eq(wishlists.id, existing.id));
      revalidatePath('/wishlist');
      revalidatePath(`/products/${productId}`);
      return { success: true, action: 'removed' };
    }
    else {
      await db.insert(wishlists).values({
        userId: user.id,
        productId,
      });
      revalidatePath('/wishlist');
      revalidatePath(`/products/${productId}`);
      return { success: true, action: 'added' };
    }
  }
  catch (error) {
    console.error('[toggleWishlistAction] Error toggling wishlist:', error);
    return { success: false, error: 'Database error' };
  }
}

/**
 * Remove an item from the wishlist by wishlist entry ID.
 */
export async function removeFromWishlistAction(wishlistId: string) {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: 'User must be logged in' };
  }

  try {
    const [removed] = await db.delete(wishlists)
      .where(and(
        eq(wishlists.id, wishlistId),
        eq(wishlists.userId, user.id),
      ))
      .returning();

    if (removed) {
      revalidatePath('/wishlist');
      revalidatePath(`/products/${removed.productId}`);
    }

    return { success: true };
  }
  catch (error) {
    console.error('[removeFromWishlistAction] Error removing from wishlist:', error);
    return { success: false, error: 'Database error' };
  }
}
