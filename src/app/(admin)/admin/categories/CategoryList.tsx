"use client";

import { SelectCategory } from "@/lib/db/schema/categories";
import { 
  IconEdit, 
  IconTrash, 
  IconChevronRight, 
  IconChevronDown,
  IconFolder,
  IconFolderOpen
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

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
      .filter((item) => item.parentId === parentId)
      .map((item) => ({
        ...item,
        children: buildTree(list, item.id),
      }));
  };

  const fullTree = buildTree(categories);

  // Filter tree based on search query
  const filterTree = (tree: CategoryWithChildren[]): CategoryWithChildren[] => {
    if (!searchQuery) return tree;

    return tree
      .map((node) => ({
        ...node,
        children: filterTree(node.children || []),
      }))
      .filter(
        (node) =>
          node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          node.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (node.children && node.children.length > 0)
      );
  };

  const filteredTree = filterTree(fullTree);

  if (filteredTree.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed rounded-lg bg-muted/50">
        <IconFolder className="size-12 mb-4 text-muted-foreground" />
        <h3 className="text-lg font-medium">No categories found</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {searchQuery ? "Try searching for something else." : "Get started by creating your first category."}
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y border rounded-lg overflow-hidden bg-card">
      <div className="grid grid-cols-[1fr_200px_120px] gap-4 p-4 font-medium bg-muted/50 text-sm">
        <div>Name</div>
        <div>Slug</div>
        <div className="text-right">Actions</div>
      </div>
      <div className="divide-y">
        {filteredTree.map((node) => (
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
    <div className="bg-card hover:bg-muted/30 transition-colors">
      <div className="grid grid-cols-[1fr_200px_120px] gap-4 p-4 text-sm items-center">
        <div className="flex items-center gap-2" style={{ paddingLeft: `${level * 24}px` }}>
          {hasChildren ? (
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 hover:bg-muted rounded text-muted-foreground"
            >
              {isExpanded ? <IconChevronDown size={16} /> : <IconChevronRight size={16} />}
            </button>
          ) : (
            <div className="w-6" /> // Spacer
          )}
          {hasChildren ? (
            isExpanded ? <IconFolderOpen size={18} className="text-primary" /> : <IconFolder size={18} className="text-primary" />
          ) : (
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
          {node.children!.map((child) => (
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
