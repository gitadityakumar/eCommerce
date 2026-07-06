'use client';

import { Library, Plus } from 'lucide-react';
import { useState, useTransition } from 'react';
import { AdminSearchHeader } from '@/components/admin/admin-search-header';
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
  canManage?: boolean;
}

export function CollectionClient({ canManage = false, initialCollections }: CollectionClientProps) {
  const [isPending] = useTransition();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCollections = initialCollections.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-6">
      <AdminSearchHeader
        icon={<Library className="text-accent size-8" strokeWidth={1.5} />}
        title="Collections Management"
        description="Organize your luxury pieces into curated stories."
        searchPlaceholder="Filter archives..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        addHref={canManage ? '/admin/collections/new' : undefined}
        addLabel={canManage ? 'Add Story' : undefined}
        addIcon={canManage ? <Plus className="size-3.5" strokeWidth={3} /> : undefined}
      />

      <div className={isPending ? 'opacity-50 pointer-events-none' : ''}>
        <CollectionList
          data={filteredCollections}
          canManage={canManage}
        />
      </div>
    </div>
  );
}
