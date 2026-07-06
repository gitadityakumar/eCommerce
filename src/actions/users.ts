'use server';

import { and, desc, eq, ilike, or } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireAdmin, requireStaff } from '@/lib/auth/guards';
import { db } from '@/lib/db';
import { auditLogs, orders, userRoleEnum, users } from '@/lib/db/schema';

const updateCustomerRoleSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(userRoleEnum.enumValues),
});

const updateCustomerVerificationSchema = z.object({
  userId: z.string().uuid(),
  emailVerified: z.boolean(),
});

async function updateCustomerRecord(
  sessionUserId: string,
  userId: string,
  values: Partial<typeof users.$inferInsert>,
  createAudit: (currentUser: typeof users.$inferSelect) => {
    action: string;
    oldValue: Record<string, unknown>;
    newValue: Record<string, unknown>;
  },
) {
  return db.transaction(async (tx) => {
    const [currentUser] = await tx
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!currentUser)
      throw new Error('User not found');

    const [updatedUser] = await tx
      .update(users)
      .set({ ...values, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();

    const audit = createAudit(currentUser);
    await tx.insert(auditLogs).values({
      adminId: sessionUserId,
      entityType: 'user',
      entityId: userId,
      action: audit.action,
      oldValue: audit.oldValue,
      newValue: audit.newValue,
    });

    return updatedUser;
  });
}

export async function getCustomers(search?: string, role?: string, verified?: boolean) {
  try {
    await requireStaff();
    const filters = [];
    if (search) {
      filters.push(or(ilike(users.name, `%${search}%`), ilike(users.email, `%${search}%`)));
    }
    if (role && role !== 'all') {
      filters.push(eq(users.role, role as z.infer<typeof updateCustomerRoleSchema>['role']));
    }
    if (verified !== undefined) {
      filters.push(eq(users.emailVerified, verified));
    }

    const customers = await db.query.users.findMany({
      where: filters.length > 0 ? and(...filters) : undefined,
      orderBy: [desc(users.createdAt)],
    });

    return customers;
  }
  catch (error) {
    console.error('Error fetching customers:', error);
    return [];
  }
}

export async function getCustomerById(id: string) {
  try {
    await requireStaff();
    const customer = await db.query.users.findFirst({
      where: eq(users.id, id),
      with: {
        addresses: true,
        orders: {
          orderBy: [desc(orders.createdAt)],
        },
        reviews: {
          with: {
            product: true,
          },
        },
        wishlists: {
          with: {
            product: true,
          },
        },
      },
    });

    return customer;
  }
  catch (error) {
    console.error('Error fetching customer by id:', error);
    return null;
  }
}

export async function updateCustomerRole(userId: string, role: z.infer<typeof updateCustomerRoleSchema>['role']) {
  try {
    const user = await requireAdmin();

    const validated = updateCustomerRoleSchema.parse({ userId, role });

    const result = await updateCustomerRecord(user.id, validated.userId, { role: validated.role }, currentUser => ({
      action: 'update_role',
      oldValue: { role: currentUser.role },
      newValue: { role: validated.role },
    }));

    revalidatePath(`/admin/customers/${userId}`);
    revalidatePath('/admin/customers');
    return { success: true, user: result };
  }
  catch (error) {
    console.error('Error updating customer role:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: 'Failed to update customer role' };
  }
}

export async function updateCustomerVerification(userId: string, emailVerified: boolean) {
  try {
    const user = await requireAdmin();

    const validated = updateCustomerVerificationSchema.parse({ userId, emailVerified });

    const result = await updateCustomerRecord(user.id, validated.userId, { emailVerified: validated.emailVerified }, currentUser => ({
      action: 'update_verification',
      oldValue: { emailVerified: currentUser.emailVerified },
      newValue: { emailVerified: validated.emailVerified },
    }));

    revalidatePath(`/admin/customers/${userId}`);
    revalidatePath('/admin/customers');
    return { success: true, user: result };
  }
  catch (error) {
    console.error('Error updating customer verification:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: 'Failed to update customer verification' };
  }
}
