'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Phone } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { createAddress } from '@/actions/addresses';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

const addressSchema = z.object({
  type: z.enum(['shipping', 'billing']),
  line1: z.string().min(1, 'Address is required'),
  line2: z.string().nullable(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  country: z.string().min(1, 'Country is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'),
  isDefault: z.boolean(),
});

type AddressFormValues = z.infer<typeof addressSchema>;

interface AddressFormProps {
  onSuccess?: () => void;
}

export function AddressForm({ onSuccess }: AddressFormProps) {
  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      type: 'shipping',
      line1: '',
      line2: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
      phone: '',
      isDefault: false,
    },
  });

  const isPending = form.formState.isSubmitting;
  const pincode = form.watch('postalCode');

  useEffect(() => {
    const fetchLocation = async () => {
      // Assuming 6-digit Indian pincode for auto-fill logic
      if (pincode && pincode.length === 6 && /^\d+$/.test(pincode)) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_POSTAL_PINCODE_API_URL}/${pincode}`);
          const data = await res.json();

          if (data[0].Status === 'Success') {
            const entry = data[0].PostOffice[0];
            form.setValue('city', entry.District, { shouldValidate: true });
            form.setValue('state', entry.State, { shouldValidate: true });
            form.setValue('country', 'India', { shouldValidate: true });
            toast.info(`Coordinates identified: ${entry.District}, ${entry.State}`);
          }
        }
        catch (error) {
          console.error('Pincode fetch error:', error);
        }
      }
    };

    fetchLocation();
  }, [pincode, form]);

  async function onSubmit(values: AddressFormValues) {
    try {
      const result = await createAddress(values);
      if (result.success) {
        toast.success('Address added to your records');
        form.reset();
        onSuccess?.();
      }
      else {
        toast.error(result.error || 'Failed to archive address');
      }
    }
    catch (error) {
      console.error(error);
      toast.error('An unexpected error occurred during archiving');
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary mb-2 block">Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-transparent border-border-subtle focus:border-accent focus:ring-0 transition-all duration-300 rounded-none border-t-0 border-l-0 border-r-0 border-b px-0 pb-2 h-10 text-text-primary">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-xl border-border-subtle bg-background/95 backdrop-blur-md">
                    <SelectItem value="shipping" className="text-xs uppercase tracking-widest py-3 cursor-pointer">Shipping</SelectItem>
                    <SelectItem value="billing" className="text-xs uppercase tracking-widest py-3 cursor-pointer">Billing</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-[10px] font-medium text-destructive mt-1" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="postalCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary mb-2 block">Postal Code</FormLabel>
                <FormControl>
                  <Input
                    placeholder="E.g. 110001"
                    {...field}
                    className="bg-transparent border-border-subtle focus:border-accent focus:ring-0 transition-all duration-300 rounded-none border-t-0 border-l-0 border-r-0 border-b px-0 pb-2 h-10 text-text-primary placeholder:text-text-secondary/30 placeholder:font-light"
                  />
                </FormControl>
                <FormMessage className="text-[10px] font-medium text-destructive mt-1" />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary mb-2 flex items-center gap-2">
                <Phone size={12} className="text-accent" />
                Mobile Number
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="9876543210"
                  {...field}
                  maxLength={10}
                  className="bg-transparent border-border-subtle focus:border-accent focus:ring-0 transition-all duration-300 rounded-none border-t-0 border-l-0 border-r-0 border-b px-0 pb-2 h-10 text-text-primary placeholder:text-text-secondary/30 placeholder:font-light"
                />
              </FormControl>
              <FormMessage className="text-[10px] font-medium text-destructive mt-1" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="line1"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary mb-2 block">Address Line 1</FormLabel>
              <FormControl>
                <Input
                  placeholder="Street address, P.O. box"
                  {...field}
                  className="bg-transparent border-border-subtle focus:border-accent focus:ring-0 transition-all duration-300 rounded-none border-t-0 border-l-0 border-r-0 border-b px-0 pb-2 h-10 text-text-primary placeholder:text-text-secondary/30 placeholder:font-light"
                />
              </FormControl>
              <FormMessage className="text-[10px] font-medium text-destructive mt-1" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="line2"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary mb-2 block">Address Line 2 (Optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Apartment, suite, unit, building, floor"
                  {...field}
                  value={field.value || ''}
                  className="bg-transparent border-border-subtle focus:border-accent focus:ring-0 transition-all duration-300 rounded-none border-t-0 border-l-0 border-r-0 border-b px-0 pb-2 h-10 text-text-primary placeholder:text-text-secondary/30 placeholder:font-light"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary mb-2 block">City</FormLabel>
                <FormControl>
                  <Input
                    placeholder="New Delhi"
                    {...field}
                    className="bg-transparent border-border-subtle focus:border-accent focus:ring-0 transition-all duration-300 rounded-none border-t-0 border-l-0 border-r-0 border-b px-0 pb-2 h-10 text-text-primary placeholder:text-text-secondary/30 placeholder:font-light"
                  />
                </FormControl>
                <FormMessage className="text-[10px] font-medium text-destructive mt-1" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary mb-2 block">State</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Delhi"
                    {...field}
                    className="bg-transparent border-border-subtle focus:border-accent focus:ring-0 transition-all duration-300 rounded-none border-t-0 border-l-0 border-r-0 border-b px-0 pb-2 h-10 text-text-primary placeholder:text-text-secondary/30 placeholder:font-light"
                  />
                </FormControl>
                <FormMessage className="text-[10px] font-medium text-destructive mt-1" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary mb-2 block">Country</FormLabel>
                <FormControl>
                  <Input
                    placeholder="India"
                    {...field}
                    className="bg-transparent border-border-subtle focus:border-accent focus:ring-0 transition-all duration-300 rounded-none border-t-0 border-l-0 border-r-0 border-b px-0 pb-2 h-10 text-text-primary placeholder:text-text-secondary/30 placeholder:font-light"
                  />
                </FormControl>
                <FormMessage className="text-[10px] font-medium text-destructive mt-1" />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="isDefault"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between p-6 border border-border-subtle/50 bg-surface/5 rounded-2xl">
              <div className="space-y-0.5">
                <FormLabel className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-primary">Primary Location</FormLabel>
                <div className="text-[10px] text-text-secondary font-light">Set this as your default archival coordinate.</div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="data-[state=checked]:bg-accent shadow-soft"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="pt-4">
          <Button
            type="submit"
            disabled={isPending}
            className="w-full md:w-auto min-w-[200px] rounded-full bg-accent text-white font-bold text-[10px] tracking-[0.2em] uppercase hover:bg-accent/90 shadow-soft transition-all duration-500 disabled:opacity-30 disabled:grayscale py-6"
          >
            {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
            Register Address
          </Button>
        </div>
      </form>
    </Form>
  );
}
