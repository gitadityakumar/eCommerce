'use server';

import { desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { db } from '@/lib/db';
import { colors, genders, inventoryLevels, productImages, products, productVariants, sizes } from '@/lib/db/schema';

const createProductSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  categoryId: z.string().uuid().nullable(),
  brandId: z.string().uuid().nullable(),
  genderId: z.string().uuid().nullable(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  images: z.array(z.object({
    url: z.string().url(),
    isPrimary: z.boolean().default(false),
  })).optional(),
  variants: z.array(z.object({
    sku: z.string().min(1),
    price: z.string(),
    salePrice: z.string().optional().nullable(),
    weight: z.number().optional().nullable(),
    dimensions: z.object({
      length: z.number(),
      width: z.number(),
      height: z.number(),
    }).partial().optional().nullable(),
    availableStock: z.number().int().min(0).default(0),
    colorId: z.string().uuid().optional().nullable(),
    sizeId: z.string().uuid().optional().nullable(),
  })).min(1),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;

export async function getProducts() {
  try {
    const allProducts = await db.query.products.findMany({
      with: {
        category: true,
        brand: true,
      },
      orderBy: [desc(products.createdAt)],
    });
    return allProducts;
  }
  catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function getCategories() {
  try {
    return await db.query.categories.findMany();
  }
  catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function getBrands() {
  try {
    return await db.query.brands.findMany();
  }
  catch (error) {
    console.error('Error fetching brands:', error);
    return [];
  }
}

export async function createProduct(input: CreateProductInput) {
  try {
    const validated = createProductSchema.parse(input);

    const result = await db.transaction(async (tx) => {
      // 1. Create Product
      const [newProduct] = await tx.insert(products).values({
        name: validated.name,
        slug: validated.slug,
        description: validated.description,
        categoryId: validated.categoryId,
        brandId: validated.brandId,
        genderId: validated.genderId,
        status: validated.status || 'draft',
      }).returning();

      // 2. Create Images if any
      if (validated.images && validated.images.length > 0) {
        await tx.insert(productImages).values(
          validated.images.map((img, index) => ({
            productId: newProduct.id,
            url: img.url,
            isPrimary: img.isPrimary,
            sortOrder: index,
          })),
        );
      }

      // 3. Create Variants and Inventory
      for (const variantData of validated.variants) {
        const [newVariant] = await tx.insert(productVariants).values({
          productId: newProduct.id,
          sku: variantData.sku,
          price: variantData.price,
          salePrice: variantData.salePrice,
          weight: variantData.weight,
          dimensions: variantData.dimensions,
          colorId: variantData.colorId,
          sizeId: variantData.sizeId,
        }).returning();

        // 4. Create initial Inventory Level
        await tx.insert(inventoryLevels).values({
          variantId: newVariant.id,
          available: variantData.availableStock,
          reserved: 0,
        });
      }

      return newProduct;
    });

    revalidatePath('/admin/products');
    return { success: true, product: result };
  }
  catch (error) {
    console.error('Error creating product:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: 'Failed to create product' };
  }
}

export async function getGenders() {
  try {
    return await db.select().from(genders);
  }
  catch (error) {
    console.error('Error fetching genders:', error);
    return [];
  }
}

export async function getColors() {
  try {
    return await db.select().from(colors);
  }
  catch (error) {
    console.error('Error fetching colors:', error);
    return [];
  }
}

export async function getSizes() {
  try {
    return await db.select().from(sizes);
  }
  catch (error) {
    console.error('Error fetching sizes:', error);
    return [];
  }
}
