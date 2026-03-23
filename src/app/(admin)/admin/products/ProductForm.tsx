'use client';

import type { CreateProductInput } from '@/actions/products';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconCirclePlus, IconTrash } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import * as z from 'zod';
import { createProduct } from '@/actions/products';
import SortableImageUpload from '@/components/file-upload/sortable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { uploadFileToR2 } from '@/lib/cfstorage/r2-upload';

interface Category {
  id: string;
  name: string;
}

interface Brand {
  id: string;
  name: string;
}

interface Gender {
  id: string;
  label: string;
}

interface Color {
  id: string;
  name: string;
  hexCode: string;
}

interface Size {
  id: string;
  name: string;
}

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  slug: z.string().min(2, 'Slug must be at least 2 characters.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  categoryId: z.string().min(1, 'Category is required.'),
  brandId: z.string().min(1, 'Brand is required.'),
  genderId: z.string().min(1, 'Gender is required.'),
  status: z.enum(['draft', 'published', 'archived']),
  images: z.array(z.object({
    url: z.string().url('Invalid image URL'),
    isPrimary: z.boolean(),
  })).min(1, 'At least one image is required'),
  variants: z.array(z.object({
    sku: z.string().min(1, 'SKU is required'),
    price: z.string().min(1, 'Price is required').refine(val => !Number.isNaN(Number(val)) && Number(val) >= 0, 'Price must be at least 0'),
    salePrice: z.string().optional().nullable().refine(val => !val || (!Number.isNaN(Number(val)) && Number(val) >= 0), 'Sale price must be at least 0'),
    weight: z.string().optional().nullable().refine(val => !val || (!Number.isNaN(Number(val)) && Number(val) >= 0), 'Weight must be at least 0'),
    availableStock: z.string().refine(val => !val || (!Number.isNaN(Number(val)) && Number.isInteger(Number(val)) && Number(val) >= 0), 'Initial stock must be a non-negative integer'),

    colorId: z.string().uuid().optional().nullable(),
    sizeId: z.string().uuid().optional().nullable(),
    dimensions: z
      .object({
        length: z.string().optional().nullable().refine(val => !val || (!Number.isNaN(Number(val)) && Number(val) >= 0), 'Length must be at least 0'),
        width: z.string().optional().nullable().refine(val => !val || (!Number.isNaN(Number(val)) && Number(val) >= 0), 'Width must be at least 0'),
        height: z.string().optional().nullable().refine(val => !val || (!Number.isNaN(Number(val)) && Number(val) >= 0), 'Height must be at least 0'),
      })
      .nullable()
      .optional(),
  })).min(1, 'At least one variant is required'),
});

interface ProductFormProps {
  categories: Category[];
  brands: Brand[];
  genders: Gender[];
  colors: Color[];
  sizes: Size[];
}

