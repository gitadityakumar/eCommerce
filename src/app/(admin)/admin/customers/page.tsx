import { format } from 'date-fns';
import { Eye, MailCheck, MailWarning, Search } from 'lucide-react';
import Link from 'next/link';
import { getCustomers } from '@/actions/users';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export const dynamic = 'force-dynamic';

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; role?: string; verified?: string }>;
}) {
  const { search, role, verified: verifiedStr } = await searchParams;
  const verified = verifiedStr === 'true' ? true : verifiedStr === 'false' ? false : undefined;

  const customers = await getCustomers(search, role, verified);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-accent text-white font-bold text-[9px] tracking-widest uppercase py-1 border-transparent">Privileged Admin</Badge>;
      case 'staff':
        return <Badge className="bg-text-secondary text-white font-bold text-[9px] tracking-widest uppercase py-1 border-transparent">Curated Staff</Badge>;
      default:
        return <Badge variant="secondary" className="bg-accent/5 text-accent font-bold text-[9px] tracking-widest uppercase py-1 border-transparent">Client</Badge>;
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-light tracking-tighter text-text-primary font-playfair italic">Customer Archive</h1>
          <p className="text-sm text-text-secondary mt-2 font-light tracking-tight">Manage your clientele and their access privileges with refinement.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-center bg-surface/50 p-6 rounded-2xl border border-border-subtle shadow-soft backdrop-blur-md">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <form method="GET">
            <Input
              name="search"
              placeholder="Search name or email..."
              className="pl-8"
              defaultValue={search}
            />
          </form>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <form method="GET" className="flex gap-2">
            <Select name="role" defaultValue={role || 'all'}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>

            <Select name="verified" defaultValue={verifiedStr || 'all'}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Verified" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="true">Verified</SelectItem>
                <SelectItem value="false">Unverified</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit">Filter</Button>
            <Button variant="ghost" asChild>
              <Link href="/admin/customers">Reset</Link>
            </Button>
          </form>
        </div>
      </div>

      <div className="rounded-2xl border border-border-subtle bg-surface/50 overflow-hidden shadow-soft transition-all duration-500">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]"></TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Verified</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.length === 0
              ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No customers found.
                    </TableCell>
                  </TableRow>
                )
              : (
                  customers.map(customer => (
                    <TableRow key={customer.id} className="group">
                      <TableCell>
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={customer.image || undefined} />
                          <AvatarFallback>{customer.name?.[0] || customer.email[0]}</AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-900 dark:text-slate-100">{customer.name || 'N/A'}</span>
                          <span className="text-xs text-muted-foreground">{customer.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(customer.role)}</TableCell>
                      <TableCell>
                        {customer.emailVerified
                          ? (
                              <Badge variant="outline" className="text-accent border-accent/20 bg-accent/5 gap-1.5 font-bold text-[9px] tracking-widest uppercase py-1">
                                <MailCheck className="h-3 w-3" />
                                Verified
                              </Badge>
                            )
                          : (
                              <Badge variant="outline" className="text-text-secondary border-border-subtle bg-surface gap-1.5 font-bold text-[9px] tracking-widest uppercase py-1 italic">
                                <MailWarning className="h-3 w-3" />
                                Pending
                              </Badge>
                            )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(customer.createdAt), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/customers/${customer.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            {' '}
                            View
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
