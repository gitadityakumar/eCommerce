import { db } from "@/lib/db";
import { auditLogs, users } from "@/lib/db/schema";
import { eq, desc, and } from "drizzle-orm";

export async function getAuditLogs(params?: { entityType?: string; action?: string; limit?: number }) {
  try {
    const filters = [];
    if (params?.entityType && params?.entityType !== 'all') {
      filters.push(eq(auditLogs.entityType, params.entityType));
    }
    if (params?.action && params?.action !== 'all') {
      filters.push(eq(auditLogs.action, params.action));
    }

    const logs = await db
      .select({
        id: auditLogs.id,
        adminName: users.name,
        adminId: auditLogs.adminId,
        entityType: auditLogs.entityType,
        entityId: auditLogs.entityId,
        action: auditLogs.action,
        oldValue: auditLogs.oldValue,
        newValue: auditLogs.newValue,
        createdAt: auditLogs.createdAt,
      })
      .from(auditLogs)
      .leftJoin(users, eq(auditLogs.adminId, users.id))
      .where(filters.length > 0 ? and(...filters) : undefined)
      .orderBy(desc(auditLogs.createdAt))
      .limit(params?.limit || 50);

    return logs;
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    return [];
  }
}

export async function getEntityHistory(entityType: string, entityId: string) {
    try {
        const history = await db
            .select({
                id: auditLogs.id,
                adminName: users.name,
                action: auditLogs.action,
                oldValue: auditLogs.oldValue,
                newValue: auditLogs.newValue,
                createdAt: auditLogs.createdAt,
            })
            .from(auditLogs)
            .leftJoin(users, eq(auditLogs.adminId, users.id))
            .where(and(eq(auditLogs.entityType, entityType), eq(auditLogs.entityId, entityId)))
            .orderBy(desc(auditLogs.createdAt));
        
        return history;
    } catch (error) {
        console.error("Error fetching entity history:", error);
        return [];
    }
}
