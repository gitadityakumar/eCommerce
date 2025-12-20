'use server';

import type { InsertCategory } from '@/lib/db/schema/categories';
import { eq } from 'drizzle-orm';
import { unstable_noStore as noStore, revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/lib/auth/actions';
import { db } from '@/lib/db';
import { auditLogs, categories } from '@/lib/db/schema';
import { insertCategorySchema } from '@/lib/db/schema/categories';

export async function getCategories() {
  noStore();
  try {
    const allCategories = await db.query.categories.findMany();
    return { success: true, data: allCategories };
  }
  catch (error: unknown) {
    console.error('Error fetching categories:', error);
    return { success: false, error: 'Failed to fetch categories' };
  }
}

export async function createCategory(data: InsertCategory) {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: 'Unauthorized. Please log in.' };
  }

  const validatedFields = insertCategorySchema.safeParse(data);

  if (!validatedFields.success) {
    return { success: false, error: validatedFields.error.flatten().fieldErrors };
  }

  try {
    const [newCategory] = await db.insert(categories).values(validatedFields.data).returning();

    // Log the action
    if (user) {
      await db.insert(auditLogs).values({
        adminId: user.id,
        entityType: 'category',
        entityId: newCategory.id,
        action: 'create',
        newValue: newCategory,
      });
    }

    revalidatePath('/admin/categories', 'page');
    return { success: true, data: newCategory };
  }
  catch (error: unknown) {
    const dbError = error as { code?: string };
    if (dbError.code === '23505') {
      return { success: false, error: 'A category with this slug already exists' };
    }
    console.error('Error creating category:', error);
    return { success: false, error: 'Failed to create category' };
  }
}

export async function updateCategory(id: string, data: InsertCategory) {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  const validatedFields = insertCategorySchema.safeParse(data);

  if (!validatedFields.success) {
    return { success: false, error: validatedFields.error.flatten().fieldErrors };
  }

  try {
    const oldCategory = await db.query.categories.findFirst({
      where: eq(categories.id, id),
    });

    if (!oldCategory) {
      return { success: false, error: 'Category not found' };
    }

    const [updatedCategory] = await db
      .update(categories)
      .set(validatedFields.data)
      .where(eq(categories.id, id))
      .returning();

    // Log the action
    await db.insert(auditLogs).values({
      adminId: user.id,
      entityType: 'category',
      entityId: updatedCategory.id,
      action: 'update',
      oldValue: oldCategory,
      newValue: updatedCategory,
    });

    revalidatePath('/admin/categories', 'page');
    return { success: true, data: updatedCategory };
  }
  catch (error: unknown) {
    const dbError = error as { code?: string };
    if (dbError.code === '23505') {
      return { success: false, error: 'A category with this slug already exists' };
    }
    console.error('Error updating category:', error);
    return { success: false, error: 'Failed to update category' };
  }
}

export async function deleteCategory(id: string) {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const oldCategory = await db.query.categories.findFirst({
      where: eq(categories.id, id),
    });

    if (!oldCategory) {
      return { success: false, error: 'Category not found' };
    }

    await db.delete(categories).where(eq(categories.id, id));

    // Log the action
    await db.insert(auditLogs).values({
      adminId: user.id,
      entityType: 'category',
      entityId: id,
      action: 'delete',
      oldValue: oldCategory,
    });

    revalidatePath('/admin/categories', 'page');
    return { success: true };
  }
  catch (error) {
    console.error('Error deleting category:', error);
    return { success: false, error: 'Failed to delete category' };
  }
}
