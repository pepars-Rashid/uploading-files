import {
    pgTable,
    serial,
    text,
    real,
    integer,
    timestamp,
    jsonb,
    primaryKey,
    foreignKey,
} from 'drizzle-orm/pg-core';

  // Define the Product table
export const Product = pgTable('product', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description').notNull(),
    price: real('price').notNull(),
    category: text('category').notNull(),
    createdAt: timestamp('createdAt').defaultNow(),
    updatedAt: timestamp('updatedAt').defaultNow().$onUpdate(() => new Date()),
});

  // Define the ProductVariant table
export const ProductVariant = pgTable('product_variant', {
    id: serial('id').primaryKey(),
    productId: integer('product_id').references(() => Product.id),
    variantName: text('variant_name').notNull(),
    quantity: integer('quantity').default(0),
    sku: text('sku'),
    pstu: jsonb('pstu'), // Object for (path, type, size, uploaded at, etc.)
    createdAt: timestamp('createdAt').defaultNow(),
    updatedAt: timestamp('updatedAt').defaultNow().$onUpdate(() => new Date()),
});

export const Video = pgTable('video', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  pstu: jsonb('pstu'),
  category: text('category').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow().$onUpdate(() => new Date()),
});