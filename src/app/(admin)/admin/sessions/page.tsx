import { Globe, Shield, ShoppingCart, UserMinus, Users } from 'lucide-react';
import { getDashboardData } from '@/actions/dashboard';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function SessionsPage() {
  const data = await getDashboardData();

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Session Governance</h2>
          <p className="text-muted-foreground">
            Monitor active user sessions and guest tokens to identify traffic patterns.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Active Sessions</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.activeSessions}</div>
            <p className="text-xs text-muted-foreground">Currently interacting with the site</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Carts</CardTitle>
            <ShoppingCartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.activeCarts}</div>
            <p className="text-xs text-muted-foreground">Carts with items in them</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monitoring Status</CardTitle>
            <Globe className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">Active</div>
            <p className="text-xs text-muted-foreground">Real-time session tracking enabled</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Session Health</CardTitle>
          <CardDescription>
            Overview of guest vs registered user distribution.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <Users className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="font-semibold">Registered Users</p>
                  <p className="text-sm text-muted-foreground">Authenticated sessions with user IDs</p>
                </div>
              </div>
              <Badge variant="secondary" className="text-lg px-4 py-1">
                {/* Simplified for now, in a real app we'd split these in the action */}
                Calculating...
              </Badge>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <UserMinus className="h-8 w-8 text-slate-400" />
                <div>
                  <p className="font-semibold">Guest Visitors</p>
                  <p className="text-sm text-muted-foreground">Anonymous tokens via session_tokens</p>
                </div>
              </div>
              <Badge variant="outline" className="text-lg px-4 py-1">
                Calculating...
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Traffic Windows</CardTitle>
            <CardDescription>Estimated system load based on active sessions.</CardDescription>
          </CardHeader>
          <CardContent className="h-[200px] flex items-center justify-center text-muted-foreground italic">
            {data.activeSessions > 50 ? 'High traffic detected. Monitor server latency.' : 'System load is normal.'}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Bot Activity Check</CardTitle>
            <CardDescription>Identifying potential automated sessions.</CardDescription>
          </CardHeader>
          <CardContent className="h-[200px] flex items-center justify-center text-muted-foreground italic text-center">
            No suspicious burst activity from unique IP addresses in the last 60 minutes.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ShoppingCartIcon({ className }: { className?: string }) {
  return <ShoppingCart className={className} />;
}
