'use server';

import { db } from "@/lib/db";
import { inventoryLevels, stockLedger, auditLogs } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

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
      return { success: false, error: "Unauthorized" };
    }

    const validated = adjustStockSchema.parse(input);

    const result = await db.transaction(async (tx) => {
      // 1. Get current inventory level
      const [currentLevel] = await tx
        .select()
        .from(inventoryLevels)
        .where(eq(inventoryLevels.variantId, validated.variantId))
        .limit(1);

      if (!currentLevel) {
        throw new Error("Inventory record not found for this variant");
      }

      // 2. Update inventory level (Available stock)
      const [updatedLevel] = await tx
        .update(inventoryLevels)
        .set({
          available: sql`${inventoryLevels.available} + ${validated.amount}`,
          updatedAt: new Date(),
        })
        .where(eq(inventoryLevels.variantId, validated.variantId))
        .returning();

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
        oldValue: { available: currentLevel.available },
        newValue: { available: updatedLevel.available, reason: validated.reason },
      });

      return updatedLevel;
    });

    revalidatePath('/admin/inventory');
    revalidatePath('/admin/products');
    return { success: true, inventory: result };
  } catch (error) {
    console.error("Error adjusting stock:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: error instanceof Error ? error.message : "Failed to adjust stock" };
  }
}

export async function getInventory() {
  try {
    const inventory = await db.query.inventoryLevels.findMany({
      with: {
        variant: {
          with: {
            product: true,
            color: true,
            size: true,
          }
        }
      }
    });

    return inventory;
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return [];
  }
}
