'use client';

import { useEffect, useState } from "react";
import { getEntityHistory } from "@/actions/audit";
import { AuditDiffViewer } from "@/app/(admin)/admin/audit-logs/_components/AuditDiffViewer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History, User, Clock } from "lucide-react";

interface EntityHistoryTabProps {
  entityType: string;
  entityId: string;
}

export function EntityHistoryTab({ entityType, entityId }: EntityHistoryTabProps) {
  const [history, setHistory] = useState<Awaited<ReturnType<typeof getEntityHistory>>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getEntityHistory(entityType, entityId);
        setHistory(data);
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [entityType, entityId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 text-muted-foreground">
        <Clock className="h-5 w-5 animate-spin mr-2" />
        <span>Loading history...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-4">
      {history.length === 0 ? (
        <div className="text-center py-10 border rounded-lg bg-slate-50">
          <History className="h-10 w-10 mx-auto mb-4 opacity-20" />
          <p className="text-muted-foreground text-sm">No activity recorded for this {entityType}.</p>
        </div>
      ) : (
        <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-200">
          {history.map((log) => (
            <div key={log.id} className="relative flex items-start gap-6 group">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border bg-white shadow-sm z-10 shrink-0 mt-1">
                <History className="h-4 w-4 text-slate-500" />
              </div>
              <div className="flex flex-col flex-1 gap-2">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-blue-600 bg-blue-50 border-blue-200 uppercase font-bold text-[10px]">
                      {log.action.replace('_', ' ')}
                    </Badge>
                    <span className="text-sm font-semibold flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {log.adminName || 'System'}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(log.createdAt).toLocaleString()}
                  </span>
                </div>
                <Card className="bg-slate-50/50">
                  <CardContent className="p-4">
                    <AuditDiffViewer 
                      oldValue={log.oldValue as Record<string, unknown> | null} 
                      newValue={log.newValue as Record<string, unknown> | null} 
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
