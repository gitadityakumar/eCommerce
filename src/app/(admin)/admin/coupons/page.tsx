import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { getCoupons } from "@/lib/actions/coupons";
import { CouponTable } from "./CouponTable";

export default async function CouponsPage() {
  const { data: coupons, error } = await getCoupons();

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Coupons</h2>
          <p className="text-muted-foreground text-sm">
            Manage your store&apos;s promotional codes and discounts.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button asChild size="sm">
            <Link href="/admin/coupons/new">
              <Plus className="mr-2 h-4 w-4" />
              Create New Coupon
            </Link>
          </Button>
        </div>
      </div>
      <div className="w-full">
        {error ? (
          <div className="rounded-md bg-destructive/15 p-4 text-destructive text-sm">
            {error}
          </div>
        ) : (
          <CouponTable data={coupons || []} />
        )}
      </div>
    </div>
  );
}
