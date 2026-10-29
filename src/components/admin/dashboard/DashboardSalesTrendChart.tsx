'use client';

import type {
  ChartConfig,
} from '@/components/ui/chart';
import { format } from 'date-fns';
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { formatINR } from '@/lib/currency';

const chartConfig = {
  revenue: {
    label: 'Revenue',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

const yAxisNumberFormat = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 1,
  notation: 'compact',
});

function formatYAxisPrice(value: number) {
  return yAxisNumberFormat.format(value);
}

interface SalesChartProps {
  data: {
    date: string;
    revenue: number;
  }[];
}

export function DashboardSalesTrendChart({ data }: SalesChartProps) {
  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-3">
      <CardHeader>
        <CardTitle>Sales Trends</CardTitle>
        <CardDescription>
          Daily revenue overview for the selected period.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <BarChart
            data={data}
            maxBarSize={48}
            margin={{
              top: 12,
              left: 0,
              right: 12,
              bottom: 4,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(`${value}T00:00:00`);
                return format(date, 'MMM dd');
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={55}
              domain={[0, 'auto']}
              allowDecimals={false}
              tickFormatter={formatYAxisPrice}
            />
            <ChartTooltip
              content={(
                <ChartTooltipContent
                  className="w-[150px]"
                  labelFormatter={(value) => {
                    return format(new Date(`${value}T00:00:00`), 'MMM dd, yyyy');
                  }}
                  formatter={value => formatINR(Number(value))}
                />
              )}
            />
            <Bar
              dataKey="revenue"
              fill="var(--color-revenue)"
              radius={[4, 4, 0, 0]}
              maxBarSize={48}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
