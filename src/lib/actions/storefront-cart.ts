'use server';

import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/lib/auth/actions';
import { db } from '@/lib/db';
import { cartItems, carts } from '@/lib/db/schema/index';

/**
 * Retrieves the current cart ID or creates one if it doesn't exist.
 * ONLY for authenticated users.
 */
async function getOrCreateCartId() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  // Check if user has a cart
  const existingCart = await db.query.carts.findFirst({
    where: eq(carts.userId, user.id),
  });

  if (existingCart)
    return existingCart.id;

  // Create a new cart for the user
  const [newCart] = await db.insert(carts).values({
    userId: user.id,
  }).returning({ id: carts.id });

  return newCart.id;
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
              product: {
                with: {
                  images: true,
                },
              },
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
 * Get the total quantity of items in the authenticated user's cart.
 */
export async function getCartCountAction() {
  const cartId = await getOrCreateCartId();
  if (!cartId)
    return 0;

  const items = await db.query.cartItems.findMany({
    where: eq(cartItems.cartId, cartId),
  });

  return items.reduce((acc, item) => acc + item.quantity, 0);
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
  const count = await getCartCountAction();
  return { success: true, count };
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
  const count = await getCartCountAction();
  return { success: true, count };
}

/**
 * Remove an item from the cart.
 */
export async function removeFromCartAction(itemId: string) {
  await db.delete(cartItems)
    .where(eq(cartItems.id, itemId));

  revalidatePath('/cart');
  const count = await getCartCountAction();
  return { success: true, count };
}

/**
 * Remove all items from the current cart.
 */
export async function clearCartAction() {
  const cartId = await getOrCreateCartId();
  if (!cartId)
    return { success: true, count: 0 };

  await db.delete(cartItems)
    .where(eq(cartItems.cartId, cartId));

  revalidatePath('/cart');
  return { success: true, count: 0 };
}
