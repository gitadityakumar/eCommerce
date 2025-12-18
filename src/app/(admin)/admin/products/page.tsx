import { getProducts } from "@/actions/products"
import { ProductTable } from "./ProductTable"

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <div className="py-6">
      <ProductTable data={products} />
    </div>
  )
}
