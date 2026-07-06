'use client';

import { IconEdit, IconPlus, IconSearch, IconSparkles, IconTrash } from '@tabler/icons-react';
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
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { applyFormFieldErrors } from '@/lib/forms';

export function slugifyValue(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-{2,}/g, '-');
}

interface AttributeToolbarProps {
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onAdd?: () => void;
  addLabel?: string;
  searchWidthClassName?: string;
}

export function AttributeToolbar({
  searchPlaceholder,
  searchValue,
  onSearchChange,
  onAdd,
  addLabel,
  searchWidthClassName = 'max-w-sm',
}: AttributeToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-6 bg-surface/30 p-6 rounded-2xl border border-border-subtle backdrop-blur-sm">
      <div className={`relative flex-1 ${searchWidthClassName} group`}>
        <IconSearch className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-text-secondary group-focus-within:text-accent transition-colors" />
        <Input
          placeholder={searchPlaceholder}
          className="pl-11 bg-background/50 border-border-subtle rounded-full h-11 focus:ring-accent/20 focus:border-accent/40 transition-all placeholder:text-text-secondary/50 placeholder:font-light"
          value={searchValue}
          onChange={e => onSearchChange(e.target.value)}
        />
      </div>
      {onAdd && addLabel && (
        <Button
          onClick={onAdd}
          className="bg-accent text-white hover:bg-accent/90 rounded-full px-8 font-bold tracking-widest uppercase text-[10px] shadow-soft shadow-accent/20 h-11 transition-all hover:-translate-y-0.5"
        >
          <IconPlus className="mr-2 size-3.5" strokeWidth={3} />
          {addLabel}
        </Button>
      )}
    </div>
  );
}

export function AttributeRowActions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex justify-end gap-2">
      <Button variant="ghost" size="icon" onClick={onEdit}>
        <IconEdit size={16} />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="text-destructive hover:bg-destructive/10"
        onClick={onDelete}
      >
        <IconTrash size={16} />
      </Button>
    </div>
  );
}

interface AttributeSlugFieldProps {
  control: any;
  placeholder: string;
  onGenerate: () => void;
}

export function AttributeSlugField({
  control,
  placeholder,
  onGenerate,
}: AttributeSlugFieldProps) {
  return (
    <FormField
      control={control}
      name="slug"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center justify-between">
            Slug
            <Button
              type="button"
              variant="ghost"
              className="h-auto p-0 text-xs text-primary hover:bg-transparent"
              onClick={onGenerate}
            >
              <IconSparkles size={12} className="mr-1" />
              Generate
            </Button>
          </FormLabel>
          <FormControl>
            <Input placeholder={placeholder} {...field} />
          </FormControl>
          <FormDescription>Unique URL-friendly identifier.</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

interface AttributeDialogFooterProps {
  isSubmitting: boolean;
  submitLabel: string;
  onCancel: () => void;
}

export function AttributeDialogFooter({ isSubmitting, submitLabel, onCancel }: AttributeDialogFooterProps) {
  return (
    <div className="flex gap-2 pt-4">
      <Button type="submit" className="flex-1" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : submitLabel}
      </Button>
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancel
      </Button>
    </div>
  );
}

export function filterByNameAndSlug<T extends { name?: string; label?: string; slug: string }>(items: T[], searchQuery: string) {
  const query = searchQuery.toLowerCase();
  return items.filter((item) => {
    const primary = 'name' in item ? item.name : item.label;
    return primary?.toLowerCase().includes(query) || item.slug.toLowerCase().includes(query);
  });
}

export function applyFieldErrors<TFieldValues extends string>(
  form: { setError: (name: TFieldValues, error: { message: string }) => void },
  error: unknown,
) {
  return applyFormFieldErrors(form, error);
}

interface AttributeDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description: string;
  isDeleting: boolean;
  confirmLabel: string;
  onConfirm: () => void;
}

export function AttributeDeleteDialog({
  open,
  onOpenChange,
  title = 'Are you sure?',
  description,
  isDeleting,
  confirmLabel,
  onConfirm,
}: AttributeDeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(event) => {
              event.preventDefault();
              onConfirm();
            }}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? 'Deleting...' : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
