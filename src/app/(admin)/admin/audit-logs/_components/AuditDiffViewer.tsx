'use client';

import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ArrowRight, Info } from "lucide-react";

interface AuditDiffViewerProps {
  oldValue: Record<string, unknown> | null;
  newValue: Record<string, unknown> | null;
}

export function AuditDiffViewer({ oldValue, newValue }: AuditDiffViewerProps) {
  // If no change or initialization
  if (!oldValue && newValue) {
    return (
      <Card className="p-4 bg-emerald-50/50 border-emerald-100">
        <div className="flex items-center gap-2 mb-2 text-emerald-700 text-sm font-semibold">
          <Info className="h-4 w-4" />
          <span>Initial Values / Created</span>
        </div>
        <pre className="text-xs font-mono p-2 bg-white rounded border overflow-auto max-h-40">
          {JSON.stringify(newValue, null, 2)}
        </pre>
      </Card>
    );
  }

  // Handle deletions
  if (oldValue && !newValue) {
    return (
      <Card className="p-4 bg-rose-50/50 border-rose-100">
         <div className="flex items-center gap-2 mb-2 text-rose-700 text-sm font-semibold">
          <Info className="h-4 w-4" />
          <span>Deleted Record</span>
        </div>
        <pre className="text-xs font-mono p-2 bg-white rounded border overflow-auto max-h-40 line-through opacity-50">
          {JSON.stringify(oldValue, null, 2)}
        </pre>
      </Card>
    );
  }

  // Handle updates - diff view
  const oldObj = oldValue || {};
  const newObj = newValue || {};
  const keys = Array.from(new Set([...Object.keys(oldObj), ...Object.keys(newObj)]));
  const changes = keys.filter(key => JSON.stringify(oldObj[key]) !== JSON.stringify(newObj[key]));

  return (
    <div className="space-y-3">
      <Table className="border rounded-md">
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-1/3">Field</TableHead>
            <TableHead>Change</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {changes.map((key) => (
            <TableRow key={key}>
              <TableCell className="font-medium text-muted-foreground">{key}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 line-through font-mono text-[10px]">
                    {String(oldObj[key] ?? '')}
                  </Badge>
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-mono text-[10px]">
                    {String(newObj[key] ?? '')}
                  </Badge>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {changes.length === 0 && (
            <TableRow>
              <TableCell colSpan={2} className="text-center text-xs text-muted-foreground italic">
                No measurable diff in top-level JSON fields.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
