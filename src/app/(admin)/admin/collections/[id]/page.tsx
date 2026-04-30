import type { FormValues } from '../CollectionForm';
import { notFound, redirect } from 'next/navigation';
import { getCollectionById } from '@/actions/collections';
import { getProducts } from '@/actions/products';
import { CollectionPageHeader } from '@/components/admin/collection-page-header';
import { getCurrentUser } from '@/lib/auth/actions';
import { CollectionForm } from '../CollectionForm';

interface EditCollectionPageProps {
  params: {
    id: string;
  };
}

export default async function EditCollectionPage({ params }: EditCollectionPageProps) {
  const user = await getCurrentUser();

  if (!user || user.role !== 'admin') {
    redirect('/');
  }

  const { id } = params;
  const [products, collectionRes] = await Promise.all([
    getProducts(),
    getCollectionById(id),
  ]);

  if (!collectionRes.success || !collectionRes.data) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <CollectionPageHeader
        title="Edit Collection"
        description="Update collection details and product associations."
      />

      <div className="bg-card border rounded-lg p-6 shadow-sm max-w-4xl">
        <CollectionForm
          initialData={collectionRes.data as FormValues & { id: string }}
          products={products}
        />
      </div>
    </div>
  );
}
