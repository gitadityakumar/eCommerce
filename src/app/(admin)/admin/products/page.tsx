import { getProducts } from '@/actions/products';
import { getCurrentUser } from '@/lib/auth/actions';
import { ProductTable } from './ProductTable';

export default async function ProductsPage() {
  const user = await getCurrentUser();
  const products = await getProducts();

  return (
    <div className="py-6">
      <ProductTable canManage={user?.role === 'admin'} data={products} />
    </div>
  );
}
