import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { History } from "lucide-react";

interface AuditFeedProps {
  logs: {
    id: string;
    adminName: string;
    action: string;
    entityType: string;
    createdAt: Date;
  }[];
}

export function DashboardAuditFeed({ logs }: AuditFeedProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">Audit Feed</CardTitle>
            <History className="h-4 w-4 text-muted-foreground" />
        </div>
        <CardDescription>Recent admin activity.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-4 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-linear-to-b before:from-transparent before:via-slate-200 before:to-transparent">
          {logs.map((log) => (
            <div key={log.id} className="relative flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border bg-white shadow-sm z-10">
                  <span className="text-[10px] font-bold uppercase">{log.action.substring(0, 1)}</span>
                </div>
                <div className="flex flex-col">
                  <p className="text-sm font-medium">
                    <span className="font-bold">{log.adminName}</span> {log.action}d {log.entityType}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {logs.length === 0 && (
            <p className="text-sm text-center text-muted-foreground py-4">
              No recent audit logs.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
