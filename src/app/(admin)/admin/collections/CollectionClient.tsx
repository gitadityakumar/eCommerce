'use client';

import { Library, Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CollectionList } from './CollectionList';

interface Collection {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  productCount: number;
}

interface CollectionClientProps {
  initialCollections: Collection[];
  products: { id: string; name: string }[];
}

export function CollectionClient({ initialCollections }: CollectionClientProps) {
  const [isPending] = useTransition();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCollections = initialCollections.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-muted/30 p-6 rounded-lg border">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Library className="text-primary h-6 w-6" />
            Collections Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create and manage product collections for your store.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search collections..."
              className="pl-9"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <Button asChild className="gap-2">
            <Link href="/admin/collections/new">
              <Plus className="h-4 w-4" />
              Add Collection
            </Link>
          </Button>
        </div>
      </div>

      <div className={isPending ? 'opacity-50 pointer-events-none' : ''}>
        <CollectionList
          data={filteredCollections}
        />
      </div>
    </div>
  );
}
