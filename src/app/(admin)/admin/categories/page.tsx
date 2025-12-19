import { getCategories } from "@/actions/categories";
import { CategoryClient } from "./CategoryClient";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const result = await getCategories();
  
  const categories = result.success ? result.data || [] : [];

  return (
    <div className="container mx-auto py-6">
      <CategoryClient initialCategories={categories} />
    </div>
  );
}
