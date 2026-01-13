'use client';

import type * as z from 'zod';
import type { SelectBrand } from '@/lib/db/schema/brands';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconEdit, IconLoader2, IconPlus, IconSearch, IconSparkles, IconTrash } from '@tabler/icons-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { createBrand, deleteBrand, updateBrand } from '@/actions/attributes';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
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

type FormValues = z.infer<typeof insertBrandSchema>;

interface BrandTabProps {
  initialData: SelectBrand[];
}

export function BrandTab({ initialData }: BrandTabProps) {
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
    if (editingBrand)
      return;

    if (!dirtyFields.slug) {
      const generatedSlug = (name || '')
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-{2,}/g, '-');
      form.setValue('slug', generatedSlug, { shouldValidate: true });
    }
  }, [name, form, editingBrand, dirtyFields.slug]);

  const filteredData = initialData.filter(
    item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
      || item.slug.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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
        if (result.error && typeof result.error === 'object') {
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
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-{2,}/g, '-');
    form.setValue('slug', slug, { shouldValidate: true });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-6 bg-surface/30 p-6 rounded-2xl border border-border-subtle backdrop-blur-sm">
        <div className="relative flex-1 max-w-sm group">
          <IconSearch className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-text-secondary group-focus-within:text-accent transition-colors" />
          <Input
            placeholder="Search archival houses..."
            className="pl-11 bg-background/50 border-border-subtle rounded-full h-11 focus:ring-accent/20 focus:border-accent/40 transition-all placeholder:text-text-secondary/50 placeholder:font-light"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <Button
          onClick={() => {
            setEditingBrand(null);
            form.reset({ name: '', slug: '', logoUrl: '' });
            setIsOpen(true);
          }}
          className="bg-accent text-white hover:bg-accent/90 rounded-full px-8 font-bold tracking-widest uppercase text-[10px] shadow-soft shadow-accent/20 h-11 transition-all hover:-translate-y-0.5"
        >
          <IconPlus className="mr-2 size-3.5" strokeWidth={3} />
          Instate House
        </Button>
      </div>

      <div className="rounded-2xl border border-border-subtle bg-surface/50 overflow-hidden shadow-soft">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Logo</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0
              ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
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
                                      parent.innerHTML = brand.logoUrl || '—';
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
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(brand)}>
                            <IconEdit size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() => setBrandToDelete(brand.id)}
                          >
                            <IconTrash size={16} />
                          </Button>
                        </div>
                      </TableCell>
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
                        <Input placeholder="nike" {...field} />
                      </FormControl>
                      <FormDescription>Unique URL-friendly identifier.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting && <IconLoader2 className="mr-2 size-4 animate-spin" />}
                    {editingBrand ? 'Save Changes' : 'Create Brand'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!brandToDelete} onOpenChange={open => !open && setBrandToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This brand will be permanently deleted. Products using this brand might be affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete Brand'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
