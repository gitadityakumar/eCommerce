import { redirect } from 'next/navigation';
import { getProducts } from '@/actions/products';
import { CollectionPageHeader } from '@/components/admin/collection-page-header';
import { getCurrentUser } from '@/lib/auth/actions';
import { CollectionForm } from '../CollectionForm';

export const dynamic = 'force-dynamic';

export default async function NewCollectionPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== 'admin') {
    redirect('/');
  }

  const products = await getProducts();

  return (
    <div className="container mx-auto flex flex-col gap-6 p-4 md:p-6">
      <CollectionPageHeader
        title="Create New Collection"
        description="Add a new collection and select products for it."
        className="flex mt-6 items-center gap-4"
      />

      <div className="bg-card border rounded-lg p-6 shadow-sm">
        <CollectionForm
          products={products}
        />
      </div>
    </div>
  );
}
