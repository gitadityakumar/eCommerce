'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { AddressForm } from './AddressForm';

export function AddAddressDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="rounded-full bg-accent text-white font-bold text-[10px] tracking-[0.2em] uppercase hover:bg-accent/90 shadow-soft transition-all duration-500 py-6 px-10 h-auto flex items-center gap-2 group">
          <Plus size={14} className="group-hover:rotate-90 transition-transform duration-500" />
          New Coordinate
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl rounded-2xl border-border-subtle bg-background/95 backdrop-blur-xl p-8 overflow-y-auto max-h-[90vh]">
        <DialogHeader className="mb-8">
          <DialogTitle className="text-2xl font-playfair tracking-tight text-text-primary">Archive New Entry</DialogTitle>
          <DialogDescription className="text-xs uppercase tracking-widest font-light text-text-secondary">
            Define the architectural specifics of your new location.
          </DialogDescription>
        </DialogHeader>
        <AddressForm />
      </DialogContent>
    </Dialog>
  );
}
