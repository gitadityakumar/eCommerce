'use client';

import type { DateRange } from 'react-day-picker';
import { addDays, format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export function DashboardDateRangePicker({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const fromParam = searchParams.get('from');
  const toParam = searchParams.get('to');

  const [date, setDate] = React.useState<DateRange | undefined>(() => {
    return fromParam && toParam
      ? { from: new Date(fromParam), to: new Date(toParam) }
      : undefined;
  });

  React.useEffect(() => {
    if (!fromParam || !toParam) {
      setDate({
        from: addDays(new Date(), -30),
        to: new Date(),
      });
    }
  }, [fromParam, toParam]);

  const handleSelect = (range: DateRange | undefined) => {
    setDate(range);
    if (range?.from && range?.to) {
      const params = new URLSearchParams(searchParams);
      params.set('from', range.from.toISOString());
      params.set('to', range.to.toISOString());
      router.push(`?${params.toString()}`);
    }
  };

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              'w-[300px] justify-start text-left font-medium rounded-full border-border-subtle bg-surface/50 hover:bg-accent/5 hover:text-accent hover:border-accent/40 transition-all duration-300',
              !date && 'text-text-secondary',
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 opacity-60" />
            {date?.from
              ? (
                  date.to
                    ? (
                        <>
                          {format(date.from, 'LLL dd, y')}
                          {' '}
                          -
                          {' '}
                          {format(date.to, 'LLL dd, y')}
                        </>
                      )
                    : (
                        format(date.from, 'LLL dd, y')
                      )
                )
              : (
                  <span>Pick a date</span>
                )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
