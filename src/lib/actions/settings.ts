'use server';

import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { storeSettings } from '@/lib/db/schema';

export async function getStoreSettings() {
  try {
    const [settings] = await db.select().from(storeSettings).limit(1);
    return settings || null;
  }
  catch (error) {
    console.error('[getStoreSettings] Error:', error);
    return null;
  }
}

export async function updateStoreSettings(data: Partial<typeof storeSettings.$inferInsert>) {
  try {
    const existing = await getStoreSettings();

    if (existing) {
      await db
        .update(storeSettings)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(storeSettings.id, existing.id));
    }
    else {
      await db.insert(storeSettings).values(data as any);
    }

    revalidatePath('/admin/settings');
    revalidatePath('/checkout');

    return { success: true };
  }
  catch (error) {
    console.error('[updateStoreSettings] Error:', error);
    return { success: false, error: 'Failed to update store settings' };
  }
}
