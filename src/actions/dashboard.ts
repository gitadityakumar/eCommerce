'use server';

import { db } from "@/lib/db";
import { 
  orders, users, products, productVariants, inventoryLevels, 
  carts, sessions, guests, auditLogs 
} from "@/lib/db/schema";
import { sql, eq, ne, gte, desc, and } from "drizzle-orm";

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  activeCarts: number;
  activeSessions: number;
  lowStockItems: {
    id: string;
    productName: string;
    sku: string;
    available: number;
  }[];
  recentOrders: {
    id: string;
    customerName: string;
    totalAmount: string;
    status: string;
    createdAt: Date;
  }[];
  salesTrends: {
    date: string;
    revenue: number;
  }[];
  auditFeed: {
    id: string;
    adminName: string;
    action: string;
    entityType: string;
    createdAt: Date;
  }[];
}

export async function getDashboardData(dateRange?: { from: Date; to: Date }): Promise<DashboardStats> {
  try {
    const fromDate = dateRange?.from || new Date(new Date().setDate(new Date().getDate() - 30));
    const toDate = dateRange?.to || new Date();

    const dateFilter = and(
      gte(orders.createdAt, fromDate),
      sql`${orders.createdAt} <= ${toDate}`
    );

    // 1. KPI Stats
    const totalRevenueResult = await db
      .select({ value: sql<number>`sum(${orders.totalAmount})` })
      .from(orders)
      .where(and(ne(orders.status, 'cancelled'), dateFilter));

    const totalOrdersResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(orders)
      .where(dateFilter);

    const totalCustomersResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(eq(users.role, 'customer'));

    const activeCartsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(carts);

    // 2. Active Sessions
    const now = new Date();
    const activeUserSessions = await db
      .select({ count: sql<number>`count(*)` })
      .from(sessions)
      .where(gte(sessions.expiresAt, now));

    const activeGuestSessions = await db
      .select({ count: sql<number>`count(*)` })
      .from(guests)
      .where(gte(guests.expiresAt, now));

    // 3. Low Stock Items
    const lowStockItems = await db
      .select({
        id: productVariants.id,
        productName: products.name,
        sku: productVariants.sku,
        available: inventoryLevels.available,
      })
      .from(inventoryLevels)
      .innerJoin(productVariants, eq(inventoryLevels.variantId, productVariants.id))
      .innerJoin(products, eq(productVariants.productId, products.id))
      .where(sql`${inventoryLevels.available} < 10`)
      .orderBy(inventoryLevels.available)
      .limit(5);

    // 4. Sales Trends (Daily)
    const salesTrends = await db
      .select({
        date: sql<string>`TO_CHAR(${orders.createdAt}, 'YYYY-MM-DD')`,
        revenue: sql<number>`sum(${orders.totalAmount})`,
      })
      .from(orders)
      .where(and(ne(orders.status, 'cancelled'), dateFilter))
      .groupBy(sql`TO_CHAR(${orders.createdAt}, 'YYYY-MM-DD')`)
      .orderBy(sql`TO_CHAR(${orders.createdAt}, 'YYYY-MM-DD')`);

    // 5. Recent Orders
    const recentOrders = await db
      .select({
        id: orders.id,
        customerName: users.name,
        totalAmount: orders.totalAmount,
        status: orders.status,
        createdAt: orders.createdAt,
      })
      .from(orders)
      .leftJoin(users, eq(orders.userId, users.id))
      .orderBy(desc(orders.createdAt))
      .limit(5);

    // 6. Audit Feed
    const auditFeed = await db
      .select({
        id: auditLogs.id,
        adminName: users.name,
        action: auditLogs.action,
        entityType: auditLogs.entityType,
        createdAt: auditLogs.createdAt,
      })
      .from(auditLogs)
      .leftJoin(users, eq(auditLogs.adminId, users.id))
      .orderBy(desc(auditLogs.createdAt))
      .limit(5);

    return {
      totalRevenue: Number(totalRevenueResult[0]?.value || 0),
      totalOrders: Number(totalOrdersResult[0]?.count || 0),
      totalCustomers: Number(totalCustomersResult[0]?.count || 0),
      activeCarts: Number(activeCartsResult[0]?.count || 0),
      activeSessions: Number(activeUserSessions[0]?.count || 0) + Number(activeGuestSessions[0]?.count || 0),
      lowStockItems: lowStockItems.map(item => ({
        ...item,
        productName: item.productName || 'Unknown Product'
      })),
      recentOrders: recentOrders.map(order => ({
        ...order,
        customerName: order.customerName || 'Guest'
      })),
      salesTrends: salesTrends.map(trend => ({
        ...trend,
        revenue: Number(trend.revenue)
      })),
      auditFeed: auditFeed.map(log => ({
        ...log,
        adminName: log.adminName || 'System'
      })),
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
}

// Keep the old one for compatibility if needed, but point to new data structure or just keep as is
export async function getDashboardStats() {
    const data = await getDashboardData();
    return {
        totalRevenue: data.totalRevenue,
        totalOrders: data.totalOrders,
        totalCustomers: data.totalCustomers,
        lowStockAlerts: data.lowStockItems.length,
    };
}
