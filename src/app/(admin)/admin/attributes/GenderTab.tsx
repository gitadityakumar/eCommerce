'use client';

import type * as z from 'zod';
import type { SelectGender } from '@/lib/db/schema/filters/genders';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconEdit, IconLoader2, IconPlus, IconSearch, IconSparkles, IconTrash } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { createGender, deleteGender, updateGender } from '@/actions/attributes';
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
import { insertGenderSchema } from '@/lib/db/schema/filters/genders';

type FormValues = z.infer<typeof insertGenderSchema>;

interface GenderTabProps {
  initialData: SelectGender[];
}

export function GenderTab({ initialData }: GenderTabProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [editingGender, setEditingGender] = useState<SelectGender | null>(null);
  const [genderToDelete, setGenderToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(insertGenderSchema),
    defaultValues: {
      label: '',
      slug: '',
    },
  });

  const label = form.watch('label');
  const { dirtyFields } = form.formState;

  useEffect(() => {
    if (editingGender)
      return;

    if (!dirtyFields.slug) {
      const generatedSlug = (label || '')
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-{2,}/g, '-');
      form.setValue('slug', generatedSlug, { shouldValidate: true });
    }
  }, [label, form, editingGender, dirtyFields.slug]);

  const filteredData = initialData.filter(
    item =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase())
      || item.slug.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const onSubmit = async (values: FormValues) => {
    try {
      const result = editingGender
        ? await updateGender(editingGender.id, values)
        : await createGender(values);

      if (result.success) {
        toast.success(editingGender ? 'Gender updated' : 'Gender created');
        setIsOpen(false);
        setEditingGender(null);
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

  const handleEdit = (gender: SelectGender) => {
    setEditingGender(gender);
    form.reset({
      label: gender.label,
      slug: gender.slug,
    });
    setIsOpen(true);
  };

  const handleDelete = async () => {
    if (!genderToDelete)
      return;
    setIsDeleting(true);
    try {
      const result = await deleteGender(genderToDelete);
      if (result.success) {
        toast.success('Gender deleted');
        router.refresh();
      }
      else {
        toast.error(result.error);
      }
    }
    catch {
      toast.error('Failed to delete gender');
    }
    finally {
      setIsDeleting(false);
      setGenderToDelete(null);
    }
  };

  const generateSlug = () => {
    const label = form.getValues('label');
    if (!label)
      return;
    const slug = label
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
            placeholder="Search genders..."
            className="pl-9"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={() => {
          setEditingGender(null);
          form.reset({ label: '', slug: '' });
          setIsOpen(true);
        }}
        >
          <IconPlus className="mr-2 size-4" />
          Add Gender
        </Button>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Label</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0
              ? (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">
                      No genders found.
                    </TableCell>
                  </TableRow>
                )
              : (
                  filteredData.map(gender => (
                    <TableRow key={gender.id}>
                      <TableCell className="font-medium">{gender.label}</TableCell>
                      <TableCell className="font-mono text-xs">{gender.slug}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(gender)}>
                            <IconEdit size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() => setGenderToDelete(gender.id)}
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
            <DialogTitle>{editingGender ? 'Edit Gender' : 'Add New Gender'}</DialogTitle>
            <DialogDescription>
              {editingGender
                ? 'Update the details of your gender attribute.'
                : 'Create a new gender attribute for your products.'}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="label"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Label</FormLabel>
                      <FormControl>
                        <Input placeholder="Unisex" {...field} />
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
                        <Input placeholder="unisex" {...field} />
                      </FormControl>
                      <FormDescription>Unique URL-friendly identifier.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting && <IconLoader2 className="mr-2 size-4 animate-spin" />}
                    {editingGender ? 'Save Changes' : 'Create Gender'}
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

      <AlertDialog open={!!genderToDelete} onOpenChange={open => !open && setGenderToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This gender will be permanently deleted. Products using this gender might be affected.
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
              {isDeleting ? 'Deleting...' : 'Delete Gender'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
