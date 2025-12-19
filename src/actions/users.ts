'use server';

import { db } from "@/lib/db";
import { users, orders, auditLogs, userRoleEnum } from "@/lib/db/schema";
import { eq, or, ilike, desc, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const updateCustomerRoleSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(userRoleEnum.enumValues),
});

const updateCustomerVerificationSchema = z.object({
  userId: z.string().uuid(),
  emailVerified: z.boolean(),
});

export async function getCustomers(search?: string, role?: string, verified?: boolean) {
  try {
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
  } catch (error) {
    console.error("Error fetching customers:", error);
    return [];
  }
}

export async function getCustomerById(id: string) {
  try {
    const customer = await db.query.users.findFirst({
      where: eq(users.id, id),
      with: {
        addresses: true,
        orders: {
          orderBy: [desc(orders.createdAt)],
          limit: 10,
        },
        reviews: {
          with: {
            product: true,
          }
        },
        wishlists: {
          with: {
            product: true,
          }
        },
      },
    });

    return customer;
  } catch (error) {
    console.error("Error fetching customer by id:", error);
    return null;
  }
}

export async function updateCustomerRole(userId: string, role: z.infer<typeof updateCustomerRoleSchema>['role']) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== 'admin') {
      return { success: false, error: "Unauthorized" };
    }

    const validated = updateCustomerRoleSchema.parse({ userId, role });

    const result = await db.transaction(async (tx) => {
      const [currentUser] = await tx
        .select()
        .from(users)
        .where(eq(users.id, validated.userId))
        .limit(1);

      if (!currentUser) throw new Error("User not found");

      const [updatedUser] = await tx
        .update(users)
        .set({ role: validated.role, updatedAt: new Date() })
        .where(eq(users.id, validated.userId))
        .returning();

      await tx.insert(auditLogs).values({
        adminId: session.user.id,
        entityType: 'user',
        entityId: validated.userId,
        action: 'update_role',
        oldValue: { role: currentUser.role },
        newValue: { role: validated.role },
      });

      return updatedUser;
    });

    revalidatePath(`/admin/customers/${userId}`);
    revalidatePath('/admin/customers');
    return { success: true, user: result };
  } catch (error) {
    console.error("Error updating customer role:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: "Failed to update customer role" };
  }
}

export async function updateCustomerVerification(userId: string, emailVerified: boolean) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== 'admin') {
      return { success: false, error: "Unauthorized" };
    }

    const validated = updateCustomerVerificationSchema.parse({ userId, emailVerified });

    const result = await db.transaction(async (tx) => {
      const [currentUser] = await tx
        .select()
        .from(users)
        .where(eq(users.id, validated.userId))
        .limit(1);

      if (!currentUser) throw new Error("User not found");

      const [updatedUser] = await tx
        .update(users)
        .set({ emailVerified: validated.emailVerified, updatedAt: new Date() })
        .where(eq(users.id, validated.userId))
        .returning();

      await tx.insert(auditLogs).values({
        adminId: session.user.id,
        entityType: 'user',
        entityId: validated.userId,
        action: 'update_verification',
        oldValue: { emailVerified: currentUser.emailVerified },
        newValue: { emailVerified: validated.emailVerified },
      });

      return updatedUser;
    });

    revalidatePath(`/admin/customers/${userId}`);
    revalidatePath('/admin/customers');
    return { success: true, user: result };
  } catch (error) {
    console.error("Error updating customer verification:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: "Failed to update customer verification" };
  }
}
