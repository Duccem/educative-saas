"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { motion } from "framer-motion";

export interface StudentAssignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  status: "pending" | "submitted" | "graded";
  grade?: number;
}

export const studentAssignments: StudentAssignment[] = [
  { id: "1", title: "Derivatives Practice Set", subject: "Calculus", dueDate: "2026-03-03", status: "pending" },
  { id: "2", title: "Lab Report: Electromagnetic Waves", subject: "Physics", dueDate: "2026-03-04", status: "pending" },
  {
    id: "3",
    title: "Essay: Themes in Hamlet",
    subject: "English Literature",
    dueDate: "2026-03-05",
    status: "submitted",
  },
  {
    id: "4",
    title: "Conjugation Worksheet Ch.8",
    subject: "Spanish",
    dueDate: "2026-02-28",
    status: "graded",
    grade: 88,
  },
  {
    id: "5",
    title: "Short Story Draft",
    subject: "Creative Writing",
    dueDate: "2026-02-27",
    status: "graded",
    grade: 95,
  },
  { id: "6", title: "Kinematics Problem Set", subject: "Physics", dueDate: "2026-02-25", status: "graded", grade: 82 },
];

const statusColors: Record<string, string> = {
  pending: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  submitted: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
  graded: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
};

export function Assignments() {
  return (
    <Card className="glass-card border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-display flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          Recent Assignments
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {studentAssignments.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/40"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{a.title}</p>
                <p className="text-xs text-muted-foreground">
                  {a.subject} · Due{" "}
                  {new Date(a.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {a.grade !== undefined && <span className="text-sm font-bold text-foreground">{a.grade}%</span>}
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[a.status]}`}>
                  {a.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

