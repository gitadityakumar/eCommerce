"use server";

import { db } from "@/lib/db";
import { 
  colors, 
  sizes, 
  genders, 
  productOptions, 
  productOptionValues, 
  auditLogs 
} from "@/lib/db/schema";
import { insertColorSchema, type InsertColor } from "@/lib/db/schema/filters/colors";
import { insertSizeSchema, type InsertSize } from "@/lib/db/schema/filters/sizes";
import { insertGenderSchema, type InsertGender } from "@/lib/db/schema/filters/genders";
import { getCurrentUser } from "@/lib/auth/actions";
import { eq } from "drizzle-orm";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";

// --- Colors ---

export async function getColors() {
  noStore();
  try {
    const data = await db.query.colors.findMany({
      orderBy: (colors, { asc }) => [asc(colors.name)],
    });
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching colors:", error);
    return { success: false, error: "Failed to fetch colors" };
  }
}

export async function createColor(data: InsertColor) {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const validated = insertColorSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, error: validated.error.flatten().fieldErrors };
  }

  try {
    const [newColor] = await db.insert(colors).values(validated.data).returning();

    await db.insert(auditLogs).values({
      adminId: user.id,
      entityType: "color",
      entityId: newColor.id,
      action: "create",
      newValue: newColor,
    });

    revalidatePath("/admin/attributes");
    return { success: true, data: newColor };
  } catch (error: unknown) {
    const dbError = error as { code?: string };
    if (dbError.code === "23505") return { success: false, error: "Slug already exists" };
    console.error("Error creating color:", error);
    return { success: false, error: "Failed to create color" };
  }
}

export async function updateColor(id: string, data: InsertColor) {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const validated = insertColorSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, error: validated.error.flatten().fieldErrors };
  }

  try {
    const oldColor = await db.query.colors.findFirst({ where: eq(colors.id, id) });
    if (!oldColor) return { success: false, error: "Color not found" };

    const [updatedColor] = await db
      .update(colors)
      .set(validated.data)
      .where(eq(colors.id, id))
      .returning();

    await db.insert(auditLogs).values({
      adminId: user.id,
      entityType: "color",
      entityId: id,
      action: "update",
      oldValue: oldColor,
      newValue: updatedColor,
    });

    revalidatePath("/admin/attributes");
    return { success: true, data: updatedColor };
  } catch (error: unknown) {
    const dbError = error as { code?: string };
    if (dbError.code === "23505") return { success: false, error: "Slug already exists" };
    console.error("Error updating color:", error);
    return { success: false, error: "Failed to update color" };
  }
}

export async function deleteColor(id: string) {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Unauthorized" };

  try {
    const oldColor = await db.query.colors.findFirst({ where: eq(colors.id, id) });
    if (!oldColor) return { success: false, error: "Color not found" };

    await db.delete(colors).where(eq(colors.id, id));

    await db.insert(auditLogs).values({
      adminId: user.id,
      entityType: "color",
      entityId: id,
      action: "delete",
      oldValue: oldColor,
    });

    revalidatePath("/admin/attributes");
    return { success: true };
  } catch (error) {
    console.error("Error deleting color:", error);
    return { success: false, error: "Failed to delete color" };
  }
}

// --- Sizes ---

export async function getSizes() {
  noStore();
  try {
    const data = await db.query.sizes.findMany({
      orderBy: (sizes, { asc }) => [asc(sizes.sortOrder)],
    });
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching sizes:", error);
    return { success: false, error: "Failed to fetch sizes" };
  }
}

export async function createSize(data: InsertSize) {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const validated = insertSizeSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, error: validated.error.flatten().fieldErrors };
  }

  try {
    const [newSize] = await db.insert(sizes).values(validated.data).returning();

    await db.insert(auditLogs).values({
      adminId: user.id,
      entityType: "size",
      entityId: newSize.id,
      action: "create",
      newValue: newSize,
    });

    revalidatePath("/admin/attributes");
    return { success: true, data: newSize };
  } catch (error: unknown) {
    const dbError = error as { code?: string };
    if (dbError.code === "23505") return { success: false, error: "Slug already exists" };
    console.error("Error creating size:", error);
    return { success: false, error: "Failed to create size" };
  }
}

export async function updateSize(id: string, data: InsertSize) {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const validated = insertSizeSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, error: validated.error.flatten().fieldErrors };
  }

  try {
    const oldSize = await db.query.sizes.findFirst({ where: eq(sizes.id, id) });
    if (!oldSize) return { success: false, error: "Size not found" };

    const [updatedSize] = await db
      .update(sizes)
      .set(validated.data)
      .where(eq(sizes.id, id))
      .returning();

    await db.insert(auditLogs).values({
      adminId: user.id,
      entityType: "size",
      entityId: id,
      action: "update",
      oldValue: oldSize,
      newValue: updatedSize,
    });

    revalidatePath("/admin/attributes");
    return { success: true, data: updatedSize };
  } catch (error: unknown) {
    const dbError = error as { code?: string };
    if (dbError.code === "23505") return { success: false, error: "Slug already exists" };
    console.error("Error updating size:", error);
    return { success: false, error: "Failed to update size" };
  }
}

export async function deleteSize(id: string) {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Unauthorized" };

  try {
    const oldSize = await db.query.sizes.findFirst({ where: eq(sizes.id, id) });
    if (!oldSize) return { success: false, error: "Size not found" };

    await db.delete(sizes).where(eq(sizes.id, id));

    await db.insert(auditLogs).values({
      adminId: user.id,
      entityType: "size",
      entityId: id,
      action: "delete",
      oldValue: oldSize,
    });

    revalidatePath("/admin/attributes");
    return { success: true };
  } catch (error) {
    console.error("Error deleting size:", error);
    return { success: false, error: "Failed to delete size" };
  }
}

