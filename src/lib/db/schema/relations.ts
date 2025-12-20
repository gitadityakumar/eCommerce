import { relations } from 'drizzle-orm';
import { brands } from './brands';
import { categories } from './categories';
import { genders } from './filters/genders';
import { productImages } from './images';
import { products } from './products';
import { productVariants } from './variants';

export const brandsRelations = relations(brands, ({ many }) => ({
  products: many(products),
}));

export const gendersRelations = relations(genders, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  gender: one(genders, {
    fields: [products.genderId],
    references: [genders.id],
  }),
  brand: one(brands, {
    fields: [products.brandId],
    references: [brands.id],
  }),
  variants: many(productVariants),
  images: many(productImages),
}));
