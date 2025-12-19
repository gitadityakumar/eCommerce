import { getAuditLogs } from "@/actions/audit";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AuditDiffViewer } from "./_components/AuditDiffViewer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { History, User, Tag, Package, ShoppingCart } from "lucide-react";

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
          <h2 className="text-3xl font-bold tracking-tight">System Audit Logs</h2>
          <p className="text-muted-foreground">
            Monitor all administrative changes and system activity for accountability.
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
            {logs.map((log) => (
              <AccordionItem key={log.id} value={log.id}>
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-center gap-4 text-left w-full">
                    <div className="p-2 rounded-full bg-slate-100">
                      {getEntityIcon(log.entityType)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{log.adminName || 'System'}</span>
                        <Badge variant="secondary" className="text-[10px] uppercase font-bold">
                          {log.action.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {log.entityType} ID: {log.entityId}
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
                  <div className="pt-4 pb-2 px-4 border-t bg-slate-50/50 rounded-b-md">
                    <div className="mb-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Data Modifications</h4>
                      <AuditDiffViewer oldValue={log.oldValue} newValue={log.newValue} />
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
