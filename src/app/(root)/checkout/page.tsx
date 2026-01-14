import { redirect } from 'next/navigation';
import { getAddresses } from '@/actions/addresses';
import Checkout from '@/components/checkout/checkout';
import { getStoreSettings } from '@/lib/actions/settings';
import { getCartAction } from '@/lib/actions/storefront-cart';
import { getCurrentUser } from '@/lib/auth/actions';

export default async function Page() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/sign-in?callbackUrl=/checkout');
  }

  const [addresses, settings, cart] = await Promise.all([
    getAddresses(),
    getStoreSettings(),
    getCartAction(),
  ]);

  return <Checkout initialAddresses={addresses} storeSettings={settings} user={user} serverCart={cart} />;
}
