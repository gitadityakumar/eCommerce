import { History, Package, ShoppingCart, Tag, User } from 'lucide-react';
import { getAuditLogs } from '@/actions/audit';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AuditDiffViewer } from './_components/AuditDiffViewer';

export const dynamic = 'force-dynamic';

export default async function AuditLogsPage() {
  const logs = await getAuditLogs();

  const getEntityIcon = (type: string) => {
    switch (type) {
      case 'product': return <Package className="h-4 w-4" />;
      case 'order': return <ShoppingCart className="h-4 w-4" />;
      case 'coupon': return <Tag className="h-4 w-4" />;
      case 'user': return <User className="h-4 w-4" />;
      default: return <History className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-4xl font-light tracking-tighter text-text-primary font-playfair italic">System Audit Logs</h2>
          <p className="text-sm text-text-secondary mt-2 font-light tracking-tight">
            Monitor all administrative changes and system activity with absolute transparency.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Click on an entry to see the data changes (diff).</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {logs.map(log => (
              <AccordionItem key={log.id} value={log.id}>
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-center gap-4 text-left w-full">
                    <div className="p-2.5 rounded-full bg-accent/10 text-accent shadow-soft">
                      {getEntityIcon(log.entityType)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold tracking-tight text-text-primary">{log.adminName || 'System Archive'}</span>
                        <Badge variant="secondary" className="text-[9px] uppercase font-bold tracking-widest bg-accent/5 text-accent border-transparent">
                          {log.action.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-[10px] text-text-secondary font-mono tracking-tighter opacity-70">
                        {log.entityType.toUpperCase()}
                        {' '}
                        REF: #
                        {log.entityId.substring(0, 12)}
                      </p>
                    </div>
                    <div className="text-right pr-4">
                      <p className="text-xs font-medium">
                        {new Date(log.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {new Date(log.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pt-6 pb-4 px-6 border-t border-border-subtle bg-surface/50 rounded-b-2xl shadow-inner-soft">
                    <div className="mb-4">
                      <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent mb-4">Historical Data Modifications</h4>
                      <AuditDiffViewer
                        oldValue={log.oldValue as Record<string, unknown> | null}
                        newValue={log.newValue as Record<string, unknown> | null}
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
            {logs.length === 0 && (
              <div className="text-center py-10 text-muted-foreground">
                <History className="h-10 w-10 mx-auto mb-4 opacity-20" />
                <p>No audit logs found.</p>
              </div>
            )}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
