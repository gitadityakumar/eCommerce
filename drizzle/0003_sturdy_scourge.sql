ALTER TABLE "products" ADD COLUMN "default_variant_id" uuid;--> statement-breakpoint
ALTER TABLE "product_variants" ADD COLUMN "in_stock" boolean DEFAULT true NOT NULL;