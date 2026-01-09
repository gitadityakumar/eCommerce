import { Heart, MapPin, Package, ShieldCheck, User } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getCurrentUser } from '@/lib/auth/actions';
import { ProfileForm } from './ProfileForm';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/sign-in');
  }

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
              <BreadcrumbPage className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent">Account</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="space-y-2">
          <h1 className="text-5xl md:text-6xl font-playfair tracking-tight text-text-primary">Journal</h1>
          <p className="text-text-secondary font-light tracking-[0.05em] max-w-2xl text-sm md:text-base">
            Your private architectural ledger. Manage your personal aesthetics, track your acquisitions, and curate your archival wishlist.
          </p>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="bg-transparent border-b border-border-subtle w-full justify-start rounded-none h-auto p-0 mb-12 flex-nowrap overflow-x-auto scrollbar-hide">
          <TabsTrigger
            value="general"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent data-[state=active]:text-accent px-8 py-4 text-[11px] uppercase tracking-[0.25em] font-bold transition-all duration-300"
          >
            General
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent data-[state=active]:text-accent px-8 py-4 text-[11px] uppercase tracking-[0.25em] font-bold transition-all duration-300"
          >
            Security
          </TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Main Content Area */}
          <div className="lg:col-span-8">
            <TabsContent value="general" className="mt-0 outline-none">
              <div className="space-y-10">
                <section>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="h-px bg-border-subtle flex-1" />
                    <h2 className="text-[10px] uppercase tracking-[0.4em] font-bold text-accent flex items-center gap-2">
                      <User size={14} />
                      Identity
                    </h2>
                    <div className="h-px bg-border-subtle flex-1" />
                  </div>
                  <div className="max-w-xl mx-auto lg:mx-0">
                    <ProfileForm user={user} />
                  </div>
                </section>
              </div>
            </TabsContent>

            <TabsContent value="security" className="mt-0 outline-none">
              <div className="space-y-10">
                <section>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="h-px bg-border-subtle flex-1" />
                    <h2 className="text-[10px] uppercase tracking-[0.4em] font-bold text-accent flex items-center gap-2">
                      <ShieldCheck size={14} />
                      Protection
                    </h2>
                    <div className="h-px bg-border-subtle flex-1" />
                  </div>
                  <div className="max-w-xl space-y-8">
                    <div className="p-8 border border-border-subtle bg-surface/10 rounded-2xl">
                      <h3 className="text-sm font-bold tracking-widest uppercase mb-4 text-text-primary">Encryption & Access</h3>
                      <p className="text-sm text-text-secondary font-light leading-relaxed mb-6">
                        Maintain the architectural integrity of your account by periodically updating your entry credentials.
                      </p>
                      <Button asChild variant="outline" className="rounded-full border-border-subtle text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-accent/5 hover:text-accent transition-all px-10 py-6 h-auto">
                        <Link href="/forgot-password">Regenerate Password</Link>
                      </Button>
                    </div>
                  </div>
                </section>
              </div>
            </TabsContent>
          </div>

          {/* Sidebar / Quick Links */}
          <div className="lg:col-span-4 space-y-10">
            <div>
              <h2 className="text-[10px] uppercase tracking-[0.4em] font-bold text-text-secondary/60 mb-8 px-2 border-l-2 border-accent">Archive</h2>
              <div className="grid grid-cols-1 gap-6">
                <QuickLinkCard
                  href="/orders"
                  icon={<Package size={20} />}
                  title="Manifests"
                  description="A chronological record of your archival acquisitions."
                />
                <QuickLinkCard
                  href="/wishlist"
                  icon={<Heart size={20} />}
                  title="Curations"
                  description="Your personal gallery of future additions."
                />
                <QuickLinkCard
                  href="/profile/addresses"
                  icon={<MapPin size={20} />}
                  title="Coordinates"
                  description="Global locations for your scheduled deliveries."
                />
              </div>
            </div>
          </div>
        </div>
      </Tabs>
    </div>
  );
}

function QuickLinkCard({ href, icon, title, description }: { href: string; icon: React.ReactNode; title: string; description: string }) {
  return (
    <Link href={href} className="group">
      <div className="p-6 border border-border-subtle/50 bg-surface/5 hover:bg-surface/10 hover:border-accent/30 transition-all duration-500 rounded-2xl group-hover:-translate-x-1">
        <div className="flex items-start gap-6">
          <div className="mt-1 text-text-secondary group-hover:text-accent transition-colors duration-500">
            {icon}
          </div>
          <div className="space-y-1">
            <h3 className="text-xs font-bold tracking-widest uppercase text-text-primary group-hover:text-accent transition-colors duration-500">{title}</h3>
            <p className="text-[11px] text-text-secondary font-light leading-relaxed tracking-wide opacity-80 group-hover:opacity-100 transition-opacity">
              {description}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
