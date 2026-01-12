'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, Landmark, Save, Settings as SettingsIcon, Store } from 'lucide-react';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { updateStoreSettings } from '@/lib/actions/settings';

const settingsSchema = z.object({
  storeName: z.string().min(1, 'Store name is required'),
  storeEmail: z.string().email('Invalid email').optional().or(z.literal('')),
  storePhone: z.string().optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  city: z.string().optional().or(z.literal('')),
  state: z.string().optional().or(z.literal('')),
  pincode: z.string().optional().or(z.literal('')),
  country: z.string().optional().or(z.literal('')),
  isTaxEnabled: z.boolean(),
  taxName: z.string().optional().or(z.literal('')),
  taxPercentage: z.string().refine(val => !Number.isNaN(Number(val)), {
    message: 'Must be a valid number',
  }),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

interface SettingsClientProps {
  initialSettings: any;
}

export function SettingsClient({ initialSettings }: SettingsClientProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      storeName: initialSettings?.storeName || '',
      storeEmail: initialSettings?.storeEmail || '',
      storePhone: initialSettings?.storePhone || '',
      address: initialSettings?.address || '',
      city: initialSettings?.city || '',
      state: initialSettings?.state || '',
      pincode: initialSettings?.pincode || '',
      country: initialSettings?.country || 'India',
      isTaxEnabled: initialSettings?.isTaxEnabled ?? false,
      taxName: initialSettings?.taxName || 'GST',
      taxPercentage: initialSettings?.taxPercentage || '0.00',
    },
  });

  async function onSubmit(values: SettingsFormValues) {
    startTransition(async () => {
      const result = await updateStoreSettings(values);
      if (result.success) {
        toast.success('Store settings updated successfully');
      }
      else {
        toast.error(result.error || 'Failed to update settings');
      }
    });
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-surface/50 p-8 rounded-2xl border border-border-subtle shadow-soft backdrop-blur-md transition-all duration-500">
        <div>
          <h1 className="text-4xl font-light tracking-tighter text-text-primary font-playfair italic flex items-center gap-3">
            <SettingsIcon className="text-accent size-8" strokeWidth={1.5} />
            Store Settings
          </h1>
          <p className="text-sm text-text-secondary mt-2 font-light tracking-tight">
            Configure your store identity and fiscal parameters.
          </p>
        </div>
        <Button
          onClick={form.handleSubmit(onSubmit)}
          disabled={isPending}
          className="bg-accent text-white hover:bg-accent/90 rounded-full px-8 font-bold tracking-widest uppercase text-[10px] shadow-soft shadow-accent/20 h-12 transition-all hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
        >
          {isPending
            ? (
                'Saving...'
              )
            : (
                <>
                  <Save size={14} />
                  Save Configuration
                </>
              )}
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Store Information */}
            <Card className="border-border-subtle bg-surface/30 shadow-soft rounded-3xl overflow-hidden">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-xl font-playfair flex items-center gap-2">
                  <Store className="size-5 text-accent" />
                  Archival Identity
                </CardTitle>
                <CardDescription className="text-xs uppercase tracking-widest font-light">
                  Basic information about your establishment.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-4 space-y-6">
                <FormField
                  control={form.control}
                  name="storeName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase tracking-widest font-bold text-text-secondary">Store Name</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-background/50 border-border-subtle rounded-xl h-11" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="storeEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] uppercase tracking-widest font-bold text-text-secondary">Official Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" className="bg-background/50 border-border-subtle rounded-xl h-11" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="storePhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] uppercase tracking-widest font-bold text-text-secondary">Contact Number</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-background/50 border-border-subtle rounded-xl h-11" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase tracking-widest font-bold text-text-secondary">Base of Operations (Address)</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-background/50 border-border-subtle rounded-xl h-11" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="col-span-1">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] uppercase tracking-widest font-bold text-text-secondary">City</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-background/50 border-border-subtle rounded-xl h-11" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-1">
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] uppercase tracking-widest font-bold text-text-secondary">State</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-background/50 border-border-subtle rounded-xl h-11" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-1">
                    <FormField
                      control={form.control}
                      name="pincode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] uppercase tracking-widest font-bold text-text-secondary">Pincode</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-background/50 border-border-subtle rounded-xl h-11" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-1">
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] uppercase tracking-widest font-bold text-text-secondary">Country</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-background/50 border-border-subtle rounded-xl h-11" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tax Configuration */}
            <Card className="border-border-subtle bg-surface/30 shadow-soft rounded-3xl overflow-hidden">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-xl font-playfair flex items-center gap-2">
                  <Landmark className="size-5 text-accent" />
                  Fiscal Parameters
                </CardTitle>
                <CardDescription className="text-xs uppercase tracking-widest font-light">
                  Define tax rates and collection rules.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-4 space-y-8">
                <FormField
                  control={form.control}
                  name="isTaxEnabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-2xl border border-border-subtle/50 bg-background/30 p-6 shadow-xs">
                      <div className="space-y-0.5">
                        <FormLabel className="text-sm font-bold tracking-tight text-text-primary">Enable Taxation</FormLabel>
                        <FormDescription className="text-[10px] uppercase tracking-widest font-light text-text-secondary/60">
                          Automatically apply taxes during the checkout sequence.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Separator className="bg-border-subtle/30" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="taxName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] uppercase tracking-widest font-bold text-text-secondary">Fiscal Identifier (Tax Name)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="GST, VAT, etc." className="bg-background/50 border-border-subtle rounded-xl h-11" />
                        </FormControl>
                        <FormDescription className="text-[9px] italic">Title displayed to the customer.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="taxPercentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] uppercase tracking-widest font-bold text-text-secondary">Tax Rate (%)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input {...field} className="bg-background/50 border-border-subtle rounded-xl h-11 pr-10" />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary font-bold text-xs">%</span>
                          </div>
                        </FormControl>
                        <FormDescription className="text-[9px] italic">Percentage to be calculated on subtotal.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="bg-accent/5 border border-accent/10 p-6 rounded-2xl flex items-start gap-4">
                  <CheckCircle2 className="text-accent size-5 mt-0.5 shrink-0" />
                  <p className="text-[11px] text-text-secondary leading-relaxed font-light italic uppercase tracking-wider">
                    Your selections here will influence the final valuation of all archival acquisitions. Ensure accuracy for fiscal compliance.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </Form>
    </div>
  );
}
