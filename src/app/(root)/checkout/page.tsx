import { redirect } from 'next/navigation';
import { getAddresses } from '@/actions/addresses';
import Checkout from '@/components/checkout/checkout';
import { getCurrentUser } from '@/lib/auth/actions';

export default async function Page() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/sign-in?callbackUrl=/checkout');
  }

  const addresses = await getAddresses();

  return <Checkout initialAddresses={addresses} />;
}
