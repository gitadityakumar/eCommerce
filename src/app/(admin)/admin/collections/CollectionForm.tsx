'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { createCollection, updateCollection } from '@/actions/collections';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug must only contain lowercase letters, numbers, and hyphens'),
  productIds: z.array(z.string().uuid()),
});

export type FormValues = z.infer<typeof formSchema>;

export interface CollectionFormProps {
  initialData?: FormValues & { id?: string };
  products: { id: string; name: string }[];
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CollectionForm({ initialData, products, onSuccess, onCancel }: CollectionFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      slug: '',
      productIds: [],
    },
  });

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'name' && !initialData) {
        const slug = value.name
          ?.toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
        form.setValue('slug', slug || '', { shouldValidate: true });
      }
    });
    return () => subscription.unsubscribe();
  }, [form, initialData]);

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      let res;
      if (initialData?.id) {
        res = await updateCollection(initialData.id, values);
      }
      else {
        res = await createCollection(values);
      }

      if (res.success) {
        toast.success(initialData ? 'Collection updated' : 'Collection created');
        form.reset();
        if (onSuccess) {
          onSuccess();
        }
        else {
          router.push('/admin/collections');
          router.refresh();
        }
      }
      else {
        toast.error(typeof res.error === 'string' ? res.error : 'Something went wrong');
      }
    }
    catch (error) {
      console.error(error);
      toast.error('Something went wrong');
    }
    finally {
      setLoading(false);
    }
  };

  const selectedProducts = form.watch('productIds');

  const toggleProduct = (productId: string) => {
    const current = form.getValues('productIds');
    if (current.includes(productId)) {
      form.setValue('productIds', current.filter(id => id !== productId), { shouldValidate: true });
    }
    else {
      form.setValue('productIds', [...current, productId], { shouldValidate: true });
    }
  };

  const removeProduct = (productId: string) => {
    const current = form.getValues('productIds');
    form.setValue('productIds', current.filter(id => id !== productId), { shouldValidate: true });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Summer Collection" {...field} />
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
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input
                    placeholder="summer-collection"
                    {...field}
                    onChange={e => field.onChange(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="productIds"
          render={() => (
            <FormItem className="flex flex-col">
              <FormLabel>Products</FormLabel>
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedProducts.map((id) => {
                  const product = products.find(p => p.id === id);
                  return (
                    <Badge key={id} variant="secondary" className="flex items-center gap-1">
                      {product?.name || 'Unknown'}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeProduct(id)}
                      />
                    </Badge>
                  );
                })}
              </div>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="justify-between"
                    >
                      {selectedProducts.length > 0
                        ? `${selectedProducts.length} products selected`
                        : 'Select products...'}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0">
                  <Command>
                    <CommandInput placeholder="Search products..." />
                    <CommandList>
                      <CommandEmpty>No product found.</CommandEmpty>
                      <CommandGroup>
                        {products.map(product => (
                          <CommandItem
                            key={product.id}
                            value={product.name}
                            onSelect={() => {
                              toggleProduct(product.id);
                            }}
                          >
                            <Check
                              className={cn(
                                'mr-2 h-4 w-4',
                                selectedProducts.includes(product.id)
                                  ? 'opacity-100'
                                  : 'opacity-0',
                              )}
                            />
                            {product.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              if (onCancel) {
                onCancel();
              }
              else {
                router.push('/admin/collections');
              }
            }}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {initialData ? 'Update Collection' : 'Create Collection'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
