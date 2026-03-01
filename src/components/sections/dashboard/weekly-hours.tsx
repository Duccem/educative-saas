"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { CalendarDays } from "lucide-react";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const teacherWeeklyHours = [
  { day: "Mon", hours: 5 },
  { day: "Tue", hours: 3 },
  { day: "Wed", hours: 6 },
  { day: "Thu", hours: 3 },
  { day: "Fri", hours: 5 },
];

const chartConfig = {
  views: {
    label: "Page Views",
  },
  hours: {
    label: "Hours",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function WeeklyHours() {
  return (
    <Card className=" border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-display flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-primary" />
          Weekly Hours
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={teacherWeeklyHours}>
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
            <YAxis hide />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="day"
                  labelFormatter={(value) => {
                    return value;
                  }}
                />
              }
            />
            <Bar dataKey="hours" radius={[6, 6, 0, 0]} fill={`var(--color-hours)`} />
          </BarChart>
        </ChartContainer>
        <p className="text-center text-xs text-muted-foreground mt-2">
          Total: {teacherWeeklyHours.reduce((a, b) => a + b.hours, 0)} hours/week
        </p>
      </CardContent>
    </Card>
  );
}

