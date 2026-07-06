'use client';

// fallow-ignore-file code-duplication

import type * as z from 'zod';
import type { SelectGender } from '@/lib/db/schema/filters/genders';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { createGender, deleteGender, updateGender } from '@/actions/attributes';
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
import {
  applyFieldErrors,
  AttributeDeleteDialog,
  AttributeDialogFooter,
  AttributeRowActions,
  AttributeSlugField,
  AttributeToolbar,
  slugifyValue,
} from './_shared';

type FormValues = z.infer<typeof insertGenderSchema>;

interface GenderTabProps {
  initialData: SelectGender[];
  canManage?: boolean;
}

export function GenderTab({ canManage = false, initialData }: GenderTabProps) {
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
    if (!editingGender && !dirtyFields.slug) {
      form.setValue('slug', slugifyValue(label || ''), { shouldValidate: true });
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
        if (!applyFieldErrors(form, result.error)) {
          toast.error(typeof result.error === 'string' ? result.error : 'Something went wrong');
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
    form.setValue('slug', slugifyValue(label), { shouldValidate: true });
  };

  return (
    <div className="space-y-4">
      <AttributeToolbar
        searchPlaceholder="Search archetypes..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        onAdd={canManage
          ? () => {
              setEditingGender(null);
              form.reset({ label: '', slug: '' });
              setIsOpen(true);
            }
          : undefined}
        addLabel={canManage ? 'Instate Archetype' : undefined}
      />

      <div className="rounded-2xl border border-border-subtle bg-surface/50 overflow-hidden shadow-soft">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Label</TableHead>
              <TableHead>Slug</TableHead>
              {canManage && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0
              ? (
                  <TableRow>
                    <TableCell colSpan={canManage ? 3 : 2} className="h-24 text-center">
                      No genders found.
                    </TableCell>
                  </TableRow>
                )
              : (
                  filteredData.map(gender => (
                    <TableRow key={gender.id}>
                      <TableCell className="font-medium">{gender.label}</TableCell>
                      <TableCell className="font-mono text-xs">{gender.slug}</TableCell>
                      {canManage && (
                        <TableCell className="text-right">
                          <AttributeRowActions onEdit={() => handleEdit(gender)} onDelete={() => setGenderToDelete(gender.id)} />
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

                <AttributeSlugField control={form.control} placeholder="unisex" onGenerate={generateSlug} />

                <AttributeDialogFooter
                  isSubmitting={form.formState.isSubmitting}
                  submitLabel={editingGender ? 'Save Changes' : 'Create Gender'}
                  onCancel={() => setIsOpen(false)}
                />
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>

      <AttributeDeleteDialog
        open={!!genderToDelete}
        onOpenChange={open => !open && setGenderToDelete(null)}
        description="This gender will be permanently deleted. Products using this gender might be affected."
        isDeleting={isDeleting}
        confirmLabel="Delete Gender"
        onConfirm={handleDelete}
      />
    </div>
  );
}