// --- Genders ---

export async function getGenders() {
  noStore();
  try {
    const data = await db.query.genders.findMany({
      orderBy: (genders, { asc }) => [asc(genders.label)],
    });
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching genders:", error);
    return { success: false, error: "Failed to fetch genders" };
  }
}

export async function createGender(data: InsertGender) {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const validated = insertGenderSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, error: validated.error.flatten().fieldErrors };
  }

  try {
    const [newGender] = await db.insert(genders).values(validated.data).returning();

    await db.insert(auditLogs).values({
      adminId: user.id,
      entityType: "gender",
      entityId: newGender.id,
      action: "create",
      newValue: newGender,
    });

    revalidatePath("/admin/attributes");
    return { success: true, data: newGender };
  } catch (error: unknown) {
    const dbError = error as { code?: string };
    if (dbError.code === "23505") return { success: false, error: "Slug already exists" };
    console.error("Error creating gender:", error);
    return { success: false, error: "Failed to create gender" };
  }
}

export async function updateGender(id: string, data: InsertGender) {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const validated = insertGenderSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, error: validated.error.flatten().fieldErrors };
  }

  try {
    const oldGender = await db.query.genders.findFirst({ where: eq(genders.id, id) });
    if (!oldGender) return { success: false, error: "Gender not found" };

    const [updatedGender] = await db
      .update(genders)
      .set(validated.data)
      .where(eq(genders.id, id))
      .returning();

    await db.insert(auditLogs).values({
      adminId: user.id,
      entityType: "gender",
      entityId: id,
      action: "update",
      oldValue: oldGender,
      newValue: updatedGender,
    });

    revalidatePath("/admin/attributes");
    return { success: true, data: updatedGender };
  } catch (error: unknown) {
    const dbError = error as { code?: string };
    if (dbError.code === "23505") return { success: false, error: "Slug already exists" };
    console.error("Error updating gender:", error);
    return { success: false, error: "Failed to update gender" };
  }
}

export async function deleteGender(id: string) {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Unauthorized" };

  try {
    const oldGender = await db.query.genders.findFirst({ where: eq(genders.id, id) });
    if (!oldGender) return { success: false, error: "Gender not found" };

    await db.delete(genders).where(eq(genders.id, id));

    await db.insert(auditLogs).values({
      adminId: user.id,
      entityType: "gender",
      entityId: id,
      action: "delete",
      oldValue: oldGender,
    });

    revalidatePath("/admin/attributes");
    return { success: true };
  } catch (error) {
    console.error("Error deleting gender:", error);
    return { success: false, error: "Failed to delete gender" };
  }
}

// --- Product Options & Values ---

export async function getProductOptions(productId: string) {
  noStore();
  try {
    const data = await db.query.productOptions.findMany({
      where: eq(productOptions.productId, productId),
      with: {
        values: {
          orderBy: (values, { asc }) => [asc(values.sortOrder)],
        },
      },
      orderBy: (options, { asc }) => [asc(options.sortOrder)],
    });
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching product options:", error);
    return { success: false, error: "Failed to fetch product options" };
  }
}

export async function createProductOption(data: { productId: string; name: string; sortOrder: number }) {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Unauthorized" };

  try {
    const [newOption] = await db.insert(productOptions).values(data).returning();

    await db.insert(auditLogs).values({
      adminId: user.id,
      entityType: "product_option",
      entityId: newOption.id,
      action: "create",
      newValue: newOption,
    });

    revalidatePath("/admin/attributes");
    return { success: true, data: newOption };
  } catch (error) {
    console.error("Error creating product option:", error);
    return { success: false, error: "Failed to create product option" };
  }
}

export async function deleteProductOption(id: string) {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Unauthorized" };

  try {
    const oldOption = await db.query.productOptions.findFirst({ where: eq(productOptions.id, id) });
    if (!oldOption) return { success: false, error: "Option not found" };

    await db.delete(productOptions).where(eq(productOptions.id, id));

    await db.insert(auditLogs).values({
      adminId: user.id,
      entityType: "product_option",
      entityId: id,
      action: "delete",
      oldValue: oldOption,
    });

    revalidatePath("/admin/attributes");
    return { success: true };
  } catch (error) {
    console.error("Error deleting product option:", error);
    return { success: false, error: "Failed to delete product option" };
  }
}

export async function createProductOptionValue(data: { optionId: string; value: string; sortOrder: number }) {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Unauthorized" };

  try {
    const [newValue] = await db.insert(productOptionValues).values(data).returning();

    await db.insert(auditLogs).values({
      adminId: user.id,
      entityType: "product_option_value",
      entityId: newValue.id,
      action: "create",
      newValue: newValue,
    });

    revalidatePath("/admin/attributes");
    return { success: true, data: newValue };
  } catch (error) {
    console.error("Error creating option value:", error);
    return { success: false, error: "Failed to create option value" };
  }
}

export async function deleteProductOptionValue(id: string) {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Unauthorized" };

  try {
    const oldValue = await db.query.productOptionValues.findFirst({ where: eq(productOptionValues.id, id) });
    if (!oldValue) return { success: false, error: "Value not found" };

    await db.delete(productOptionValues).where(eq(productOptionValues.id, id));

    await db.insert(auditLogs).values({
      adminId: user.id,
      entityType: "product_option_value",
      entityId: id,
      action: "delete",
      oldValue: oldValue,
    });

    revalidatePath("/admin/attributes");
    return { success: true };
  } catch (error) {
    console.error("Error deleting option value:", error);
    return { success: false, error: "Failed to delete option value" };
  }
}
