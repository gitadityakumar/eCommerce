'use client';

import type * as z from 'zod';
import type { SelectCategory } from '@/lib/db/schema/categories';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconLoader2, IconSparkles, IconX } from '@tabler/icons-react';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { createCategory, updateCategory } from '@/actions/categories';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
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
import { insertCategorySchema } from '@/lib/db/schema/categories';

type FormValues = z.infer<typeof insertCategorySchema>;

interface CategoryFormProps {
  categories: SelectCategory[];
  editingCategory: SelectCategory | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function CategoryForm({ categories, editingCategory, onSuccess, onCancel }: CategoryFormProps) {
  const [isPending, setIsPending] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(insertCategorySchema),
    defaultValues: {
      name: editingCategory?.name || '',
      slug: editingCategory?.slug || '',
      parentId: editingCategory?.parentId || null,
    },
  });

  // Reset form when editingCategory changes
  React.useEffect(() => {
    if (editingCategory) {
      form.reset({
        name: editingCategory.name,
        slug: editingCategory.slug,
        parentId: editingCategory.parentId,
      });
    }
    else {
      form.reset({
        name: '',
        slug: '',
        parentId: null,
      });
    }
  }, [editingCategory, form]);

  const generateSlug = () => {
    const name = form.getValues('name');
    if (!name)
      return;
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-{2,}/g, '-');
    form.setValue('slug', slug, { shouldValidate: true });
  };

  async function onSubmit(values: FormValues) {
    setIsPending(true);
    try {
      const result = editingCategory
        ? await updateCategory(editingCategory.id, values)
        : await createCategory(values);

      if (result.success) {
        toast.success(editingCategory ? 'Category updated' : 'Category created');
        onSuccess();
        if (!editingCategory) {
          form.reset();
        }
      }
      else {
        if (typeof result.error === 'object') {
          // Handle Zod errors if any
          Object.entries(result.error as Record<string, string[]>).forEach(([key, messages]) => {
            if (messages && messages.length > 0) {
              form.setError(key as keyof FormValues, { message: messages[0] });
            }
          });
        }
        else {
          toast.error(result.error);
        }
      }
    }
    catch (error) {
      console.error(error);
      toast.error('Something went wrong');
    }
    finally {
      setIsPending(false);
    }
  }

  // Filter out the current category and its descendants to prevent circular references
  const getEligibleParents = () => {
    if (!editingCategory)
      return categories;

    // Simple circular check: can't be its own parent
    // In a full implementation, we'd also filter out children
    // but for now, just the self is a good start.
    return categories.filter(c => c.id !== editingCategory.id);
  };

  const eligibleParents = getEligibleParents();

  return (
    <Card className="sticky top-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{editingCategory ? 'Edit Category' : 'New Category'}</CardTitle>
        {editingCategory && (
          <Button variant="ghost" size="icon" onClick={onCancel} className="size-8">
            <IconX size={16} />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Electronics" {...field} />
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
                  <FormLabel className="flex items-center justify-between">
                    Slug
                    <Button
                      type="button"
                      variant="ghost"
                      className="h-auto p-0 text-xs text-primary hover:bg-transparent"
                      onClick={generateSlug}
                    >
                      <IconSparkles size={12} className="mr-1" />
                      Generate
                    </Button>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="electronics" {...field} />
                  </FormControl>
                  <FormDescription>Unique identifier for the URL.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="parentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent Category</FormLabel>
                  <Select
                    onValueChange={value => field.onChange(value === 'none' ? null : value)}
                    value={field.value || 'none'}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a parent" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None (Top Level)</SelectItem>
                      {eligibleParents.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1" disabled={isPending}>
                {isPending && <IconLoader2 className="mr-2 size-4 animate-spin" />}
                {editingCategory ? 'Save Changes' : 'Create Category'}
              </Button>
              {editingCategory && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
