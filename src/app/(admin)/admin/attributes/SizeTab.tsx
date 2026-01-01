'use client';

import type * as z from 'zod';
import type { SelectSize } from '@/lib/db/schema/filters/sizes';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconEdit, IconLoader2, IconPlus, IconSearch, IconSparkles, IconTrash } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { createSize, deleteSize, updateSize } from '@/actions/attributes';
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
import { insertSizeSchema } from '@/lib/db/schema/filters/sizes';

type FormValues = z.infer<typeof insertSizeSchema>;

interface SizeTabProps {
  initialData: SelectSize[];
}

export function SizeTab({ initialData }: SizeTabProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [editingSize, setEditingSize] = useState<SelectSize | null>(null);
  const [sizeToDelete, setSizeToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(insertSizeSchema),
    defaultValues: {
      name: '',
      slug: '',
      sortOrder: 0,
    },
  });

  const name = form.watch('name');
  const { dirtyFields } = form.formState;

  useEffect(() => {
    if (editingSize)
      return;

    // Only auto-generate if the slug field hasn't been manually touched
    if (!dirtyFields.slug) {
      const generatedSlug = (name || '')
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-{2,}/g, '-');
      form.setValue('slug', generatedSlug, { shouldValidate: true });
    }
  }, [name, form, editingSize, dirtyFields.slug]);

  const filteredData = initialData.filter(
    item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
      || item.slug.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const onSubmit = async (values: FormValues) => {
    try {
      const result = editingSize
        ? await updateSize(editingSize.id, values)
        : await createSize(values);

      if (result.success) {
        toast.success(editingSize ? 'Size updated' : 'Size created');
        setIsOpen(false);
        setEditingSize(null);
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

  const handleEdit = (size: SelectSize) => {
    setEditingSize(size);
    form.reset({
      name: size.name,
      slug: size.slug,
      sortOrder: size.sortOrder,
    });
    setIsOpen(true);
  };

  const handleDelete = async () => {
    if (!sizeToDelete)
      return;
    setIsDeleting(true);
    try {
      const result = await deleteSize(sizeToDelete);
      if (result.success) {
        toast.success('Size deleted');
        router.refresh();
      }
      else {
        toast.error(result.error);
      }
    }
    catch {
      toast.error('Failed to delete size');
    }
    finally {
      setIsDeleting(false);
      setSizeToDelete(null);
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
            placeholder="Search dimensional scales..."
            className="pl-11 bg-background/50 border-border-subtle rounded-full h-11 focus:ring-accent/20 focus:border-accent/40 transition-all placeholder:text-text-secondary/50 placeholder:font-light"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <Button
          onClick={() => {
            setEditingSize(null);
            form.reset({ name: '', slug: '', sortOrder: 0 });
            setIsOpen(true);
          }}
          className="bg-accent text-white hover:bg-accent/90 rounded-full px-8 font-bold tracking-widest uppercase text-[10px] shadow-soft shadow-accent/20 h-11 transition-all hover:-translate-y-0.5"
        >
          <IconPlus className="mr-2 size-3.5" strokeWidth={3} />
          Instate Scale
        </Button>
      </div>

      <div className="rounded-2xl border border-border-subtle bg-surface/50 overflow-hidden shadow-soft">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0
              ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No sizes found.
                    </TableCell>
                  </TableRow>
                )
              : (
                  filteredData.map(size => (
                    <TableRow key={size.id}>
                      <TableCell className="font-mono">{size.sortOrder}</TableCell>
                      <TableCell className="font-medium">{size.name}</TableCell>
                      <TableCell className="font-mono text-xs">{size.slug}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(size)}>
                            <IconEdit size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() => setSizeToDelete(size.id)}
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
            <DialogTitle>{editingSize ? 'Edit Size' : 'Add New Size'}</DialogTitle>
            <DialogDescription>
              {editingSize
                ? 'Update the details of your size attribute.'
                : 'Create a new size attribute for your products.'}
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
                        <Input placeholder="Large" {...field} />
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
                        <Input placeholder="large" {...field} />
                      </FormControl>
                      <FormDescription>Unique URL-friendly identifier.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sortOrder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sort Order</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          {...field}
                          onChange={e => field.onChange(Number.parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription>Used for ordering sizes in the UI.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting && <IconLoader2 className="mr-2 size-4 animate-spin" />}
                    {editingSize ? 'Save Changes' : 'Create Size'}
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

      <AlertDialog open={!!sizeToDelete} onOpenChange={open => !open && setSizeToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This size will be permanently deleted. Products using this size might be affected.
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
              {isDeleting ? 'Deleting...' : 'Delete Size'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
