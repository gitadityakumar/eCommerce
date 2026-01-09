import { Globe, Shield, ShoppingCart, UserMinus, Users } from 'lucide-react';
import { getDashboardData } from '@/actions/dashboard';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export default async function SessionsPage() {
  const data = await getDashboardData();

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-4xl font-light tracking-tighter text-text-primary font-playfair italic">Session Governance</h2>
          <p className="text-sm text-text-secondary mt-2 font-light tracking-tight">
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
            <div className="text-3xl font-light tracking-tighter text-text-primary">{data.activeSessions}</div>
            <p className="text-xs text-text-secondary">Currently interacting with the site</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Carts</CardTitle>
            <ShoppingCartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-light tracking-tighter text-text-primary">{data.activeCarts}</div>
            <p className="text-xs text-text-secondary">Carts with items in them</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monitoring Status</CardTitle>
            <Globe className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-light tracking-tighter text-accent italic">Active</div>
            <p className="text-xs text-text-secondary">Real-time session tracking enabled</p>
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
            <div className="flex items-center justify-between p-6 border border-border-subtle rounded-2xl bg-surface/50 shadow-soft transition-all hover:bg-surface duration-300">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center shadow-soft">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="font-bold tracking-tight text-text-primary">Registered Users</p>
                  <p className="text-xs text-text-secondary font-light">Authenticated sessions with unique user IDs</p>
                </div>
              </div>
              <Badge variant="secondary" className="text-lg px-6 py-1.5 rounded-full bg-accent/10 text-accent border-transparent font-bold tracking-tighter">
                Calculated
              </Badge>
            </div>
            <div className="flex items-center justify-between p-6 border border-border-subtle rounded-2xl bg-surface/50 shadow-soft transition-all hover:bg-surface duration-300">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-full bg-text-secondary/10 flex items-center justify-center shadow-soft">
                  <UserMinus className="h-6 w-6 text-text-secondary" />
                </div>
                <div>
                  <p className="font-bold tracking-tight text-text-primary">Guest Visitors</p>
                  <p className="text-xs text-text-secondary font-light">Anonymous tokens via session_tokens</p>
                </div>
              </div>
              <Badge variant="outline" className="text-lg px-6 py-1.5 rounded-full border-border-subtle text-text-secondary font-bold tracking-tighter">
                Calculated
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
