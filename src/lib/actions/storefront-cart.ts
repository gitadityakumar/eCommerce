'use server';

import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { getCurrentUser, guestSession } from '@/lib/auth/actions';
import { db } from '@/lib/db';
import { cartItems, carts, guests } from '@/lib/db/schema/index';

/**
 * Retrieves the current cart ID or creates one if it doesn't exist.
 * Handles both authenticated users and guest sessions.
 */
async function getOrCreateCartId() {
  const user = await getCurrentUser();
  const { sessionToken: guestToken } = await guestSession();

  if (user) {
    // Check if user has a cart
    const existingCart = await db.query.carts.findFirst({
      where: eq(carts.userId, user.id),
    });

    if (existingCart)
      return existingCart.id;

    // Check if user has a guest cart to claim
    const { sessionToken: guestToken } = await guestSession();
    if (guestToken) {
      const guest = await db.query.guests.findFirst({
        where: eq(guests.sessionToken, guestToken),
      });

      if (guest) {
        const guestCart = await db.query.carts.findFirst({
          where: eq(carts.guestId, guest.id),
        });

        if (guestCart) {
          // Claim the guest cart for the user
          await db.update(carts)
            .set({ userId: user.id, guestId: null })
            .where(eq(carts.id, guestCart.id));
          return guestCart.id;
        }
      }
    }

    // Create a new cart for the user
    const [newCart] = await db.insert(carts).values({
      userId: user.id,
    }).returning({ id: carts.id });

    return newCart.id;
  }

  if (guestToken) {
    const guest = await db.query.guests.findFirst({
      where: eq(guests.sessionToken, guestToken),
    });

    if (guest) {
      const existingCart = await db.query.carts.findFirst({
        where: eq(carts.guestId, guest.id),
      });

      if (existingCart)
        return existingCart.id;

      const [newCart] = await db.insert(carts).values({
        guestId: guest.id,
      }).returning({ id: carts.id });

      return newCart.id;
    }
  }

  return null;
}

/**
 * Get the current cart with all items and product details.
 */
export async function getCartAction() {
  const cartId = await getOrCreateCartId();
  if (!cartId)
    return null;

  const cart = await db.query.carts.findFirst({
    where: eq(carts.id, cartId),
    with: {
      items: {
        with: {
          variant: {
            with: {
              product: true,
              color: true,
              size: true,
              images: true,
            },
          },
        },
      },
    },
  });

  return cart;
}

/**
 * Add a product variant to the cart.
 */
export async function addToCartAction(variantId: string, quantity: number = 1) {
  const cartId = await getOrCreateCartId();
  if (!cartId)
    return { success: false, error: 'Could not retrieve or create cart' };

  // Check if item already exists in cart
  const existingItem = await db.query.cartItems.findFirst({
    where: and(
      eq(cartItems.cartId, cartId),
      eq(cartItems.productVariantId, variantId),
    ),
  });

  if (existingItem) {
    await db.update(cartItems)
      .set({ quantity: existingItem.quantity + quantity })
      .where(eq(cartItems.id, existingItem.id));
  }
  else {
    await db.insert(cartItems).values({
      cartId,
      productVariantId: variantId,
      quantity,
    });
  }

  revalidatePath('/cart');
  return { success: true };
}

/**
 * Update the quantity of a cart item.
 */
export async function updateCartItemQuantityAction(itemId: string, quantity: number) {
  if (quantity < 1)
    return removeFromCartAction(itemId);

  await db.update(cartItems)
    .set({ quantity })
    .where(eq(cartItems.id, itemId));

  revalidatePath('/cart');
  return { success: true };
}

/**
 * Remove an item from the cart.
 */
export async function removeFromCartAction(itemId: string) {
  await db.delete(cartItems)
    .where(eq(cartItems.id, itemId));

  revalidatePath('/cart');
  return { success: true };
}

/**
 * Remove all items from the current cart.
 */
export async function clearCartAction() {
  const cartId = await getOrCreateCartId();
  if (!cartId)
    return { success: true };

  await db.delete(cartItems)
    .where(eq(cartItems.id, cartId));

  revalidatePath('/cart');
  return { success: true };
}
