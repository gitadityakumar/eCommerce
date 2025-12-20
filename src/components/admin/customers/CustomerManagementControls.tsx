'use client';

import { Loader2, Settings2, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { updateCustomerRole, updateCustomerVerification } from '@/actions/users';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface ManagementControlsProps {
  userId: string;
  initialRole: string;
  initialVerified: boolean;
}

export function CustomerManagementControls({ userId, initialRole, initialVerified }: ManagementControlsProps) {
  const [role, setRole] = useState(initialRole);
  const [verified, setVerified] = useState(initialVerified);
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);
  const [isUpdatingVerified, setIsUpdatingVerified] = useState(false);

  const handleRoleChange = async (newRole: string) => {
    setIsUpdatingRole(true);
    try {
      const res = await updateCustomerRole(userId, newRole as 'customer' | 'staff' | 'admin');
      if (res.success) {
        setRole(newRole);
        toast.success('User role updated successfully');
      }
      else {
        toast.error(res.error || 'Failed to update role');
      }
    }
    catch {
      toast.error('Something went wrong');
    }
    finally {
      setIsUpdatingRole(false);
    }
  };

  const handleVerificationChange = async (checked: boolean) => {
    setIsUpdatingVerified(true);
    try {
      const res = await updateCustomerVerification(userId, checked);
      if (res.success) {
        setVerified(checked);
        toast.success('Verification status updated');
      }
      else {
        toast.error(res.error || 'Failed to update verification');
      }
    }
    catch {
      toast.error('Something went wrong');
    }
    finally {
      setIsUpdatingVerified(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Settings2 className="h-5 w-5" />
          Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="role">User Role</Label>
          <div className="flex items-center gap-2">
            <Select value={role} onValueChange={handleRoleChange} disabled={isUpdatingRole}>
              <SelectTrigger id="role" className="w-[180px]">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            {isUpdatingRole && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          </div>
          <p className="text-[12px] text-muted-foreground">
            Caution: Changing roles affects user permissions across the platform.
          </p>
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border">
          <div className="space-y-0.5">
            <Label className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-green-600" />
              Verified Status
            </Label>
            <p className="text-[12px] text-muted-foreground">
              Manually verify this user&apos;s email address.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isUpdatingVerified && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            <Switch
              checked={verified}
              onCheckedChange={handleVerificationChange}
              disabled={isUpdatingVerified}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
