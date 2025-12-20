/* eslint-disable no-console */
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { db } from './index';
import {
  auditLogs,
  cartItems,
  carts,
  guests,
  inventoryLevels,
  orderItems,
  orders,
  payments,
  productVariants,
  sessions,
  users,
} from './schema';

async function seedDashboard() {
  console.log('--- Dashboard Data Seeding ---');

  // 1. Get existing data
  const userList = await db.select().from(users).where(eq(users.role, 'customer')).limit(10);
  const adminList = await db.select().from(users).where(eq(users.role, 'admin')).limit(2);
  const variants = await db.select().from(productVariants).limit(20);

  if (userList.length === 0 || variants.length === 0) {
    console.error('Prerequisites missing: Seed users and products first.');
    return;
  }

  const adminId = adminList[0]?.id || userList[0].id;

  console.log('Seeding historical orders for the last 30 days...');
  for (let i = 0; i < 60; i++) {
    const user = userList[Math.floor(Math.random() * userList.length)];
    const daysAgo = Math.floor(Math.random() * 30);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);

    const statuses = ['delivered', 'shipped', 'processing', 'paid', 'pending'];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const amount = (Math.random() * 5000 + 500).toFixed(2);

    const [order] = await db.insert(orders).values({
      userId: user.id,
      status: status as 'pending' | 'processing' | 'paid' | 'shipped' | 'delivered' | 'cancelled' | 'refunded' | 'failed',
      totalAmount: amount,
      createdAt: date,
      updatedAt: date,
    }).returning();

    // Add items
    const numItems = Math.floor(Math.random() * 3) + 1;
    for (let j = 0; j < numItems; j++) {
      const variant = variants[Math.floor(Math.random() * variants.length)];
      await db.insert(orderItems).values({
        orderId: order.id,
        productVariantId: variant.id,
        quantity: Math.floor(Math.random() * 2) + 1,
        priceAtPurchase: variant.price,
      });
    }

    // Add payment
    await db.insert(payments).values({
      orderId: order.id,
      method: 'stripe',
      status: (status === 'delivered' || status === 'shipped' || status === 'paid') ? 'completed' : 'initiated',
      transactionId: `txn_${uuidv4().substring(0, 8)}`,
      paidAt: (status === 'delivered' || status === 'shipped' || status === 'paid') ? date : null,
    });
  }

  console.log('Seeding active sessions and guests...');
  const now = new Date();
  const future = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  for (let i = 0; i < 15; i++) {
    const user = userList[Math.floor(Math.random() * userList.length)];
    await db.insert(sessions).values({
      id: uuidv4(),
      userId: user.id,
      token: uuidv4(),
      expiresAt: future,
      createdAt: now,
    });
  }

  for (let i = 0; i < 25; i++) {
    await db.insert(guests).values({
      sessionToken: uuidv4(),
      expiresAt: future,
      createdAt: now,
    });
  }

  console.log('Seeding audit logs...');
  const entities = ['product', 'order', 'coupon', 'category'];
  const actions = ['create', 'update', 'delete'];

  for (let i = 0; i < 10; i++) {
    const date = new Date();
    date.setMinutes(date.getMinutes() - i * 30);

    await db.insert(auditLogs).values({
      adminId,
      entityType: entities[Math.floor(Math.random() * entities.length)],
      entityId: uuidv4(),
      action: actions[Math.floor(Math.random() * actions.length)],
      createdAt: date,
    });
  }

  console.log('Ensuring low stock items...');
  for (let i = 0; i < 5; i++) {
    const variant = variants[i];
    await db.insert(inventoryLevels).values({
      variantId: variant.id,
      available: Math.floor(Math.random() * 5),
      updatedAt: new Date(),
    }).onConflictDoUpdate({
      target: inventoryLevels.variantId,
      set: { available: Math.floor(Math.random() * 5) },
    });
  }

  console.log('Seeding active carts...');
  for (let i = 0; i < 10; i++) {
    const user = userList[i % userList.length];
    const [cart] = await db.insert(carts).values({
      userId: user.id,
    }).returning();

    await db.insert(cartItems).values({
      cartId: cart.id,
      productVariantId: variants[Math.floor(Math.random() * variants.length)].id,
      quantity: 1,
    });
  }

  console.log('Dashboard seeding completed successfully.');
}

seedDashboard().catch(console.error).finally(() => process.exit());
