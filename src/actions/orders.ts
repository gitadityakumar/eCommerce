'use server';

import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { auditLogs, fulfillments, orders, orderStatusEnum } from '@/lib/db/schema';

const updateStatusSchema = z.object({
  orderId: z.string().uuid(),
  status: z.enum(orderStatusEnum.enumValues),
});

const fulfillmentSchema = z.object({
  id: z.string().uuid().optional(),
  orderId: z.string().uuid(),
  trackingNumber: z.string().optional().nullable(),
  carrier: z.string().optional().nullable(),
  status: z.string().default('pending'),
});

export async function getOrders() {
  try {
    const allOrders = await db.query.orders.findMany({
      with: {
        user: true,
        items: true,
        payments: true,
        fulfillments: true,
      },
      orderBy: (orders, { desc }) => [desc(orders.createdAt)],
    });
    return allOrders;
  }
  catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
}

export async function getUserOrders() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return [];
    }

    const userOrders = await db.query.orders.findMany({
      where: eq(orders.userId, session.user.id),
      with: {
        items: {
          with: {
            variant: {
              with: {
                product: {
                  with: {
                    images: true,
                  },
                },
                color: true,
                size: true,
              },
            },
          },
        },
        fulfillments: true,
        payments: true,
      },
      orderBy: (orders, { desc }) => [desc(orders.createdAt)],
    });

    return userOrders;
  }
  catch (error) {
    console.error('Error fetching user orders:', error);
    return [];
  }
}

export async function getOrderById(id: string) {
  try {
    const order = await db.query.orders.findFirst({
      where: eq(orders.id, id),
      with: {
        user: true,
        shippingAddress: true,
        billingAddress: true,
        items: {
          with: {
            variant: {
              with: {
                product: {
                  with: {
                    images: true,
                  },
                },
                color: true,
                size: true,
              },
            },
          },
        },
        payments: true,
        fulfillments: true,
      },
    });

    return order;
  }
  catch (error) {
    console.error('Error fetching order:', error);
    return null;
  }
}

export async function updateOrderStatus(orderId: string, status: (typeof orderStatusEnum.enumValues)[number]) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== 'admin') {
      return { success: false, error: 'Unauthorized' };
    }

    const validated = updateStatusSchema.parse({ orderId, status });

    const result = await db.transaction(async (tx) => {
      // 1. Get current order to log oldValue
      const [currentOrder] = await tx
        .select()
        .from(orders)
        .where(eq(orders.id, validated.orderId))
        .limit(1);

      if (!currentOrder) {
        throw new Error('Order not found');
      }

      // 2. Update order status
      const [updatedOrder] = await tx
        .update(orders)
        .set({
          status: validated.status,
          updatedAt: new Date(),
        })
        .where(eq(orders.id, validated.orderId))
        .returning();

      // 3. Create audit log
      await tx.insert(auditLogs).values({
        adminId: session.user.id,
        entityType: 'order',
        entityId: validated.orderId,
        action: 'update_status',
        oldValue: { status: currentOrder.status },
        newValue: { status: validated.status },
      });

      return updatedOrder;
    });

    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath('/admin/orders');
    return { success: true, order: result };
  }
  catch (error) {
    console.error('Error updating order status:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: 'Failed to update order status' };
  }
}

export async function upsertFulfillment(input: z.infer<typeof fulfillmentSchema>) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== 'admin') {
      return { success: false, error: 'Unauthorized' };
    }

    const validated = fulfillmentSchema.parse(input);

    let result;
    if (validated.id) {
      [result] = await db
        .update(fulfillments)
        .set({
          trackingNumber: validated.trackingNumber,
          carrier: validated.carrier,
          status: validated.status,
          updatedAt: new Date(),
        })
        .where(eq(fulfillments.id, validated.id))
        .returning();
    }
    else {
      [result] = await db
        .insert(fulfillments)
        .values({
          orderId: validated.orderId,
          trackingNumber: validated.trackingNumber,
          carrier: validated.carrier,
          status: validated.status,
        })
        .returning();
    }

    revalidatePath(`/admin/orders/${validated.orderId}`);
    return { success: true, fulfillment: result };
  }
  catch (error) {
    console.error('Error upserting fulfillment:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: 'Failed to manage fulfillment' };
  }
}
