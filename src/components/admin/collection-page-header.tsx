import { ArrowLeft, Library } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface CollectionPageHeaderProps {
  title: string;
  description: string;
  className?: string;
}

export function CollectionPageHeader({ title, description, className }: CollectionPageHeaderProps) {
  return (
    <div className={className ?? 'flex items-center gap-4'}>
      <Button variant="ghost" size="icon" asChild>
        <Link href="/admin/collections">
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </Button>
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Library className="text-primary h-6 w-6" />
          {title}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {description}
        </p>
      </div>
    </div>
  );
}
