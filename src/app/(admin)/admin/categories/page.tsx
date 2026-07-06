import { getCategories } from '@/actions/categories';
import { getCurrentUser } from '@/lib/auth/actions';
import { CategoryClient } from './CategoryClient';

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
  const user = await getCurrentUser();
  const result = await getCategories();

  const categories = result.success ? result.data || [] : [];

  return (
    <div className="container mx-auto py-6">
      <CategoryClient canManage={user?.role === 'admin'} initialCategories={categories} />
    </div>
  );
}
