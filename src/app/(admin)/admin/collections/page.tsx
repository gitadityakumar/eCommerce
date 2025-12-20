import { redirect } from 'next/navigation';
import { getCollections } from '@/actions/collections';
import { getProducts } from '@/actions/products';
import { getCurrentUser } from '@/lib/auth/actions';
import { CollectionClient } from './CollectionClient';

export default async function CollectionsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    redirect('/');
  }

  const [collectionsRes, products] = await Promise.all([
    getCollections(),
    getProducts(),
  ]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <CollectionClient
        initialCollections={collectionsRes.success ? collectionsRes.data || [] : []}
        products={products.map(p => ({ id: p.id, name: p.name }))}
      />
    </div>
  );
}
