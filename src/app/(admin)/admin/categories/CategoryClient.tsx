'use client';

import type { SelectCategory } from '@/lib/db/schema/categories';
import { IconLayoutList, IconSearch } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { deleteCategory } from '@/actions/categories';
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
import { Input } from '@/components/ui/input';
import { CategoryForm } from './CategoryForm';
import { CategoryList } from './CategoryList';

interface CategoryClientProps {
  initialCategories: SelectCategory[];
}

export function CategoryClient({ initialCategories }: CategoryClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState('');
  const [editingCategory, setEditingCategory] = useState<SelectCategory | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!categoryToDelete)
      return;

    setIsDeleting(true);
    try {
      const result = await deleteCategory(categoryToDelete);
      if (result.success) {
        toast.success('Category deleted');
        router.refresh();
      }
      else {
        toast.error(result.error);
      }
    }
    catch {
      toast.error('Failed to delete category');
    }
    finally {
      setIsDeleting(false);
      setCategoryToDelete(null);
    }
  };

  const handleEdit = (category: SelectCategory) => {
    setEditingCategory(category);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
  };

  const handleSuccess = () => {
    setEditingCategory(null);
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-surface/50 p-8 rounded-2xl border border-border-subtle shadow-soft backdrop-blur-md transition-all duration-500">
        <div>
          <h1 className="text-4xl font-light tracking-tighter text-text-primary font-playfair italic flex items-center gap-3">
            <IconLayoutList className="text-accent size-8" strokeWidth={1.5} />
            Categories Management
          </h1>
          <p className="text-sm text-text-secondary mt-2 font-light tracking-tight">
            Curate your taxonomy with editorial precision.
          </p>
        </div>

        <div className="relative w-full md:w-80 group">
          <IconSearch className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-text-secondary group-focus-within:text-accent transition-colors" />
          <Input
            placeholder="Search silhouettes..."
            className="pl-11 bg-background/50 border-border-subtle rounded-full h-11 focus:ring-accent/20 focus:border-accent/40 transition-all placeholder:text-text-secondary/50 placeholder:font-light"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6 items-start">
        <div className={`space-y-4 ${isPending ? 'opacity-50 transition-opacity' : 'transition-opacity'}`}>
          <CategoryList
            categories={initialCategories}
            onEdit={handleEdit}
            onDelete={setCategoryToDelete}
            searchQuery={searchQuery}
          />
        </div>

        <div className="lg:block">
          <CategoryForm
            categories={initialCategories}
            editingCategory={editingCategory}
            onSuccess={handleSuccess}
            onCancel={handleCancelEdit}
          />
        </div>
      </div>

      <AlertDialog open={!!categoryToDelete} onOpenChange={open => !open && setCategoryToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. All sub-categories will become top-level categories if they exist.
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
              {isDeleting ? 'Deleting...' : 'Delete Category'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