export function ProductForm({ categories, brands, genders, colors, sizes }: ProductFormProps) {
  const router = useRouter();
  const [isPending, setIsPending] = React.useState(false);
  const [stagedImages, setStagedImages] = React.useState<{ id: string; file: File; preview: string }[]>([]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      categoryId: '',
      brandId: '',
      genderId: '',
      status: 'draft',
      images: [],
      variants: [{
        sku: '',
        price: '',
        salePrice: null,
        weight: null,
        availableStock: '0',
        colorId: null,
        sizeId: null,
        dimensions: null,
      }],
    },
  });

  const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray({
    name: 'variants',
    control: form.control,
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // @ts-expect-error - Debugging form submission
    window.submitStarted = true;
    setIsPending(true);

    const uploadToast = toast.loading('Uploading images...');

    try {
      // 1. Upload images to R2
      const uploadedImagePromises = stagedImages.map(async (image, index) => {
        const url = await uploadFileToR2(image.file, {
          folder: 'products',
        });
        return {
          url,
          isPrimary: index === 0,
        };
      });

      const uploadedImages = await Promise.all(uploadedImagePromises);

      if (uploadedImages.length === 0) {
        toast.error('At least one image is required', { id: uploadToast });
        setIsPending(false);
        return;
      }

      toast.loading('Creating product...', { id: uploadToast });

      // 2. Submit values with uploaded image URLs
      const submitValues = {
        ...values,
        images: uploadedImages,
        variants: values.variants.map(v => ({
          ...v,
          availableStock: v.availableStock ? Number(v.availableStock) : 0,
          weight: v.weight ? Number(v.weight) : null,
          dimensions: v.dimensions
            ? {
                length: v.dimensions.length ? Number(v.dimensions.length) : null,
                width: v.dimensions.width ? Number(v.dimensions.width) : null,
                height: v.dimensions.height ? Number(v.dimensions.height) : null,
              }
            : null,
          colorId: v.colorId === 'none' ? null : v.colorId,
          sizeId: v.sizeId === 'none' ? null : v.sizeId,
        })),
      };

      const result = await createProduct(submitValues as CreateProductInput);
      // @ts-expect-error - Debugging form submission result
      window.lastSubmitResult = result;
      setIsPending(false);

      if (result.success) {
        toast.success('Product created successfully', { id: uploadToast });
        form.reset();
        router.push('/admin/products');
        router.refresh();
      }
      else {
        toast.error(result.error || 'Failed to create product', { id: uploadToast });
      }
    }
    catch (error) {
      console.error('Error in submission:', error);
      toast.error('An unexpected error occurred during submission', { id: uploadToast });
      setIsPending(false);
    }
  }

  const onFormError = (errors: any) => {
    console.error('Form Validation Errors:', errors);

    const extractErrors = (obj: any): string[] => {
      let messages: string[] = [];
      if (!obj || typeof obj !== 'object')
        return messages;

      if (obj.message) {
        messages.push(obj.message);
      }

      Object.values(obj).forEach((value) => {
        if (typeof value === 'object') {
          messages = [...messages, ...extractErrors(value)];
        }
      });

      return messages;
    };

    const errorMessages = extractErrors(errors).filter(Boolean);

    if (errorMessages.length > 0) {
      toast.error(`Please fix the following: ${errorMessages[0]}`);
    }
    else {
      toast.error('Form validation failed. Please check all fields.');
    }
  };

  // Auto-generate slug from name
  React.useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'name' && value.name) {
        const slug = value.name
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');
        form.setValue('slug', slug, { shouldValidate: true });
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <div className="px-4 lg:px-6 pb-12">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onFormError)} className="space-y-8">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-10 h-14 p-1 bg-surface/50 border border-border-subtle rounded-2xl">
              <TabsTrigger value="general" className="rounded-xl data-[state=active]:bg-surface data-[state=active]:text-accent data-[state=active]:shadow-soft font-bold tracking-widest uppercase text-[10px]">General Info</TabsTrigger>
              <TabsTrigger value="inventory" className="rounded-xl data-[state=active]:bg-surface data-[state=active]:text-accent data-[state=active]:shadow-soft font-bold tracking-widest uppercase text-[10px]">Inventory & Pricing</TabsTrigger>
              <TabsTrigger value="media" className="rounded-xl data-[state=active]:bg-surface data-[state=active]:text-accent data-[state=active]:shadow-soft font-bold tracking-widest uppercase text-[10px]">Media</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              <Card className="border-border-subtle bg-surface/50 shadow-soft rounded-2xl overflow-hidden">
                <CardHeader className="border-b border-border-subtle bg-surface/30 py-8">
                  <CardTitle className="text-2xl font-light tracking-tighter text-text-primary font-playfair italic">Basic Information</CardTitle>
                  <CardDescription className="text-xs text-text-secondary font-light">The foundational silhouette details of your creation.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-bold tracking-widest uppercase text-text-secondary">Identifier Name</FormLabel>
                          <FormControl>
                            <Input placeholder="E.g. Zenith Chronograph" className="h-14 bg-background/50 border-border-subtle rounded-xl focus:ring-accent/20 focus:border-accent/40 transition-all font-light" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-bold tracking-widest uppercase text-text-secondary">Archival Link</FormLabel>
                          <FormControl>
                            <Input placeholder="zenith-chronograph" className="h-14 bg-background/50 border-border-subtle rounded-xl focus:ring-accent/20 focus:border-accent/40 transition-all font-mono text-xs tracking-wider" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-bold tracking-widest uppercase text-text-secondary">Description</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="An editorial narrative of your product..."
                            className="h-14 bg-background/50 border-border-subtle rounded-xl focus:ring-accent/20 focus:border-accent/40 transition-all"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-bold tracking-widest uppercase text-text-secondary">Spectrum Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-14 bg-background border-border-subtle rounded-xl focus:ring-accent/20 focus:border-accent/40 transition-all">
                                <SelectValue placeholder="Instate Category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-surface border-border-subtle rounded-xl shadow-soft backdrop-blur-md">
                              {categories.map(cat => (
                                <SelectItem key={cat.id} value={cat.id} className="text-sm font-light">{cat.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="brandId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-bold tracking-widest uppercase text-text-secondary">Noble House</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-14 bg-background border-border-subtle rounded-xl focus:ring-accent/20 focus:border-accent/40 transition-all">
                                <SelectValue placeholder="Instate Brand" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-surface border-border-subtle rounded-xl shadow-soft backdrop-blur-md">
                              {brands.map(brand => (
                                <SelectItem key={brand.id} value={brand.id} className="text-sm font-light">{brand.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="genderId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-bold tracking-widest uppercase text-text-secondary">Archetype</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-14 bg-background border-border-subtle rounded-xl focus:ring-accent/20 focus:border-accent/40 transition-all">
                                <SelectValue placeholder="Instate Archetype" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-surface border-border-subtle rounded-xl shadow-soft backdrop-blur-md">
                              {genders.map(g => (
                                <SelectItem key={g.id} value={g.id} className="text-sm font-light">{g.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-bold tracking-widest uppercase text-text-secondary">Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-14 bg-background border-border-subtle rounded-xl focus:ring-accent/20 focus:border-accent/40 transition-all">
                              <SelectValue placeholder="Current Phase" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-surface border-border-subtle rounded-xl shadow-soft backdrop-blur-md">
                            <SelectItem value="draft" className="text-[10px] font-bold tracking-widest uppercase">Draft Archive</SelectItem>
                            <SelectItem value="published" className="text-[10px] font-bold tracking-widest uppercase text-accent">Published Editorial</SelectItem>
                            <SelectItem value="archived" className="text-[10px] font-bold tracking-widest uppercase text-text-secondary">Hidden Archive</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="inventory" className="space-y-6">
              <Card className="border-border-subtle bg-surface/50 shadow-soft rounded-2xl overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between border-b border-border-subtle bg-surface/30 py-6">
                  <div>
                    <CardTitle className="text-2xl font-light tracking-tighter text-text-primary font-playfair italic">Archival Variants</CardTitle>
                    <CardDescription className="text-xs text-text-secondary font-light">Manage SKUs, pricing, and stock for each variation.</CardDescription>
                  </div>
                  <Button
                    type="button"
                    onClick={() => appendVariant({
                      sku: '',
                      price: '',
                      salePrice: null,
                      weight: null,
                      availableStock: '0',
                      colorId: null,
                      sizeId: null,
                      dimensions: null,
                    })}
                    className="bg-accent text-white hover:bg-accent/90 rounded-full px-6 font-bold tracking-widest uppercase text-[10px] shadow-soft shadow-accent/20 h-10 transition-all hover:-translate-y-0.5"
                  >
                    <IconCirclePlus className="mr-2 size-3.5" strokeWidth={3} />
                    Instate Variant
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  {variantFields.map((field, index) => (
                    <div key={field.id} className="space-y-6 p-8 bg-background/30 border border-border-subtle rounded-2xl relative group/variant transition-all hover:bg-background/40">
                      {variantFields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeVariant(index)}
                          className="absolute top-4 right-4 text-text-secondary hover:text-rose-500 hover:bg-rose-500/10 rounded-full transition-all opacity-0 group-hover/variant:opacity-100"
                        >
                          <IconTrash className="size-4" />
                        </Button>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <FormField
                          control={form.control}
                          name={`variants.${index}.sku`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[10px] font-bold tracking-widest uppercase text-text-secondary">Archival SKU</FormLabel>
                              <FormControl>
                                <Input placeholder="E.g. NOIR-AM270-BLK" className="h-12 bg-background border-border-subtle rounded-xl focus:ring-accent/20 focus:border-accent/40 transition-all font-mono text-[10px] tracking-widest" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`variants.${index}.price`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[10px] font-bold tracking-widest uppercase text-text-secondary">Valuation (INR)</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.01" min="0" placeholder="0.00" className="h-12 bg-background border-border-subtle rounded-xl focus:ring-accent/20 focus:border-accent/40 transition-all font-light" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`variants.${index}.availableStock`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[10px] font-bold tracking-widest uppercase text-text-secondary">Initial Reserve</FormLabel>
                              <FormControl>
                                <Input placeholder="0" className="h-12 bg-background border-border-subtle rounded-xl focus:ring-accent/20 focus:border-accent/40 transition-all font-light" {...field} value={field.value ?? ''} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`variants.${index}.colorId`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[10px] font-bold tracking-widest uppercase text-text-secondary">Hue Selection (Optional)</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                                <FormControl>
                                  <SelectTrigger className="h-12 bg-background border-border-subtle rounded-xl focus:ring-accent/20 focus:border-accent/40 transition-all font-light">
                                    <SelectValue placeholder="Select hue" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-surface border-border-subtle rounded-xl shadow-soft backdrop-blur-md">
                                  <SelectItem value="none" className="text-[10px] font-bold tracking-widest uppercase text-text-secondary">No Hue</SelectItem>
                                  {colors.map(color => (
                                    <SelectItem key={color.id} value={color.id} className="text-sm font-light">
                                      <div className="flex items-center gap-3">
                                        <div
                                          className="size-3.5 rounded-full border border-border-subtle shadow-sm"
                                          style={{ backgroundColor: color.hexCode }}
                                        />
                                        {color.name}
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`variants.${index}.sizeId`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[10px] font-bold tracking-widest uppercase text-text-secondary">Dimensional Scale (Optional)</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                                <FormControl>
                                  <SelectTrigger className="h-12 bg-background border-border-subtle rounded-xl focus:ring-accent/20 focus:border-accent/40 transition-all font-light">
                                    <SelectValue placeholder="Select scale" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-surface border-border-subtle rounded-xl shadow-soft backdrop-blur-md">
                                  <SelectItem value="none" className="text-[10px] font-bold tracking-widest uppercase text-text-secondary">No Scale</SelectItem>
                                  {sizes.map(size => (
                                    <SelectItem key={size.id} value={size.id} className="text-sm font-light">{size.name}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <FormField
                          control={form.control}
                          name={`variants.${index}.weight`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[10px] font-bold tracking-widest uppercase text-text-secondary">Mass (kg)</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.01" min="0" className="h-12 bg-background border-border-subtle rounded-xl focus:ring-accent/20 focus:border-accent/40 transition-all font-light" {...field} value={field.value ?? ''} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`variants.${index}.dimensions.length`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[10px] font-bold tracking-widest uppercase text-text-secondary">Length</FormLabel>
                              <FormControl>
                                <Input type="number" min="0" className="h-12 bg-background border-border-subtle rounded-xl focus:ring-accent/20 focus:border-accent/40 transition-all font-light" {...field} value={field.value ?? ''} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`variants.${index}.dimensions.width`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[10px] font-bold tracking-widest uppercase text-text-secondary">Width</FormLabel>
                              <FormControl>
                                <Input type="number" min="0" className="h-12 bg-background border-border-subtle rounded-xl focus:ring-accent/20 focus:border-accent/40 transition-all font-light" {...field} value={field.value ?? ''} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`variants.${index}.dimensions.height`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[10px] font-bold tracking-widest uppercase text-text-secondary">Height</FormLabel>
                              <FormControl>
                                <Input type="number" min="0" className="h-12 bg-background border-border-subtle rounded-xl focus:ring-accent/20 focus:border-accent/40 transition-all font-light" {...field} value={field.value ?? ''} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="media" className="space-y-6">
              <Card className="border-border-subtle bg-surface/50 shadow-soft rounded-2xl overflow-hidden">
                <CardHeader className="border-b border-border-subtle bg-surface/30 py-8">
                  <CardTitle className="text-2xl font-light tracking-tighter text-text-primary font-playfair italic">Product Media</CardTitle>
                  <CardDescription className="text-xs text-text-secondary font-light">Add images for your product. The first one will be the primary image.</CardDescription>
                </CardHeader>
                <CardContent>
                  <SortableImageUpload
                    onImagesChange={(images) => {
                      setStagedImages(images);
                      form.setValue('images', images.map((img, index) => ({
                        url: img.preview,
                        isPrimary: index === 0,
                      })), { shouldValidate: true });
                    }}
                  />
                  {form.formState.errors.images && (
                    <p className="text-sm font-medium text-destructive mt-2">
                      {form.formState.errors.images.message}
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-6 pt-10 border-t border-border-subtle mt-10">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isPending}
              className="h-14 px-10 rounded-full border-border-subtle text-text-secondary hover:text-accent font-bold tracking-widest uppercase text-[10px] transition-all"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="h-14 px-10 bg-accent text-white hover:bg-accent/90 rounded-full font-bold tracking-widest uppercase text-[10px] shadow-soft shadow-accent/20 transition-all hover:-translate-y-0.5"
            >
              {isPending ? 'Curating...' : 'Create Masterpiece'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
