"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Progress } from "@/components/ui/progress";
import { BarChart3 } from "lucide-react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
import { studentProfile } from "./metrics-student";

export const studentGradeOverview = [
  { subject: "Calculus", current: 85, midterm: 78, quizAvg: 90 },
  { subject: "Physics", current: 82, midterm: 80, quizAvg: 84 },
  { subject: "English Lit.", current: 95, midterm: 92, quizAvg: 96 },
  { subject: "Spanish", current: 85, midterm: 88, quizAvg: 82 },
  { subject: "Phys. Ed.", current: 98, midterm: 97, quizAvg: 99 },
  { subject: "Creative Writing", current: 92, midterm: 90, quizAvg: 94 },
];

const chartConfig = {
  current: {
    label: "Current",
    color: "var(--chart-1)",
  },
  midterm: {
    label: "Mid Term",
    color: "var(--chart-2)",
  },
  quizAvg: {
    label: "Quiz Average",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export function GradeOverview() {
  const assignmentProgress = Math.round((studentProfile.completedAssignments / studentProfile.totalAssignments) * 100);
  return (
    <Card className="glass-card border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-display flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-primary" />
          Grade Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <RadarChart data={studentGradeOverview} cx="50%" cy="50%">
            <PolarGrid stroke="var(--border)" />
            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
            <Radar dataKey="current" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.2} strokeWidth={2} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          </RadarChart>
        </ChartContainer>
        <div className="mt-2 text-center">
          <p className="text-xs text-muted-foreground">Overall Progress</p>
          <Progress value={assignmentProgress} className="h-1.5 mt-1" />
          <p className="text-xs text-muted-foreground mt-1">{assignmentProgress}% assignments complete</p>
        </div>
      </CardContent>
    </Card>
  );
}

