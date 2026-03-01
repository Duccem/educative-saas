"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileEdit } from "lucide-react";
import { motion } from "framer-motion";

export interface TeacherUpcoming {
  id: string;
  type: "assignment" | "exam" | "meeting";
  title: string;
  date: string;
  className: string;
}

export const teacherUpcoming: TeacherUpcoming[] = [
  { id: "1", type: "assignment", title: "Algebra Quiz #5", date: "2026-03-03", className: "1st Grade A" },
  { id: "2", type: "exam", title: "Calculus Midterm", date: "2026-03-07", className: "3rd Grade A & B" },
  { id: "3", type: "meeting", title: "Parent-Teacher Conference", date: "2026-03-10", className: "" },
  { id: "4", type: "assignment", title: "Statistics Homework #8", date: "2026-03-04", className: "2nd Grade A" },
  { id: "5", type: "meeting", title: "Department Meeting", date: "2026-03-05", className: "" },
];

export function TeacherUpcomingEvents() {
  return (
    <Card className="glass-card border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-display flex items-center gap-2">
          <FileEdit className="h-4 w-4 text-primary" />
          Upcoming Tasks & Events
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {teacherUpcoming.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-3 rounded-lg bg-muted/40 border border-border/30"
            >
              <div className="flex items-center gap-2 mb-1">
                <Badge
                  variant={item.type === "exam" ? "destructive" : item.type === "assignment" ? "default" : "secondary"}
                  className="text-xs"
                >
                  {item.type}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              </div>
              <p className="text-sm font-medium text-foreground">{item.title}</p>
              {item.className && <p className="text-xs text-muted-foreground">{item.className}</p>}
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

