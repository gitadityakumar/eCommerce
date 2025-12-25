import { relations } from 'drizzle-orm';
import { addresses } from './addresses';
import { auditLogs } from './audit_logs';
import { brands } from './brands';
import { cartItems, carts } from './carts';
import { categories } from './categories';
import { collections, productCollections } from './collections';
import { colors } from './filters/colors';
import { genders } from './filters/genders';
import { sizes } from './filters/sizes';
import { guests } from './guest';
import { productImages } from './images';
import { inventoryLevels, stockLedger } from './inventory';
import { productOptions, productOptionValues } from './options';
import { fulfillments, orderItems, orders } from './orders';
import { payments } from './payments';
import { products } from './products';
import { reviews } from './reviews';
import { users } from './user';
import { productVariants, variantOptions } from './variants';
import { wishlists } from './wishlists';

export const brandsRelations = relations(brands, ({ many }) => ({
  products: many(products),
}));

export const gendersRelations = relations(genders, ({ many }) => ({
  products: many(products),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
    relationName: 'category_parent',
  }),
  children: many(categories, {
    relationName: 'category_parent',
  }),
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

export const productVariantsRelations = relations(productVariants, ({ one, many }) => ({
  product: one(products, {
    fields: [productVariants.productId],
    references: [products.id],
  }),
  color: one(colors, {
    fields: [productVariants.colorId],
    references: [colors.id],
  }),
  size: one(sizes, {
    fields: [productVariants.sizeId],
    references: [sizes.id],
  }),
  inventory: one(inventoryLevels, {
    fields: [productVariants.id],
    references: [inventoryLevels.variantId],
  }),
  optionValues: many(variantOptions),
  images: many(productImages),
}));

export const inventoryLevelsRelations = relations(inventoryLevels, ({ one }) => ({
  variant: one(productVariants, {
    fields: [inventoryLevels.variantId],
    references: [productVariants.id],
  }),
}));

export const stockLedgerRelations = relations(stockLedger, ({ one }) => ({
  variant: one(productVariants, {
    fields: [stockLedger.variantId],
    references: [productVariants.id],
  }),
}));

export const colorsRelations = relations(colors, ({ many }) => ({
  variants: many(productVariants),
}));

export const sizesRelations = relations(sizes, ({ many }) => ({
  variants: many(productVariants),
}));
export const collectionsRelations = relations(collections, ({ many }) => ({
  junctions: many(productCollections),
}));

export const productCollectionsRelations = relations(productCollections, ({ one }) => ({
  collection: one(collections, {
    fields: [productCollections.collectionId],
    references: [collections.id],
  }),
  product: one(products, {
    fields: [productCollections.productId],
    references: [products.id],
  }),
}));

export const cartsRelations = relations(carts, ({ many, one }) => ({
  user: one(users, {
    fields: [carts.userId],
    references: [users.id],
  }),
  guest: one(guests, {
    fields: [carts.guestId],
    references: [guests.id],
  }),
  items: many(cartItems),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(carts, {
    fields: [cartItems.cartId],
    references: [carts.id],
  }),
  variant: one(productVariants, {
    fields: [cartItems.productVariantId],
    references: [productVariants.id],
  }),
}));

export const ordersRelations = relations(orders, ({ many, one }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  shippingAddress: one(addresses, {
    fields: [orders.shippingAddressId],
    references: [addresses.id],
  }),
  billingAddress: one(addresses, {
    fields: [orders.billingAddressId],
    references: [addresses.id],
  }),
  items: many(orderItems),
  fulfillments: many(fulfillments),
}));

export const fulfillmentsRelations = relations(fulfillments, ({ one }) => ({
  order: one(orders, {
    fields: [fulfillments.orderId],
    references: [orders.id],
  }),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  variant: one(productVariants, {
    fields: [orderItems.productVariantId],
    references: [productVariants.id],
  }),
}));

export const productOptionsRelations = relations(productOptions, ({ one, many }) => ({
  product: one(products, {
    fields: [productOptions.productId],
    references: [products.id],
  }),
  values: many(productOptionValues),
}));

export const productOptionValuesRelations = relations(productOptionValues, ({ one }) => ({
  option: one(productOptions, {
    fields: [productOptionValues.optionId],
    references: [productOptions.id],
  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  order: one(orders, {
    fields: [payments.orderId],
    references: [orders.id],
  }),
}));

export const wishlistsRelations = relations(wishlists, ({ one }) => ({
  user: one(users, {
    fields: [wishlists.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [wishlists.productId],
    references: [products.id],
  }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  admin: one(users, {
    fields: [auditLogs.adminId],
    references: [users.id],
  }),
}));

export const addressesRelations = relations(addresses, ({ one }) => ({
  user: one(users, {
    fields: [addresses.userId],
    references: [users.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  addresses: many(addresses),
  orders: many(orders),
  reviews: many(reviews),
  wishlists: many(wishlists),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
  variant: one(productVariants, {
    fields: [productImages.variantId],
    references: [productVariants.id],
  }),
}));
