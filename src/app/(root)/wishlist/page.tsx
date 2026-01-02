import { redirect } from 'next/navigation';
import { WishlistPageUI } from '@/components/wishlist/WishlistPageUI';
import { getWishlistItemsAction } from '@/lib/actions/wishlist';
import { getCurrentUser } from '@/lib/auth/actions';

export const dynamic = 'force-dynamic';

export default async function WishlistPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/sign-in?callbackUrl=/wishlist');
  }

  const items = await getWishlistItemsAction();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <WishlistPageUI items={items} />
    </div>
  );
}
