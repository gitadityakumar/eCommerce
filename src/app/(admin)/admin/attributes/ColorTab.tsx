'use client';

// fallow-ignore-file code-duplication

import type * as z from 'zod';
import type { SelectColor } from '@/lib/db/schema/filters/colors';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { createColor, deleteColor, updateColor } from '@/actions/attributes';
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
import { insertColorSchema } from '@/lib/db/schema/filters/colors';
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

type FormValues = z.infer<typeof insertColorSchema>;

interface ColorTabProps {
  initialData: SelectColor[];
  canManage?: boolean;
}

export function ColorTab({ canManage = false, initialData }: ColorTabProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [editingColor, setEditingColor] = useState<SelectColor | null>(null);
  const [colorToDelete, setColorToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(insertColorSchema),
    defaultValues: {
      name: '',
      slug: '',
      hexCode: '#000000',
    },
  });

  const name = form.watch('name');
  const { dirtyFields } = form.formState;

  useEffect(() => {
    if (!editingColor && !dirtyFields.slug) {
      form.setValue('slug', slugifyValue(name || ''), { shouldValidate: true });
    }
  }, [name, form, editingColor, dirtyFields.slug]);

  const filteredData = filterByNameAndSlug(initialData, searchQuery);

  const onSubmit = async (values: FormValues) => {
    try {
      const result = editingColor
        ? await updateColor(editingColor.id, values)
        : await createColor(values);

      if (result.success) {
        toast.success(editingColor ? 'Color updated' : 'Color created');
        setIsOpen(false);
        setEditingColor(null);
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

  const handleEdit = (color: SelectColor) => {
    setEditingColor(color);
    form.reset({
      name: color.name,
      slug: color.slug,
      hexCode: color.hexCode,
    });
    setIsOpen(true);
  };

  const handleDelete = async () => {
    if (!colorToDelete)
      return;
    setIsDeleting(true);
    try {
      const result = await deleteColor(colorToDelete);
      if (result.success) {
        toast.success('Color deleted');
        router.refresh();
      }
      else {
        toast.error(result.error);
      }
    }
    catch {
      toast.error('Failed to delete color');
    }
    finally {
      setIsDeleting(false);
      setColorToDelete(null);
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
        searchPlaceholder="Filter chromatic spectrum..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        onAdd={canManage
          ? () => {
              setEditingColor(null);
              form.reset({ name: '', slug: '', hexCode: '#000000' });
              setIsOpen(true);
            }
          : undefined}
        addLabel={canManage ? 'Introduce Hue' : undefined}
        searchWidthClassName="max-w-md"
      />

      <div className="rounded-2xl border border-border-subtle bg-surface/50 overflow-hidden shadow-soft">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Preview</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Hex Code</TableHead>
              {canManage && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0
              ? (
                  <TableRow>
                    <TableCell colSpan={canManage ? 5 : 4} className="h-24 text-center">
                      No colors found.
                    </TableCell>
                  </TableRow>
                )
              : (
                  filteredData.map(color => (
                    <TableRow key={color.id}>
                      <TableCell>
                        <div
                          className="size-8 rounded-full border shadow-sm"
                          style={{ backgroundColor: color.hexCode }}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{color.name}</TableCell>
                      <TableCell className="font-mono text-xs">{color.slug}</TableCell>
                      <TableCell className="font-mono text-xs uppercase">{color.hexCode}</TableCell>
                      {canManage && (
                        <TableCell className="text-right">
                          <AttributeRowActions onEdit={() => handleEdit(color)} onDelete={() => setColorToDelete(color.id)} />
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
            <DialogTitle>{editingColor ? 'Edit Color' : 'Add New Color'}</DialogTitle>
            <DialogDescription>
              {editingColor
                ? 'Update the details of your color attribute.'
                : 'Create a new color attribute for your products.'}
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
                        <Input placeholder="Navy Blue" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <AttributeSlugField control={form.control} placeholder="navy-blue" onGenerate={generateSlug} />

                <FormField
                  control={form.control}
                  name="hexCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hex Code</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input placeholder="#000000" {...field} className="font-mono" />
                        </FormControl>
                        <div className="relative size-10 overflow-hidden rounded-md border shrink-0">
                          <input
                            type="color"
                            value={field.value}
                            onChange={e => field.onChange(e.target.value)}
                            className="absolute inset-0 size-full cursor-pointer opacity-0"
                          />
                          <div
                            className="size-full"
                            style={{ backgroundColor: field.value }}
                          />
                        </div>
                      </div>
                      <FormDescription>Choose a color or enter hex code.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <AttributeDialogFooter
                  isSubmitting={form.formState.isSubmitting}
                  submitLabel={editingColor ? 'Save Changes' : 'Create Color'}
                  onCancel={() => setIsOpen(false)}
                />
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>

      <AttributeDeleteDialog
        open={!!colorToDelete}
        onOpenChange={open => !open && setColorToDelete(null)}
        description="This color will be permanently deleted. Products using this color might be affected."
        isDeleting={isDeleting}
        confirmLabel="Delete Color"
        onConfirm={handleDelete}
      />
    </div>
  );
}
