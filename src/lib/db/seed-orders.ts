import { db } from './index';
import { orders, orderItems, addresses, payments, users, productVariants, fulfillments } from './schema';

async function seedOrders() {
  console.log('--- Order Seeding Refinement ---');
  
  // 1. Cleanup existing test data to ensure consistency
  console.log('Cleaning up existing orders, items, payments, and fulfillments...');
  await db.delete(fulfillments);
  await db.delete(payments);
  await db.delete(orderItems);
  await db.delete(orders);

  // 2. Prerequisites
  const userList = await db.select().from(users).limit(1);
  const user = userList[0];
  if (!user) {
    console.error('No users found. Please seed users first.');
    return;
  }

  const variants = await db.select().from(productVariants).limit(10);
  if (variants.length === 0) {
    console.error('No variants found. Please seed products first.');
    return;
  }

  const [addr] = await db.insert(addresses).values({
    userId: user.id,
    type: 'shipping',
    line1: '123 Logical St',
    city: 'Consistency City',
    state: 'CC',
    country: 'Reality',
    postalCode: '12345'
  }).returning();

  // 3. Define Logical Scenarios
  const scenarios = [
    { orderStatus: 'pending', paymentStatus: 'initiated', label: 'New/Abandoned' },
    { orderStatus: 'failed', paymentStatus: 'failed', label: 'Payment Failed' },
    { orderStatus: 'processing', paymentStatus: 'completed', label: 'Paid & Processing' },
    { orderStatus: 'shipped', paymentStatus: 'completed', label: 'Shipped' },
    { orderStatus: 'delivered', paymentStatus: 'completed', label: 'Delivered' },
    { orderStatus: 'cancelled', paymentStatus: 'initiated', label: 'Cancelled' },
  ];

  console.log('Seeding 20 realistic orders...');

  for (let i = 0; i < 20; i++) {
    const scenario = scenarios[i % scenarios.length];
    const total = (Math.random() * 150 + 20).toFixed(2);
    const date = new Date(Date.now() - i * 12 * 60 * 60 * 1000); // Semi-daily intervals

    // Create Order
    const [order] = await db.insert(orders).values({
      userId: user.id,
      status: scenario.orderStatus as 'pending' | 'processing' | 'paid' | 'shipped' | 'delivered' | 'cancelled' | 'refunded' | 'failed',
      totalAmount: total,
      shippingAddressId: addr.id,
      billingAddressId: addr.id,
      createdAt: date,
      updatedAt: date,
    }).returning();

    // Add 1-3 Items
    const numItems = Math.floor(Math.random() * 3) + 1;
    for (let j = 0; j < numItems; j++) {
      const variant = variants[(i + j) % variants.length];
      await db.insert(orderItems).values({
        orderId: order.id,
        productVariantId: variant.id,
        quantity: 1,
        priceAtPurchase: variant.price
      });
    }

    // Add Payment Record
    await db.insert(payments).values({
      orderId: order.id,
      method: (['stripe', 'paypal', 'cod'] as const)[i % 3],
      status: scenario.paymentStatus as 'initiated' | 'completed' | 'failed',
      transactionId: `txn_${Math.random().toString(36).substring(7)}`,
      paidAt: scenario.paymentStatus === 'completed' ? date : null,
    });

    // Add Fulfillment ONLY for shipped/delivered
    if (scenario.orderStatus === 'shipped' || scenario.orderStatus === 'delivered') {
      await db.insert(fulfillments).values({
        orderId: order.id,
        trackingNumber: `TRK${Math.random().toString().substring(2, 10)}`,
        carrier: 'BlueDart',
        status: scenario.orderStatus,
        createdAt: date,
      });
    }
  }

  console.log('Successfully re-seeded 20 orders with consistent logic.');
}

seedOrders().catch(console.error).finally(() => process.exit());
