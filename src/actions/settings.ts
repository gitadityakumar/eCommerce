'use server';

import { db } from '@/lib/db';

export async function getStoreSettings() {
  try {
    const settings = await db.query.storeSettings.findFirst();
    return settings || null;
  }
  catch (error) {
    console.error('Error fetching store settings:', error);
    return null;
  }
}
