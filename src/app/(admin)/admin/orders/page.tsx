import { getOrders } from "@/actions/orders";
import { OrdersTable } from "@/components/admin/orders/OrdersTable";

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <div className="flex flex-col gap-6 p-6 w-full h-full bg-slate-50/50 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
      </div>
      <OrdersTable orders={orders} />
    </div>
  );
}
