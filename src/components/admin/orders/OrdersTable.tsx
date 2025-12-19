"use client";

import { useState, useMemo } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuCheckboxItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, Search } from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

import { getOrders } from "@/actions/orders";

interface OrdersTableProps {
  orders: Awaited<ReturnType<typeof getOrders>>;
}

export function OrdersTable({ orders }: OrdersTableProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState<string[]>([]);
  const [shipmentFilter, setShipmentFilter] = useState<string[]>([]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch = 
        order.id.toLowerCase().includes(search.toLowerCase()) ||
        order.user?.email.toLowerCase().includes(search.toLowerCase()) ||
        order.user?.name?.toLowerCase().includes(search.toLowerCase());
      
      const pStatus = order.payments?.[0]?.status || "pending";
      // Normalize database status to filter values
      const normalizedPaymentStatus = pStatus === 'completed' ? 'paid' : (pStatus === 'initiated' ? 'pending' : pStatus);
      const shipmentStatus = order.status;

      const matchesPayment = paymentFilter.length === 0 || paymentFilter.includes(normalizedPaymentStatus);
      const matchesShipment = shipmentFilter.length === 0 || shipmentFilter.includes(shipmentStatus);

      return matchesSearch && matchesPayment && matchesShipment;
    });
  }, [orders, search, paymentFilter, shipmentFilter]);

  const clearFilters = () => {
    setSearch("");
    setPaymentFilter([]);
    setShipmentFilter([]);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
      case 'completed':
      case 'delivered':
        return "bg-green-100 text-green-700 border-green-200";
      case 'pending':
      case 'initiated':
        return "bg-slate-100 text-slate-700 border-slate-200";
      case 'processing':
      case 'shipped':
        return "bg-blue-100 text-blue-700 border-blue-200";
      case 'failed':
      case 'cancelled':
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-amber-100 text-amber-700 border-amber-200";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-lg border">
        <div className="flex flex-1 items-center gap-4 max-w-sm">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                Payment Status <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuCheckboxItem 
                checked={paymentFilter.includes("pending")}
                onCheckedChange={(checked) => 
                  setPaymentFilter(prev => checked ? [...prev, "pending"] : prev.filter(s => s !== "pending"))
                }
              >
                Pending
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem 
                checked={paymentFilter.includes("paid")}
                onCheckedChange={(checked) => 
                  setPaymentFilter(prev => checked ? [...prev, "paid"] : prev.filter(s => s !== "paid"))
                }
              >
                Paid
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem 
                checked={paymentFilter.includes("failed")}
                onCheckedChange={(checked) => 
                  setPaymentFilter(prev => checked ? [...prev, "failed"] : prev.filter(s => s !== "failed"))
                }
              >
                Failed
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                Shipment Status <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
                <DropdownMenuCheckboxItem 
                  key={s}
                  checked={shipmentFilter.includes(s)}
                  onCheckedChange={(checked) => 
                    setShipmentFilter(prev => checked ? [...prev, s] : prev.filter(x => x !== s))
                  }
                  className="capitalize"
                >
                  {s}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {(search || paymentFilter.length > 0 || shipmentFilter.length > 0) && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-primary hover:text-primary/80">
              Clear filter
            </Button>
          )}
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-12">
                <Checkbox />
              </TableHead>
              <TableHead className="font-semibold">ORDER NUMBER</TableHead>
              <TableHead className="font-semibold">DATE</TableHead>
              <TableHead className="font-semibold">CUSTOMER EMAIL</TableHead>
              <TableHead className="font-semibold">ORDER STATUS</TableHead>
              <TableHead className="font-semibold">PAYMENT STATUS</TableHead>
              <TableHead className="font-semibold text-right">TOTAL</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order, index) => (
                <TableRow 
                  key={order.id} 
                  className="cursor-pointer hover:bg-muted/30"
                  onClick={() => router.push(`/admin/orders/${order.id}`)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox />
                  </TableCell>
                  <TableCell className="font-bold">
                    #{10000 + orders.length - index}
                  </TableCell>
                  <TableCell>{format(new Date(order.createdAt), "MMM d, yyyy")}</TableCell>
                  <TableCell className="text-muted-foreground">{order.user?.email || "Guest"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                       <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border capitalize", getStatusColor(order.status))}>
                         <div className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
                         {order.status}
                       </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border capitalize", getStatusColor(order.payments?.[0]?.status === 'completed' ? 'paid' : (order.payments?.[0]?.status || 'pending')))}>
                        <div className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
                        {order.payments?.[0]?.status === 'completed' ? 'Paid' : (order.payments?.[0]?.status || "Pending")}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    ${Number(order.totalAmount).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-2 pt-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span>Show</span>
          <select className="border rounded px-1 py-1 h-8 bg-white">
            <option>20</option>
            <option>50</option>
            <option>100</option>
          </select>
          <span>per page</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
             <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled>1</Button>
          </div>
          <span>{filteredOrders.length} records</span>
        </div>
      </div>
    </div>
  );
}
