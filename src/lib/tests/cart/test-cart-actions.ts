/* eslint-disable no-console */
import { addToCartAction, clearCartAction, getCartAction, removeFromCartAction, updateCartItemQuantityAction } from '@/lib/actions/storefront-cart';
import { db } from '@/lib/db';

async function testCart() {
  console.log('--- Starting Cart Tests ---');

  try {
    // 1. Clear cart first
    console.log('Clearing cart...');
    await clearCartAction();

    // 2. Add an item
    // We need a valid variant ID. I'll fetch one from the database.
    const variant = await db.query.productVariants.findFirst();
    if (!variant) {
      console.error('No product variants found in database. Please seed the database first.');
      return;
    }

    console.log(`Adding variant ${variant.id} to cart...`);
    await addToCartAction(variant.id, 2);

    // 3. Get cart and verify
    let cart = await getCartAction();
    if (!cart || cart.items.length !== 1 || cart.items[0].quantity !== 2) {
      console.error('Add to cart failed or item/quantity incorrect');
      console.log('Cart state:', JSON.stringify(cart, null, 2));
      return;
    }
    console.log('Add to cart verified.');

    const itemId = cart.items[0].id;

    // 4. Update quantity
    console.log('Updating quantity to 5...');
    await updateCartItemQuantityAction(itemId, 5);
    cart = await getCartAction();
    if (cart?.items[0].quantity !== 5) {
      console.error('Update quantity failed');
      return;
    }
    console.log('Update quantity verified.');

    // 5. Remove item
    console.log('Removing item...');
    await removeFromCartAction(itemId);
    cart = await getCartAction();
    if (cart && cart.items.length !== 0) {
      console.error('Remove item failed');
      return;
    }
    console.log('Remove item verified.');

    console.log('--- All Cart Tests Passed! ---');
  }
  catch (error) {
    console.error('Test failed with error:', error);
  }
}

testCart();
