'use client';

// fallow-ignore-file code-duplication

import type * as z from 'zod';
import type { SelectBrand } from '@/lib/db/schema/brands';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { createBrand, deleteBrand, updateBrand } from '@/actions/attributes';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { insertBrandSchema } from '@/lib/db/schema/brands';
import {
  applyFieldErrors,
  AttributeDeleteDialog,
  AttributeDialogFooter,
  AttributeRowActions,
  AttributeSlugField,
  AttributeToolbar,
  filterByNameAndSlug,
  slugifyValue,
} from './_shared';

type FormValues = z.infer<typeof insertBrandSchema>;

interface BrandTabProps {
  initialData: SelectBrand[];
  canManage?: boolean;
}

export function BrandTab({ canManage = false, initialData }: BrandTabProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<SelectBrand | null>(null);
  const [brandToDelete, setBrandToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(insertBrandSchema),
    defaultValues: {
      name: '',
      slug: '',
      logoUrl: '',
    },
  });

  const name = form.watch('name');
  const { dirtyFields } = form.formState;

  useEffect(() => {
    if (!editingBrand && !dirtyFields.slug) {
      form.setValue('slug', slugifyValue(name || ''), { shouldValidate: true });
    }
  }, [name, form, editingBrand, dirtyFields.slug]);

  const filteredData = filterByNameAndSlug(initialData, searchQuery);

  const onSubmit = async (values: FormValues) => {
    try {
      const result = editingBrand
        ? await updateBrand(editingBrand.id, values)
        : await createBrand(values);

      if (result.success) {
        toast.success(editingBrand ? 'Brand updated' : 'Brand created');
        setIsOpen(false);
        setEditingBrand(null);
        form.reset();
        router.refresh();
      }
      else {
        if (!applyFieldErrors(form, result.error)) {
          toast.error(typeof result.error === 'string' ? result.error : 'Something went wrong');
        }
      }
    }
    catch {
      toast.error('Something went wrong');
    }
  };

  const handleEdit = (brand: SelectBrand) => {
    setEditingBrand(brand);
    form.reset({
      name: brand.name,
      slug: brand.slug,
      logoUrl: brand.logoUrl || '',
    });
    setIsOpen(true);
  };

  const handleDelete = async () => {
    if (!brandToDelete)
      return;
    setIsDeleting(true);
    try {
      const result = await deleteBrand(brandToDelete);
      if (result.success) {
        toast.success('Brand deleted');
        router.refresh();
      }
      else {
        toast.error(result.error);
      }
    }
    catch {
      toast.error('Failed to delete brand');
    }
    finally {
      setIsDeleting(false);
      setBrandToDelete(null);
    }
  };

  const generateSlug = () => {
    const name = form.getValues('name');
    if (!name)
      return;
    form.setValue('slug', slugifyValue(name), { shouldValidate: true });
  };

  return (
    <div className="space-y-4">
      <AttributeToolbar
        searchPlaceholder="Search archival houses..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        onAdd={canManage
          ? () => {
              setEditingBrand(null);
              form.reset({ name: '', slug: '', logoUrl: '' });
              setIsOpen(true);
            }
          : undefined}
        addLabel={canManage ? 'Instate House' : undefined}
      />

      <div className="rounded-2xl border border-border-subtle bg-surface/50 overflow-hidden shadow-soft">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Logo</TableHead>
              {canManage && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0
              ? (
                  <TableRow>
                    <TableCell colSpan={canManage ? 4 : 3} className="h-24 text-center">
                      No brands found.
                    </TableCell>
                  </TableRow>
                )
              : (
                  filteredData.map(brand => (
                    <TableRow key={brand.id}>
                      <TableCell className="font-medium">{brand.name}</TableCell>
                      <TableCell className="font-mono text-xs">{brand.slug}</TableCell>
                      <TableCell className="text-xs text-muted-foreground truncate max-w-xs">
                        {brand.logoUrl
                          ? (
                              <a
                                href={brand.logoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block hover:opacity-80 transition-opacity"
                                title={brand.logoUrl}
                              >
                                <Image
                                  src={brand.logoUrl}
                                  alt={`${brand.name} logo`}
                                  width={32}
                                  height={32}
                                  className="size-8 object-contain rounded border"
                                  unoptimized
                                  onError={(e) => {
                                    // Fallback to text if image fails to load
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    const parent = target.parentElement;
                                    if (parent) {
                                      parent.textContent = brand.logoUrl || '—';
                                      parent.className = 'text-xs text-muted-foreground';
                                    }
                                  }}
                                />
                              </a>
                            )
                          : (
                              '—'
                            )}
                      </TableCell>
                      {canManage && (
                        <TableCell className="text-right">
                          <AttributeRowActions onEdit={() => handleEdit(brand)} onDelete={() => setBrandToDelete(brand.id)} />
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingBrand ? 'Edit Brand' : 'Add New Brand'}</DialogTitle>
            <DialogDescription>
              {editingBrand
                ? 'Update the details of your brand.'
                : 'Create a new brand for your products.'}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Nike" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <AttributeSlugField control={form.control} placeholder="nike" onGenerate={generateSlug} />

                <FormField
                  control={form.control}
                  name="logoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Logo URL (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/logo.png" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormDescription>URL to the brand logo image.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <AttributeDialogFooter
                  isSubmitting={form.formState.isSubmitting}
                  submitLabel={editingBrand ? 'Save Changes' : 'Create Brand'}
                  onCancel={() => setIsOpen(false)}
                />
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>

      <AttributeDeleteDialog
        open={!!brandToDelete}
        onOpenChange={open => !open && setBrandToDelete(null)}
        description="This brand will be permanently deleted. Products using this brand might be affected."
        isDeleting={isDeleting}
        confirmLabel="Delete Brand"
        onConfirm={handleDelete}
      />
    </div>
  );
}
