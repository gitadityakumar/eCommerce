'use server';

import { eq, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { auditLogs, inventoryLevels, stockLedger } from '@/lib/db/schema';

const adjustStockSchema = z.object({
  variantId: z.string().uuid(),
  amount: z.number().int(),
  reason: z.enum(['sale', 'return', 'manual_adjustment', 'damage', 'restock']),
  referenceType: z.string().optional(),
  referenceId: z.string().uuid().optional(),
});

export async function adjustStock(input: z.infer<typeof adjustStockSchema>) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== 'admin') {
      return { success: false, error: 'Unauthorized' };
    }

    const validated = adjustStockSchema.parse(input);

    const result = await db.transaction(async (tx) => {
      // 1. Get current inventory level (if exists)
      const [currentLevel] = await tx
        .select()
        .from(inventoryLevels)
        .where(eq(inventoryLevels.variantId, validated.variantId))
        .limit(1);

      const oldAvailable = currentLevel?.available ?? 0;

      // 2. Upsert inventory level
      let updatedLevel;
      if (currentLevel) {
        [updatedLevel] = await tx
          .update(inventoryLevels)
          .set({
            available: sql`${inventoryLevels.available} + ${validated.amount}`,
            updatedAt: new Date(),
          })
          .where(eq(inventoryLevels.variantId, validated.variantId))
          .returning();
      }
      else {
        [updatedLevel] = await tx
          .insert(inventoryLevels)
          .values({
            variantId: validated.variantId,
            available: validated.amount,
            reserved: 0,
            updatedAt: new Date(),
          })
          .returning();
      }

      // 3. Create Stock Ledger entry
      await tx.insert(stockLedger).values({
        variantId: validated.variantId,
        changeAmount: validated.amount,
        reason: validated.reason,
        referenceType: validated.referenceType || 'manual_adjustment',
        referenceId: validated.referenceId,
      });

      // 4. Log in Audit Logs
      await tx.insert(auditLogs).values({
        adminId: session.user.id,
        entityType: 'inventory',
        entityId: validated.variantId,
        action: 'adjust_stock',
        oldValue: { available: oldAvailable },
        newValue: { available: updatedLevel.available, reason: validated.reason },
      });

      return updatedLevel;
    });

    revalidatePath('/admin/inventory');
    revalidatePath('/admin/products');
    return { success: true, inventory: result };
  }
  catch (error) {
    console.error('Error adjusting stock:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: error instanceof Error ? error.message : 'Failed to adjust stock' };
  }
}

export async function getInventory() {
  try {
    const variants = await db.query.productVariants.findMany({
      with: {
        product: {
          with: {
            images: true,
          },
        },
        color: true,
        size: true,
        inventory: true,
        images: true,
      },
    });

    return variants.map(v => ({
      variantId: v.id,
      available: v.inventory?.available ?? 0,
      reserved: v.inventory?.reserved ?? 0,
      updatedAt: v.inventory?.updatedAt ?? v.createdAt,
      variant: {
        ...v,
        product: v.product,
        color: v.color,
        size: v.size,
      },
    }));
  }
  catch (error) {
    console.error('Error fetching inventory:', error);
    return [];
  }
}
