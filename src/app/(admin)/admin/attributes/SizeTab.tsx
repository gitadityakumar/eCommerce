'use client';

// fallow-ignore-file code-duplication

import type * as z from 'zod';
import type { SelectSize } from '@/lib/db/schema/filters/sizes';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { createSize, deleteSize, updateSize } from '@/actions/attributes';
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
    if (!editingSize && !dirtyFields.slug) {
      form.setValue('slug', slugifyValue(name || ''), { shouldValidate: true });
    }
  }, [name, form, editingSize, dirtyFields.slug]);

  const filteredData = filterByNameAndSlug(initialData, searchQuery);

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
        if (!applyFieldErrors(form, result.error)) {
          toast.error(typeof result.error === 'string' ? result.error : 'Something went wrong');
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
    form.setValue('slug', slugifyValue(name), { shouldValidate: true });
  };

  return (
    <div className="space-y-4">
      <AttributeToolbar
        searchPlaceholder="Search dimensional scales..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        onAdd={() => {
          setEditingSize(null);
          form.reset({ name: '', slug: '', sortOrder: 0 });
          setIsOpen(true);
        }}
        addLabel="Instate Scale"
      />

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
                        <AttributeRowActions onEdit={() => handleEdit(size)} onDelete={() => setSizeToDelete(size.id)} />
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

                <AttributeSlugField control={form.control} placeholder="large" onGenerate={generateSlug} />

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

                <AttributeDialogFooter
                  isSubmitting={form.formState.isSubmitting}
                  submitLabel={editingSize ? 'Save Changes' : 'Create Size'}
                  onCancel={() => setIsOpen(false)}
                />
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>

      <AttributeDeleteDialog
        open={!!sizeToDelete}
        onOpenChange={open => !open && setSizeToDelete(null)}
        description="This size will be permanently deleted. Products using this size might be affected."
        isDeleting={isDeleting}
        confirmLabel="Delete Size"
        onConfirm={handleDelete}
      />
    </div>
  );
}
