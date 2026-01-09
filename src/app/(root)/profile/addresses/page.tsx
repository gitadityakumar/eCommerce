import { ArrowLeft, MapPin, Plus } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAddresses } from '@/actions/addresses';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { getCurrentUser } from '@/lib/auth/actions';
import { AddressCard } from './AddressCard';
import { AddressForm } from './AddressForm';

export const dynamic = 'force-dynamic';

export default async function AddressesPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/sign-in');
  }

  const userAddresses = await getAddresses();

  return (
    <div className="container max-w-6xl mx-auto py-12 px-4 space-y-12 animate-in fade-in duration-1000">
      {/* Header & Breadcrumbs */}
      <div className="space-y-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="text-[10px] uppercase tracking-[0.2em] hover:text-accent transition-colors">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="opacity-30" />
            <BreadcrumbItem>
              <BreadcrumbLink href="/profile" className="text-[10px] uppercase tracking-[0.2em] hover:text-accent transition-colors">Account</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="opacity-30" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent">Coordinates</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-5xl md:text-6xl font-playfair tracking-tight text-text-primary">Coordinates</h1>
            <p className="text-text-secondary font-light tracking-[0.05em] max-w-2xl text-sm md:text-base">
              Establish your global delivery points. Curate your collection of shipping and billing architectures.
            </p>
          </div>

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
        </div>
      </div>

      <div className="space-y-10">
        <div className="flex items-center gap-4">
          <div className="h-px bg-border-subtle flex-1" />
          <h2 className="text-[10px] uppercase tracking-[0.4em] font-bold text-accent flex items-center gap-2">
            <MapPin size={14} />
            Archived Locations
          </h2>
          <div className="h-px bg-border-subtle flex-1" />
        </div>

        {userAddresses.length === 0
          ? (
              <div className="py-24 text-center space-y-6 bg-surface/5 border border-dashed border-border-subtle rounded-3xl animate-in zoom-in-95 duration-700">
                <div className="flex justify-center">
                  <div className="p-6 rounded-full bg-accent/5 text-accent/30">
                    <MapPin size={48} strokeWidth={1} />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-bold tracking-[0.2em] uppercase text-text-primary">No coordinates recorded</p>
                  <p className="text-[11px] text-text-secondary font-light max-w-xs mx-auto leading-relaxed">
                    Your archival journal is currently empty. Begin by registering your first delivery point.
                  </p>
                </div>
              </div>
            )
          : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                {userAddresses.map(address => (
                  <div key={address.id} className="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both" style={{ animationDelay: '100ms' }}>
                    <AddressCard address={address} />
                  </div>
                ))}
              </div>
            )}

        <div className="pt-12 flex justify-center">
          <Button asChild variant="ghost" className="group text-[10px] uppercase tracking-[0.3em] font-bold text-text-secondary hover:bg-slate-100 hover:text-accent transition-all gap-4">
            <Link href="/profile">
              <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform duration-500" />
              Return to Journal
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
