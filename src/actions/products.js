'use server';

import { db } from '@/database/db'; 
import { Product, ProductVariant } from '@/database/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function createProduct(data){
  try {
    // Create product
    const [newProduct] = await db.insert(Product).values({
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.category,
    }).returning();

    // Create variants
    await Promise.all(data.variants.map(variant => 
      db.insert(ProductVariant).values({
        productId: newProduct.id,
        variantName: variant.name,
        quantity: variant.quantity,
        sku: variant.sku,
        pstu: data.pstu
      })
    ));

    revalidatePath('/testing')
  } catch (error) {
    console.error('Error creating product:', error);
    return { success: false };
  }
}

// Update to handle video creation
export async function createVideo(videoData) {
  // Insert into Video table instead of Product
  await db.insert(Video).values({
    name: videoData.name,
    description: videoData.description,
    category: videoData.category,
    pstu: videoData.pstu
  });
}