import { CouponForm } from "../CouponForm";

export const metadata = {
  title: "Create New Coupon | Admin Panel",
  description: "Create and manage store discounts and promotions.",
};

export default function CreateCouponPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Add New Coupon</h2>
      </div>
      <div className="grid gap-4">
        <CouponForm />
      </div>
    </div>
  );
}
