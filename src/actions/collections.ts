'use server';

import { eq, sql } from 'drizzle-orm';
import { unstable_noStore as noStore, revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getCurrentUser } from '@/lib/auth/actions';
import { db } from '@/lib/db';
import { auditLogs, collections, productCollections } from '@/lib/db/schema';
import { insertCollectionSchema } from '@/lib/db/schema/collections';

const collectionFormSchema = insertCollectionSchema.extend({
  slug: z.string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug must only contain lowercase letters, numbers, and hyphens'),
  productIds: z.array(z.string().uuid()).optional(),
});

type CollectionFormInput = z.infer<typeof collectionFormSchema>;

function isCollectionSlugConflict(error: unknown) {
  return (error as { code?: string }).code === '23505';
}

async function getAdminCollectionPayload(data: CollectionFormInput) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    return { success: false as const, error: 'Unauthorized. Admin access required.' };
  }

  const validatedFields = collectionFormSchema.safeParse(data);
  if (!validatedFields.success) {
    return { success: false as const, error: validatedFields.error.flatten().fieldErrors };
  }

  const { productIds, ...collectionData } = validatedFields.data;
  return { success: true as const, user, productIds, collectionData };
}

export async function getCollections() {
  noStore();
  try {
    const data = await db.select({
      id: collections.id,
      name: collections.name,
      slug: collections.slug,
      createdAt: collections.createdAt,
      productCount: sql<number>`count(${productCollections.id})::int`,
    })
      .from(collections)
      .leftJoin(productCollections, eq(collections.id, productCollections.collectionId))
      .groupBy(collections.id)
      .orderBy(collections.createdAt);

    return { success: true, data };
  }
  catch (error) {
    console.error('Error fetching collections:', error);
    return { success: false, error: 'Failed to fetch collections' };
  }
}

export async function getCollectionById(id: string) {
  noStore();
  try {
    const collection = await db.query.collections.findFirst({
      where: eq(collections.id, id),
      with: {
        junctions: true,
      },
    });

    if (!collection) {
      return { success: false, error: 'Collection not found' };
    }

    return {
      success: true,
      data: {
        ...collection,
        productIds: collection.junctions.map(j => j.productId),
      },
    };
  }
  catch (error) {
    console.error('Error fetching collection:', error);
    return { success: false, error: 'Failed to fetch collection' };
  }
}

export async function createCollection(data: CollectionFormInput) {
  const payload = await getAdminCollectionPayload(data);
  if (!payload.success)
    return payload;

  const { collectionData, productIds, user } = payload;

  try {
    const result = await db.transaction(async (tx) => {
      // 1. Create Collection
      const [newCollection] = await tx.insert(collections).values(collectionData).returning();

      if (productIds && productIds.length > 0) {
        await tx.insert(productCollections).values(
          productIds.map(productId => ({
            collectionId: newCollection.id,
            productId,
          })),
        );
      }

      // 3. Log the action
      await tx.insert(auditLogs).values({
        adminId: user.id,
        entityType: 'collection',
        entityId: newCollection.id,
        action: 'create',
        newValue: { ...newCollection, productIds },
      });

      return newCollection;
    });

    revalidatePath('/admin/collections');
    return { success: true, data: result };
  }
  catch (error: unknown) {
    if (isCollectionSlugConflict(error)) {
      return { success: false, error: 'A collection with this slug already exists' };
    }
    console.error('Error creating collection:', error);
    return { success: false, error: 'Failed to create collection' };
  }
}

export async function updateCollection(id: string, data: CollectionFormInput) {
  const payload = await getAdminCollectionPayload(data);
  if (!payload.success)
    return payload;

  const { collectionData, productIds, user } = payload;

  try {
    const oldCollection = await db.query.collections.findFirst({
      where: eq(collections.id, id),
      with: {
        junctions: true,
      },
    });

    if (!oldCollection) {
      return { success: false, error: 'Collection not found' };
    }

    const result = await db.transaction(async (tx) => {
      // 1. Update Collection
      const [updatedCollection] = await tx
        .update(collections)
        .set(collectionData)
        .where(eq(collections.id, id))
        .returning();

      await tx.delete(productCollections).where(eq(productCollections.collectionId, id));

      if (productIds && productIds.length > 0) {
        await tx.insert(productCollections).values(
          productIds.map(productId => ({
            collectionId: id,
            productId,
          })),
        );
      }

      // 3. Log the action
      await tx.insert(auditLogs).values({
        adminId: user.id,
        entityType: 'collection',
        entityId: id,
        action: 'update',
        oldValue: { ...oldCollection, productIds: oldCollection.junctions.map(j => j.productId) },
        newValue: { ...updatedCollection, productIds },
      });

      return updatedCollection;
    });

    revalidatePath('/admin/collections');
    return { success: true, data: result };
  }
  catch (error: unknown) {
    if (isCollectionSlugConflict(error)) {
      return { success: false, error: 'A collection with this slug already exists' };
    }
    console.error('Error updating collection:', error);
    return { success: false, error: 'Failed to update collection' };
  }
}

export async function deleteCollection(id: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    return { success: false, error: 'Unauthorized. Admin access required.' };
  }

  try {
    const oldCollection = await db.query.collections.findFirst({
      where: eq(collections.id, id),
      with: {
        junctions: true,
      },
    });

    if (!oldCollection) {
      return { success: false, error: 'Collection not found' };
    }

    await db.transaction(async (tx) => {
      await tx.delete(collections).where(eq(collections.id, id));

      // Log the action
      await tx.insert(auditLogs).values({
        adminId: user.id,
        entityType: 'collection',
        entityId: id,
        action: 'delete',
        oldValue: { ...oldCollection, productIds: oldCollection.junctions.map(j => j.productId) },
      });
    });

    revalidatePath('/admin/collections');
    return { success: true };
  }
  catch (error) {
    console.error('Error deleting collection:', error);
    return { success: false, error: 'Failed to delete collection' };
  }
}
