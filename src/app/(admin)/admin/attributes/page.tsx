import { getColors, getGenders, getSizes } from '@/actions/attributes';
import { AttributeDashboard } from './AttributeDashboard';

export const dynamic = 'force-dynamic';

export default async function AttributesPage() {
  const [colorsRes, sizesRes, gendersRes] = await Promise.all([
    getColors(),
    getSizes(),
    getGenders(),
  ]);

  const colors = colorsRes.success ? colorsRes.data || [] : [];
  const sizes = sizesRes.success ? sizesRes.data || [] : [];
  const genders = gendersRes.success ? gendersRes.data || [] : [];

  return (
    <div className="container mx-auto py-6">
      <AttributeDashboard
        initialColors={colors}
        initialSizes={sizes}
        initialGenders={genders}
      />
    </div>
  );
}
