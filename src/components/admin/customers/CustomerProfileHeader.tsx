'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface CustomerProfileHeaderProps {
  user: {
    name: string | null;
    email: string;
    image: string | null;
    role: 'customer' | 'staff' | 'admin';
  };
}

export function CustomerProfileHeader({ user }: CustomerProfileHeaderProps) {
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-purple-600 hover:bg-purple-700">Admin</Badge>;
      case 'staff':
        return <Badge className="bg-blue-600 hover:bg-blue-700">Staff</Badge>;
      default:
        return <Badge variant="secondary">Customer</Badge>;
    }
  };

  return (
    <Card className="overflow-hidden border-none shadow-md bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
            <AvatarImage src={user.image || undefined} alt={user.name || 'User'} />
            <AvatarFallback className="text-2xl">{user.name?.[0] || user.email[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">{user.name || 'No Name Set'}</h1>
              {getRoleBadge(user.role)}
            </div>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
