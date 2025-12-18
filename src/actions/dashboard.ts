'use server';

import { db } from "@/lib/db";
import { orders, users, products } from "@/lib/db/schema";
import { sql, eq, ne } from "drizzle-orm";

export async function getDashboardStats() {
  try {
    const totalRevenueResult = await db
      .select({ value: sql<number>`sum(${orders.totalAmount})` })
      .from(orders)
      .where(ne(orders.status, 'cancelled'));

    const totalOrdersResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(orders);

    const totalCustomersResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(eq(users.role, 'customer'));

    const lowStockResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .where(eq(products.status, 'draft')); // Simplified: counting drafts as potential low stock/pending items

    return {
      totalRevenue: Number(totalRevenueResult[0]?.value || 0),
      totalOrders: Number(totalOrdersResult[0]?.count || 0),
      totalCustomers: Number(totalCustomersResult[0]?.count || 0),
      lowStockAlerts: Number(lowStockResult[0]?.count || 0),
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      totalRevenue: 0,
      totalOrders: 0,
      totalCustomers: 0,
      lowStockAlerts: 0,
    };
  }
}
