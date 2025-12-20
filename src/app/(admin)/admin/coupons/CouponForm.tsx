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
        toast.error(result.error || 'Failed to create coupon');
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
        <Card className="max-w-2xl mx-auto border-none shadow-lg">
          <CardHeader className="bg-muted/30 pb-8">
            <CardTitle className="text-2xl font-bold">Create New Coupon</CardTitle>
            <CardDescription>
              Configure the discount rules and validity period for this promotion.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Coupon Code */}
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Coupon Code</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g. SUMMER2024" {...field} />
                    </FormControl>
                    <FormDescription>Must be unique and descriptive.</FormDescription>
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
                    <FormLabel>Discount Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage (%)</SelectItem>
                        <SelectItem value="fixed">Fixed Amount (₹)</SelectItem>
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
                    <FormLabel>Discount Value</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input type="number" step="0.01" placeholder="0.00" {...field} className="pr-10" />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground font-semibold">
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
                    <FormLabel>Min Order Amount (₹)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormDescription>Minimum spend required to use this coupon.</FormDescription>
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
                    <FormLabel>Starts At</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            {field.value
                              ? (
                                  format(field.value, 'PPP')
                                )
                              : (
                                  <span>Pick a date</span>
                                )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={date =>
                            date < new Date('1900-01-01')}
                          initialFocus
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
                    <FormLabel>Expires At (Optional)</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            {field.value
                              ? (
                                  format(field.value, 'PPP')
                                )
                              : (
                                  <span>Never expires</span>
                                )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={field.onChange}
                          disabled={date =>
                            date < (form.getValues('startsAt') || new Date())}
                          initialFocus
                        />
                        <div className="p-3 border-t">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full text-xs"
                            onClick={() => field.onChange(null)}
                          >
                            Clear Expiry
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
                  <FormLabel>Total Usage Limit (Optional)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Leave blank for unlimited" {...field} value={field.value || ''} min="1" />
                  </FormControl>
                  <FormDescription>Total number of times this coupon can be used globally.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} className="bg-primary hover:bg-primary/90">
                {isPending
                  ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    )
                  : (
                      'Create Coupon'
                    )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
