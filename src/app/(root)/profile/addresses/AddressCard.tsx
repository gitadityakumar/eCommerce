'use client';

import { Building2, CheckCircle2, Home, Loader2, MapPin, Phone, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { deleteAddress, setDefaultAddress } from '@/actions/addresses';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface AddressCardProps {
  address: {
    id: string;
    type: 'shipping' | 'billing';
    line1: string;
    line2?: string | null;
    city: string;
    state: string;
    country: string;
    postalCode: string;

    phone: string;
    isDefault: boolean;
  };
}

export function AddressCard({ address }: AddressCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSettingDefault, setIsSettingDefault] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteAddress(address.id);
      if (result.success) {
        toast.success('Address removed from your archive');
      }
      else {
        toast.error(result.error || 'Failed to remove address');
      }
    }
    catch {
      toast.error('An unexpected error occurred');
    }
    finally {
      setIsDeleting(false);
    }
  };

  const handleSetDefault = async () => {
    setIsSettingDefault(true);
    try {
      const result = await setDefaultAddress(address.id);
      if (result.success) {
        toast.success('Identity coordinate updated to primary');
      }
      else {
        toast.error(result.error || 'Failed to update priority');
      }
    }
    catch {
      toast.error('An unexpected error occurred');
    }
    finally {
      setIsSettingDefault(false);
    }
  };

  return (
    <div className="group p-8 border border-border-subtle/50 bg-surface/5 hover:bg-surface/10 hover:border-accent/30 transition-all duration-500 rounded-2xl relative overflow-hidden h-full flex flex-col">
      {address.isDefault && (
        <div className="absolute top-0 right-0 p-4">
          <Badge className="bg-accent/10 text-accent border-accent/20 text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full flex items-center gap-1.5 shadow-none">
            <CheckCircle2 size={12} />
            Primary
          </Badge>
        </div>
      )}

      <div className="flex items-start gap-4 mb-6">
        <div className="p-3 rounded-xl bg-accent/5 text-accent group-hover:bg-accent group-hover:text-white transition-all duration-500">
          {address.type === 'shipping' ? <Home size={20} /> : <Building2 size={20} />}
        </div>
        <div>
          <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-text-primary mb-1">
            {address.type}
            {' '}
            Coordinate
          </h3>
          <p className="text-[10px] text-text-secondary/60 font-medium tracking-widest uppercase italic">
            Journal Entry #
            {address.id.slice(0, 8)}
          </p>
        </div>
      </div>

      <div className="space-y-4 flex-1">
        <div className="flex items-start gap-3">
          <MapPin size={16} className="text-accent/40 mt-0.5 shrink-0" />
          <div className="space-y-1">
            <p className="text-sm font-semibold tracking-tight text-text-primary">{address.line1}</p>
            {address.line2 && <p className="text-sm text-text-secondary/80 font-light">{address.line2}</p>}
            <p className="text-sm text-text-secondary/80 font-light">
              {address.city}
              ,
              {address.state}
              {' '}
              {address.postalCode}
            </p>
            <p className="text-[10px] uppercase tracking-widest font-bold text-text-secondary/50 pt-1">
              {address.country}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Phone size={16} className="text-accent/40 shrink-0" />
          <p className="text-sm text-text-secondary/80 font-light tracking-wide">{address.phone}</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 mt-8 pt-6 border-t border-border-subtle/50">
        {!address.isDefault && (
          <Button
            variant="ghost"
            size="sm"
            disabled={isSettingDefault}
            onClick={handleSetDefault}
            className="text-[10px] uppercase tracking-widest font-bold text-text-secondary hover:text-accent hover:bg-transparent transition-colors p-0 h-auto"
          >
            {isSettingDefault ? <Loader2 size={14} className="animate-spin mr-2" /> : 'Set Primary'}
          </Button>
        )}
        <div className={address.isDefault ? 'w-full flex justify-end' : 'flex-1 flex justify-end'}>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                disabled={isDeleting}
                className="text-[10px] uppercase tracking-widest font-bold text-destructive hover:text-destructive hover:bg-destructive/5 transition-all px-3 py-1.5 h-auto rounded-lg flex items-center gap-2"
              >
                {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                Discard
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Address</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you certain you wish to remove this coordinate from your journal?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
