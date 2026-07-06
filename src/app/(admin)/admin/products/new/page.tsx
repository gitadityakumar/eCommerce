import { redirect } from 'next/navigation';
import {
  getCategories,
  getProductBrands,
  getProductColors,
  getProductGenders,
  getProductSizes,
} from '@/actions/products';
import { getCurrentUser } from '@/lib/auth/actions';
import { ProductForm } from '../ProductForm';

export default async function NewProductPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    redirect('/');
  }

  const [categories, brands, genders, colors, sizes] = await Promise.all([
    getCategories(),
    getProductBrands(),
    getProductGenders(),
    getProductColors(),
    getProductSizes(),
  ]);

  return (
    <div className="py-6">
      <div className="px-4 lg:px-6 mb-6">
        <h1 className="text-2xl font-bold">Add New Product</h1>
      </div>
      <ProductForm
        categories={categories}
        brands={brands}
        genders={genders}
        colors={colors}
        sizes={sizes}
      />
    </div>
  );
}
