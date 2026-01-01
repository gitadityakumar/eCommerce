'use client';

import type { SelectCategory } from '@/lib/db/schema/categories';
import {
  IconChevronDown,
  IconChevronRight,
  IconEdit,
  IconFolder,
  IconFolderOpen,
  IconTrash,
} from '@tabler/icons-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface CategoryWithChildren extends SelectCategory {
  children?: CategoryWithChildren[];
}

interface CategoryListProps {
  categories: SelectCategory[];
  onEdit: (category: SelectCategory) => void;
  onDelete: (id: string) => void;
  searchQuery: string;
}

export function CategoryList({ categories, onEdit, onDelete, searchQuery }: CategoryListProps) {
  // Build a tree from the flat list
  const buildTree = (list: SelectCategory[], parentId: string | null = null): CategoryWithChildren[] => {
    return list
      .filter(item => item.parentId === parentId)
      .map(item => ({
        ...item,
        children: buildTree(list, item.id),
      }));
  };

  const fullTree = buildTree(categories);

  // Filter tree based on search query
  const filterTree = (tree: CategoryWithChildren[]): CategoryWithChildren[] => {
    if (!searchQuery)
      return tree;

    return tree
      .map(node => ({
        ...node,
        children: filterTree(node.children || []),
      }))
      .filter(
        node =>
          node.name.toLowerCase().includes(searchQuery.toLowerCase())
          || node.slug.toLowerCase().includes(searchQuery.toLowerCase())
          || (node.children && node.children.length > 0),
      );
  };

  const filteredTree = filterTree(fullTree);

  if (filteredTree.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center border border-border-subtle border-dashed rounded-3xl bg-surface/30 backdrop-blur-sm shadow-soft">
        <div className="w-16 h-16 rounded-full bg-accent/5 flex items-center justify-center mb-6 shadow-soft transition-transform duration-500 hover:scale-110">
          <IconFolder className="size-8 text-accent/60" />
        </div>
        <h3 className="text-xl font-light tracking-tight text-text-primary font-playfair italic">No categories found</h3>
        <p className="text-sm text-text-secondary mt-2 max-w-xs font-light">
          {searchQuery ? 'Your search returned no results. Try another silhouette.' : 'Your archive is currently empty. Begin by adding a new collection category.'}
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border-subtle border border-border-subtle rounded-2xl overflow-hidden bg-surface shadow-soft transition-all duration-500">
      <div className="grid grid-cols-[1fr_200px_120px] gap-4 p-5 font-bold uppercase tracking-[0.2em] bg-accent/5 text-[9px] text-accent">
        <div>Category Identity</div>
        <div>Slug</div>
        <div className="text-right">Manage</div>
      </div>
      <div className="divide-y">
        {filteredTree.map(node => (
          <CategoryItem
            key={node.id}
            node={node}
            level={0}
            onEdit={onEdit}
            onDelete={onDelete}
            isSearching={!!searchQuery}
          />
        ))}
      </div>
    </div>
  );
}

interface CategoryItemProps {
  node: CategoryWithChildren;
  level: number;
  onEdit: (category: SelectCategory) => void;
  onDelete: (id: string) => void;
  isSearching: boolean;
}

function CategoryItem({ node, level, onEdit, onDelete, isSearching }: CategoryItemProps) {
  const [isExpanded, setIsExpanded] = useState(isSearching);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="bg-surface hover:bg-accent/5 transition-all duration-300">
      <div className="grid grid-cols-[1fr_200px_120px] gap-4 p-4 text-sm items-center">
        <div className="flex items-center gap-2" style={{ paddingLeft: `${level * 24}px` }}>
          {hasChildren
            ? (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1 hover:bg-muted rounded text-muted-foreground"
                >
                  {isExpanded ? <IconChevronDown size={16} /> : <IconChevronRight size={16} />}
                </button>
              )
            : (
                <div className="w-6" /> // Spacer
              )}
          {hasChildren
            ? (
                isExpanded ? <IconFolderOpen size={18} className="text-primary" /> : <IconFolder size={18} className="text-primary" />
              )
            : (
                <IconFolder size={18} className="text-muted-foreground/60" />
              )}
          <span className="font-medium">{node.name}</span>
        </div>
        <div className="text-muted-foreground font-mono text-xs">{node.slug}</div>
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => onEdit(node)}
          >
            <IconEdit size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => onDelete(node.id)}
          >
            <IconTrash size={16} />
          </Button>
        </div>
      </div>
      {hasChildren && isExpanded && (
        <div className="divide-y border-t bg-muted/5">
          {node.children!.map(child => (
            <CategoryItem
              key={child.id}
              node={child}
              level={level + 1}
              onEdit={onEdit}
              onDelete={onDelete}
              isSearching={isSearching}
            />
          ))}
        </div>
      )}
    </div>
  );
}
