import { getCurrentUser } from "@/lib/auth/actions";
import { redirect } from "next/navigation";
import { getProducts } from "@/actions/products";
import { CollectionForm } from "../CollectionForm";
import { Library, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function NewCollectionPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    redirect("/");
  }

  const products = await getProducts();

  return (
    <div className="container mx-auto flex flex-col gap-6 p-4 md:p-6">
      <div className="flex mt-6 items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/collections">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Library className="text-primary h-6 w-6" />
            Create New Collection
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Add a new collection and select products for it.
          </p>
        </div>
      </div>

      <div className="bg-card border rounded-lg p-6 shadow-sm">
        <CollectionForm 
          products={products} 
        />
      </div>
    </div>
  );
}
