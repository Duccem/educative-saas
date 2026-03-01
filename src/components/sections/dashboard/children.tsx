"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

export interface ChildInfo {
  id: string;
  name: string;
  grade: string;
  section: string;
  gpa: number;
  attendance: number;
  avatar: string;
}

export const children: ChildInfo[] = [
  { id: "1", name: "Emma Thompson", grade: "3rd Grade", section: "Section A", gpa: 3.7, attendance: 96, avatar: "ET" },
  { id: "2", name: "Liam Thompson", grade: "1st Grade", section: "Section B", gpa: 3.4, attendance: 92, avatar: "LT" },
];

export function Children() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {children.map((child, i) => (
        <motion.div
          key={child.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <Card className="bg-card border-border/50">
            <CardContent className="pt-5">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-primary-foreground">{child.avatar}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground font-display">{child.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {child.grade} · {child.section}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-muted/40">
                  <p className="text-xs text-muted-foreground mb-1">GPA</p>
                  <p className="text-xl font-bold font-display text-foreground">{child.gpa}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/40">
                  <p className="text-xs text-muted-foreground mb-1">Attendance</p>
                  <p className="text-xl font-bold font-display text-foreground">{child.attendance}%</p>
                  <Progress value={child.attendance} className="h-1 mt-1" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

