import { getOrders } from '@/actions/orders';
import { OrdersTable } from '@/components/admin/orders/OrdersTable';

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <div className="flex flex-col gap-10 p-10 w-full h-full bg-background min-h-screen">
      <div className="flex flex-col gap-2">
        <h1 className="text-5xl font-light tracking-tighter text-text-primary font-playfair italic">Order Archives</h1>
        <p className="text-sm text-text-secondary font-light tracking-tight italic">Trace the luxury journey of every acquisition from inception to delivery.</p>
      </div>
      <OrdersTable orders={orders} />
    </div>
  );
}
