'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from './ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { SingleImageDropzone } from './singleImageDropzone';
import { useEdgeStore } from '@/lib/edgestore';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { createProduct } from '@/actions/products';

const formSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  price: z.coerce.number().positive(),
  category: z.string().min(2),
  variants: z.array(z.object({
    name: z.string().min(1),
    quantity: z.coerce.number().nonnegative(),
    sku: z.string().optional(),
  }))
});

export default function ProductForm() {
  const [file, setFile] = useState();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const { edgestore } = useEdgeStore();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      category: '',
      variants: [{
        name: '',
        quantity: 0,
        sku: ''
      }]
    },
  });

  async function onSubmit(values) {
    try {
      if (!file) {
        toast({ title: "Error", description: "Please upload an image" });
        return;
      }

      setIsUploading(true);
      
      // Upload image to EdgeStore
      const res = await edgestore.publicFiles.upload({
        file,
        onProgressChange: (progress) => setUploadProgress(progress),
      });

      // Create PSTU object from EdgeStore response
      const pstu = {
        path: res.url,
        size: res.size,
        uploadedAt: new Date(),
        // Add other necessary fields from res
      };

      // Call server action with form values and PSTU
      await createProduct({
        ...values,
        pstu,
      });

      toast({ title: "Success", description: "Product created successfully" });
      form.reset();
      setFile(undefined);
    } catch (error) {
      toast({ title: "Error", description: "Failed to create product" });
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-6">
        {/* Product Image Upload */}
        <div className="space-y-4">
          <FormLabel>Product Image</FormLabel>
          <SingleImageDropzone
            width={400}
            height={400}
            value={file}
            onChange={(file) => setFile(file)}
          />
          {(uploadProgress > 0 && isUploading) &&(
            <div className="h-2 w-full bg-gray-200 rounded-full">
              <div 
                className="h-full bg-blue-600 rounded-full transition-all" 
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
        </div>

        {/* Product Details */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="Product Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Product Description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Price" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input placeholder="Category" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Variants */}
        <div className="space-y-4">
          {form.watch('variants').map((_, index) => (
            <div key={index} className="space-y-4 border p-4 rounded">
              <FormField
                control={form.control}
                name={`variants.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Variant Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Variant Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`variants.${index}.quantity`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Quantity" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`variants.${index}.sku`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="SKU" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="button"
                variant="destructive"
                onClick={() => form.setValue('variants', form.getValues('variants').filter((_, i) => i !== index))}
              >
                Remove Variant
              </Button>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() => form.setValue('variants', [...form.getValues('variants'), { name: '', quantity: 0, sku: '' }])}
          >
            Add Variant
          </Button>
        </div>

        <Button type="submit" disabled={isUploading}>
          {isUploading ? 'Creating Product...' : 'Create Product'}
        </Button>
      </form>
    </Form>
  );
}