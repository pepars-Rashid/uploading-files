// src/app/testing-images-store/page.jsx 
import ProductForm from '@/components/product-form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { db } from '@/database/db';
import { Product, ProductVariant } from '@/database/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic'

export default async function Page() {
  // Fetch products with their variants using LEFT JOIN
  const result = await db
    .select()
    .from(Product)
    .leftJoin(ProductVariant, eq(Product.id, ProductVariant.productId));

  console.log('result:', result);

  return (
    <div className="container mx-auto p-4">
      {/* Product Form */}
      <div className="mb-8">
        <ProductForm />
      </div>

      {/* Display Products */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {result.map((row, index) => {
          const { product, product_variant } = row;

          return (
            <Card key={`${product.id}-${index}`} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                {/* Product Image */}
                {product_variant?.pstu?.path && (
                  <div className="relative h-fit w-full mb-4">
                    <img
                      width={200}
                      height={200}
                      src={product_variant.pstu.path}
                      alt={product.name}
                      className="object-cover rounded-lg"
                    />
                  </div>
                )}
                <CardTitle>{product.name}</CardTitle>
                <CardDescription>{product.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="font-semibold">Price: ${product.price}</p>
                <p className="text-sm text-gray-600">Category: {product.category}</p>

                {/* Variants */}
                {product_variant && (
                  <div className="mt-4 space-y-2">
                    <h3 className="font-medium">Variant:</h3>
                    <div className="p-2 border rounded">
                      <p>Name: {product_variant.variantName}</p>
                      <p>Quantity: {product_variant.quantity}</p>
                      {product_variant.sku && <p>SKU: {product_variant.sku}</p>}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View with more Details
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}