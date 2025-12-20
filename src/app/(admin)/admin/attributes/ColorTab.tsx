'use client';

import type * as z from 'zod';
import type { SelectColor } from '@/lib/db/schema/filters/colors';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconEdit, IconLoader2, IconPlus, IconSearch, IconSparkles, IconTrash } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { createColor, deleteColor, updateColor } from '@/actions/attributes';
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
import { insertColorSchema } from '@/lib/db/schema/filters/colors';

type FormValues = z.infer<typeof insertColorSchema>;

interface ColorTabProps {
  initialData: SelectColor[];
}

export function ColorTab({ initialData }: ColorTabProps) {
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
    if (editingColor)
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
  }, [name, form, editingColor, dirtyFields.slug]);

  const filteredData = initialData.filter(
    item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
      || item.slug.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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
        if (typeof result.error === 'object') {
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
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search colors..."
            className="pl-9"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={() => {
          setEditingColor(null);
          form.reset({ name: '', slug: '', hexCode: '#000000' });
          setIsOpen(true);
        }}
        >
          <IconPlus className="mr-2 size-4" />
          Add Color
        </Button>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Preview</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Hex Code</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0
              ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
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
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(color)}>
                            <IconEdit size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() => setColorToDelete(color.id)}
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
                        <Input placeholder="navy-blue" {...field} />
                      </FormControl>
                      <FormDescription>Unique URL-friendly identifier.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting && <IconLoader2 className="mr-2 size-4 animate-spin" />}
                    {editingColor ? 'Save Changes' : 'Create Color'}
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

      <AlertDialog open={!!colorToDelete} onOpenChange={open => !open && setColorToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This color will be permanently deleted. Products using this color might be affected.
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
              {isDeleting ? 'Deleting...' : 'Delete Color'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
