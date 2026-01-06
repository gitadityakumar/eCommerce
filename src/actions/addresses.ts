'use server';

import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/lib/auth/actions';
import { db } from '@/lib/db';
import { addresses, insertAddressSchema } from '@/lib/db/schema/addresses';

export async function getAddresses() {
  const user = await getCurrentUser();
  if (!user)
    return [];

  return await db.query.addresses.findMany({
    where: eq(addresses.userId, user.id),
    orderBy: (addresses, { desc }) => [desc(addresses.isDefault)],
  });
}

export async function createAddress(data: any) {
  const user = await getCurrentUser();
  if (!user)
    return { success: false, error: 'Unauthorized' };

  try {
    const validatedData = insertAddressSchema.parse({
      ...data,
      userId: user.id,
    });

    // If this is the first address or set as default, handle defaults
    if (validatedData.isDefault) {
      await db
        .update(addresses)
        .set({ isDefault: false })
        .where(eq(addresses.userId, user.id));
    }

    await db.insert(addresses).values(validatedData);
    revalidatePath('/profile/addresses');
    return { success: true };
  }
  catch (error: any) {
    console.error('Error creating address:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteAddress(addressId: string) {
  const user = await getCurrentUser();
  if (!user)
    return { success: false, error: 'Unauthorized' };

  try {
    await db
      .delete(addresses)
      .where(and(eq(addresses.id, addressId), eq(addresses.userId, user.id)));

    revalidatePath('/profile/addresses');
    return { success: true };
  }
  catch (error: any) {
    console.error('Error deleting address:', error);
    return { success: false, error: error.message };
  }
}

export async function setDefaultAddress(addressId: string) {
  const user = await getCurrentUser();
  if (!user)
    return { success: false, error: 'Unauthorized' };

  try {
    // Unset all other defaults
    await db
      .update(addresses)
      .set({ isDefault: false })
      .where(eq(addresses.userId, user.id));

    // Set this one as default
    await db
      .update(addresses)
      .set({ isDefault: true })
      .where(and(eq(addresses.id, addressId), eq(addresses.userId, user.id)));

    revalidatePath('/profile/addresses');
    return { success: true };
  }
  catch (error: any) {
    console.error('Error setting default address:', error);
    return { success: false, error: error.message };
  }
}
