import { getDashboardData } from "@/actions/dashboard";
import { DashboardKpiCards } from "./dashboard/_components/DashboardKpiCards";
import { DashboardSalesTrendChart } from "./dashboard/_components/DashboardSalesTrendChart";
import { DashboardRecentOrders } from "./dashboard/_components/DashboardRecentOrders";
import { DashboardStockStatus } from "./dashboard/_components/DashboardStockStatus";
import { DashboardAuditFeed } from "./dashboard/_components/DashboardAuditFeed";
import { DashboardDateRangePicker } from "./dashboard/_components/DashboardDateRangePicker";

interface AdminPageProps {
  searchParams: Promise<{ from?: string; to?: string }>;
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const params = await searchParams;
  const dateRange = params.from && params.to 
    ? { from: new Date(params.from), to: new Date(params.to) }
    : undefined;

  const data = await getDashboardData(dateRange);

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
        <div className="flex items-center space-x-2">
          <DashboardDateRangePicker />
        </div>
      </div>

      <DashboardKpiCards stats={data} />

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        <DashboardSalesTrendChart data={data.salesTrends} />
        <div className="col-span-1 md:col-span-2 lg:col-span-4">
          <DashboardRecentOrders orders={data.recentOrders} />
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <DashboardStockStatus items={data.lowStockItems} />
        <DashboardAuditFeed logs={data.auditFeed} />
      </div>
    </div>
  );
}
