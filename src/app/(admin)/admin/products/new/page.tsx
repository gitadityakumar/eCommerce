import { getCategories, getBrands, getGenders, getColors, getSizes } from "@/actions/products"
import { ProductForm } from "../ProductForm"

export default async function NewProductPage() {
  const [categories, brands, genders, colors, sizes] = await Promise.all([
    getCategories(),
    getBrands(),
    getGenders(),
    getColors(),
    getSizes(),
  ])

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
  )
}
