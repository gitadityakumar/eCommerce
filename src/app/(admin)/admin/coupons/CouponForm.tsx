'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { CardContent } from '@/components/ui/card';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createCoupon } from '@/lib/actions/coupons';
import { cn } from '@/lib/utils';

const couponFormSchema = z.object({
  code: z.string().min(1, 'Coupon code is required').toUpperCase().trim(),
  discountType: z.enum(['percentage', 'fixed'], {
    message: 'Please select a discount type',
  }),
  discountValue: z.string().min(1, 'Discount value is required').refine(val => !Number.isNaN(Number(val)) && Number(val) > 0, {
    message: 'Discount value must be a positive number',
  }),
  minOrderAmount: z.string().min(1, 'Minimum order amount is required').refine(val => !Number.isNaN(Number(val)) && Number(val) >= 0, {
    message: 'Minimum order amount must be 0 or more',
  }),
  startsAt: z.date({
    message: 'Start date is required',
  }),
  expiresAt: z.date().optional().nullable(),
  maxUsage: z.string().optional().nullable().refine(val => !val || (!Number.isNaN(Number(val)) && Number(val) > 0), {
    message: 'Max usage must be a positive integer',
  }),
});

type CouponFormValues = z.infer<typeof couponFormSchema>;

export function CouponForm() {
  const router = useRouter();
  const [isPending, setIsPending] = React.useState(false);

  const form = useForm<CouponFormValues>({
    resolver: zodResolver(couponFormSchema),
    defaultValues: {
      code: '',
      discountType: 'percentage',
      discountValue: '',
      minOrderAmount: '0',
      startsAt: new Date(),
      expiresAt: null,
      maxUsage: '',
    },
  });

  // Watch discountType to show the correct symbol
  const discountType = form.watch('discountType');

  async function onSubmit(values: CouponFormValues) {
    setIsPending(true);

    // Prepare data for server action (convert strings to numbers)
    const submitData = {
      ...values,
      discountValue: Number.parseFloat(values.discountValue),
      minOrderAmount: Number.parseFloat(values.minOrderAmount),
      maxUsage: values.maxUsage ? Number.parseInt(values.maxUsage) : null,
      usedCount: 0,
    };

    try {
      const result = await createCoupon(submitData);

      if (result.success) {
        toast.success('Coupon created successfully');
        router.push('/admin/coupons');
      }
      else {
        if (result.error && typeof result.error === 'object') {
          Object.entries(result.error as Record<string, string[]>).forEach(([key, messages]) => {
            if (messages && messages.length > 0) {
              form.setError(key as keyof CouponFormValues, { message: messages[0] });
            }
          });
        }
        else {
          toast.error((result.error as unknown as string) || 'Failed to create coupon');
        }
      }
    }
    catch {
      toast.error('An unexpected error occurred');
    }
    finally {
      setIsPending(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <CardContent className="grid gap-6 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Coupon Code */}
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold tracking-widest uppercase text-text-secondary">Identifier Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="E.g. NOIRSUMMER2026"
                      className="h-12 bg-background/50 border-border-subtle rounded-xl focus:ring-accent/20 focus:border-accent/40 transition-all font-mono tracking-widest"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-[9px] italic opacity-60">A unique archival identifier for this incentive.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Discount Type */}
            <FormField
              control={form.control}
              name="discountType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold tracking-widest uppercase text-text-secondary">Discount Mechanism</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12 bg-background/50 border-border-subtle rounded-xl focus:ring-accent/20 focus:border-accent/40 transition-all font-light">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-surface border-border-subtle rounded-xl shadow-soft">
                      <SelectItem value="percentage" className="text-[10px] font-bold tracking-widest uppercase">Percentage (%)</SelectItem>
                      <SelectItem value="fixed" className="text-[10px] font-bold tracking-widest uppercase text-accent">Fixed Amount (₹)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Discount Value */}
            <FormField
              control={form.control}
              name="discountValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold tracking-widest uppercase text-text-secondary">Incentive Value</FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        className="h-12 pl-4 pr-12 bg-background/50 border-border-subtle rounded-xl focus:ring-accent/20 focus:border-accent/40 transition-all font-light"
                      />
                      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-accent font-bold text-[10px] tracking-widest">
                        {discountType === 'percentage' ? '%' : '₹'}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Minimum Order Amount */}
            <FormField
              control={form.control}
              name="minOrderAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold tracking-widest uppercase text-text-secondary">Minimum Acquisition (₹)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      className="h-12 bg-background/50 border-border-subtle rounded-xl focus:ring-accent/20 focus:border-accent/40 transition-all font-light"
                    />
                  </FormControl>
                  <FormDescription className="text-[9px] italic opacity-60">Minimum spend required to activate this archival incentive.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Starts At */}
            <FormField
              control={form.control}
              name="startsAt"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-[10px] font-bold tracking-widest uppercase text-text-secondary">Activation Epoch</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full h-12 bg-background/50 border-border-subtle rounded-xl pl-4 text-left font-light text-sm hover:border-accent/40',
                            !field.value && 'text-text-secondary',
                          )}
                        >
                          {field.value
                            ? (
                                format(field.value, 'PPP')
                              )
                            : (
                                <span>Curate a date</span>
                              )}
                          <CalendarIcon className="ml-auto h-4 w-4 text-accent opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-surface border-border-subtle rounded-2xl shadow-soft" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={date =>
                          date < new Date('1900-01-01')}
                        initialFocus
                        className="p-4"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Expires At */}
            <FormField
              control={form.control}
              name="expiresAt"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-[10px] font-bold tracking-widest uppercase text-text-secondary">Sunset Period (Optional)</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full h-12 bg-background/50 border-border-subtle rounded-xl pl-4 text-left font-light text-sm hover:border-accent/40',
                            !field.value && 'text-text-secondary',
                          )}
                        >
                          {field.value
                            ? (
                                format(field.value, 'PPP')
                              )
                            : (
                                <span>Perpetual Incentive</span>
                              )}
                          <CalendarIcon className="ml-auto h-4 w-4 text-accent opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-surface border-border-subtle rounded-2xl shadow-soft" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value || undefined}
                        onSelect={field.onChange}
                        disabled={date =>
                          date < (form.getValues('startsAt') || new Date())}
                        initialFocus
                        className="p-4"
                      />
                      <div className="p-4 border-t border-border-subtle">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full text-[10px] font-bold tracking-widest uppercase text-text-secondary hover:text-accent transition-colors"
                          onClick={() => field.onChange(null)}
                        >
                          Clear Archive Date
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Max Usage */}
          <FormField
            control={form.control}
            name="maxUsage"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[10px] font-bold tracking-widest uppercase text-text-secondary">Total Archival Limit (Optional)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Leave blank for a perpetual existence"
                    {...field}
                    value={field.value || ''}
                    min="1"
                    className="h-12 bg-background/50 border-border-subtle rounded-xl focus:ring-accent/20 focus:border-accent/40 transition-all font-light"
                  />
                </FormControl>
                <FormDescription className="text-[9px] italic opacity-60">Total number of times this incentive can be redeemed globally.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-6 pt-10 border-t border-border-subtle mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isPending}
              className="h-12 px-8 rounded-full border-border-subtle text-text-secondary hover:text-accent font-bold tracking-widest uppercase text-[10px] transition-all"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="h-12 px-8 bg-accent text-white hover:bg-accent/90 rounded-full font-bold tracking-widest uppercase text-[10px] shadow-soft shadow-accent/20 transition-all hover:-translate-y-0.5 active:scale-95"
            >
              {isPending
                ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Archiving...
                    </>
                  )
                : (
                    'Finalize Incentive'
                  )}
            </Button>
          </div>
        </CardContent>

      </form>
    </Form>
  );
}
