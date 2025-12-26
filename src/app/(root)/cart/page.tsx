import { CartPageUI } from '@/components/cart/CartPageUI';
import { getCartAction } from '@/lib/actions/storefront-cart';

export const dynamic = 'force-dynamic';

export default async function CartPage() {
  const cart = await getCartAction();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <CartPageUI cart={cart} />
    </div>
  );
}
