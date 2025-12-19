import { getCustomerById } from "@/actions/users";
import { notFound } from "next/navigation";
import { CustomerProfileHeader } from "@/components/admin/customers/CustomerProfileHeader";
import { CustomerAddressCard } from "@/components/admin/customers/CustomerAddressCard";
import { CustomerActivityTabs } from "@/components/admin/customers/CustomerActivityTabs";
import { CustomerManagementControls } from "@/components/admin/customers/CustomerManagementControls";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

interface CustomerDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CustomerDetailsPage({ params }: CustomerDetailsPageProps) {
  const { id } = await params;
  const customer = await getCustomerById(id);

  if (!customer) {
    notFound();
  }

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/customers">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Customer Details</h2>
          <p className="text-muted-foreground">Detailed view and management for {customer.name || customer.email}</p>
        </div>
      </div>

      <CustomerProfileHeader user={{
        name: customer.name,
        email: customer.email,
        image: customer.image,
        role: customer.role as 'customer' | 'staff' | 'admin'
      }} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <CustomerActivityTabs 
            orders={customer.orders} 
            reviews={customer.reviews} 
            wishlist={customer.wishlists} 
          />
        </div>
        <div className="space-y-8">
          <CustomerManagementControls 
            userId={customer.id} 
            initialRole={customer.role} 
            initialVerified={customer.emailVerified} 
          />
          <CustomerAddressCard addresses={customer.addresses} />
        </div>
      </div>
    </div>
  );
}
