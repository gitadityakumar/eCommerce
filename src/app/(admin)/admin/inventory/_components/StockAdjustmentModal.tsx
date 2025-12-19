'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Package, Plus, Minus, AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { adjustStock } from "@/actions/stock";

const formSchema = z.object({
  amount: z.coerce.number().int().refine((val) => val !== 0, {
    message: "Amount must be greater than or less than 0",
  }),
  reason: z.enum(['manual_adjustment', 'damage', 'restock', 'return']),
});

type FormValues = z.infer<typeof formSchema>;

interface StockAdjustmentModalProps {
  variantId: string;
  sku: string;
  productName: string;
  currentAvailable: number;
}

export function StockAdjustmentModal({
  variantId,
  sku,
  productName,
  currentAvailable,
}: StockAdjustmentModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 1,
      reason: "manual_adjustment",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      const result = await adjustStock({
        variantId,
        amount: values.amount,
        reason: values.reason,
      });

      if (result.success) {
        toast.success("Stock adjusted successfully");
        setOpen(false);
        form.reset();
      } else {
        toast.error(result.error || "Failed to adjust stock");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Package className="h-4 w-4" />
          Adjust Stock
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adjust Stock</DialogTitle>
          <DialogDescription>
            Adjust inventory for <strong>{productName}</strong> ({sku}).
            Current: {currentAvailable} available.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adjustment Amount</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => field.onChange((field.value as number) - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        className="text-center font-bold"
                      />
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => field.onChange((field.value as number) + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </FormControl>
                  <FormDescription className="text-[11px]">
                    Use positive for restocks, negative for removals.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a reason" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="manual_adjustment">Manual Adjustment</SelectItem>
                      <SelectItem value="restock">Restock</SelectItem>
                      <SelectItem value="damage">Damage / Loss</SelectItem>
                      <SelectItem value="return">Customer Return</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.watch("amount") < 0 && (
              <div className="flex items-center gap-2 p-2 rounded-md bg-amber-50 text-amber-900 text-xs border border-amber-200">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>Removing {Math.abs(form.watch("amount"))} units from available stock.</span>
              </div>
            )}
            <DialogFooter>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Adjusting..." : "Confirm Adjustment"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function FormDescription({ children, className }: { children: React.ReactNode, className?: string }) {
    return <p className={`text-sm text-muted-foreground ${className}`}>{children}</p>
}
