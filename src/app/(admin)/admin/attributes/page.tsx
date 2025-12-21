import { getBrands, getColors, getGenders, getSizes } from '@/actions/attributes';
import { AttributeDashboard } from './AttributeDashboard';

export const dynamic = 'force-dynamic';

export default async function AttributesPage() {
  const [colorsRes, sizesRes, gendersRes, brandsRes] = await Promise.all([
    getColors(),
    getSizes(),
    getGenders(),
    getBrands(),
  ]);

  const colors = colorsRes.success ? colorsRes.data || [] : [];
  const sizes = sizesRes.success ? sizesRes.data || [] : [];
  const genders = gendersRes.success ? gendersRes.data || [] : [];
  const brands = brandsRes.success ? brandsRes.data || [] : [];

  return (
    <div className="container mx-auto py-6">
      <AttributeDashboard
        initialColors={colors}
        initialSizes={sizes}
        initialGenders={genders}
        initialBrands={brands}
      />
    </div>
  );
}
