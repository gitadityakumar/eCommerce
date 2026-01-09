'use client';

import type { Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
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
import { updateProfile } from '@/lib/auth/actions';
import { useAuthStore } from '@/store/auth';

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };
}

export function ProfileForm({ user }: ProfileFormProps) {
  const { setUser } = useAuthStore();
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema) as Resolver<ProfileFormValues>,
    defaultValues: {
      name: user.name || '',
      email: user.email || '',
    },
  });

  const isPending = form.formState.isSubmitting;

  async function onSubmit(values: ProfileFormValues) {
    const formData = new FormData();
    formData.append('name', values.name);

    try {
      const result = await updateProfile(formData);
      if (result.ok && result.user) {
        toast.success('Profile updated successfully');
        setUser({ ...result.user, image: result.user.image ?? undefined });
        form.reset({
          name: result.user.name,
          email: result.user.email,
        });
      }
      else {
        toast.error(result.error || 'Failed to update profile');
      }
    }
    catch (error) {
      console.error(error);
      toast.error('An unexpected error occurred');
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary mb-2 block">Full Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Your Name"
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary mb-2 block">Email Address</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled
                  className="bg-transparent border-border-subtle/30 opacity-60 cursor-not-allowed rounded-none border-t-0 border-l-0 border-r-0 border-b px-0 pb-2 h-10 text-text-primary"
                />
              </FormControl>
              <FormDescription className="text-[10px] italic text-text-secondary/50 font-light pt-1">
                Security notice: Email address cannot be modified.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-4">
          <Button
            type="submit"
            disabled={isPending || !form.formState.isDirty}
            className="w-full md:w-auto min-w-[200px] rounded-full bg-accent text-white font-bold text-[10px] tracking-[0.2em] uppercase hover:bg-accent/90 shadow-soft transition-all duration-500 disabled:opacity-30 disabled:grayscale py-6"
          >
            {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
}
