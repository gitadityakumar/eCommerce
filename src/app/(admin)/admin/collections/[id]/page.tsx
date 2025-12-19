import { getCurrentUser } from "@/lib/auth/actions";
import { redirect, notFound } from "next/navigation";
import { getProducts } from "@/actions/products";
import { getCollectionById } from "@/actions/collections";
import { CollectionForm, FormValues } from "../CollectionForm";
import { Library, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface EditCollectionPageProps {
  params: {
    id: string;
  };
}

export default async function EditCollectionPage({ params }: EditCollectionPageProps) {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    redirect("/");
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
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/collections">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Library className="text-primary h-6 w-6" />
            Edit Collection
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Update collection details and product associations.
          </p>
        </div>
      </div>

      <div className="bg-card border rounded-lg p-6 shadow-sm max-w-4xl">
        <CollectionForm 
          initialData={collectionRes.data as FormValues & { id: string }} 
          products={products} 
        />
      </div>
    </div>
  );
}
