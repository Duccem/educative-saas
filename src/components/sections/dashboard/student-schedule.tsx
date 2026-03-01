"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { CalendarDays } from "lucide-react";

export interface StudentScheduleItem {
  id: string;
  time: string;
  subject: string;
  teacher: string;
  room: string;
}

export const studentSchedule: StudentScheduleItem[] = [
  { id: "1", time: "8:00 – 9:00", subject: "Calculus", teacher: "Dr. Sarah Mitchell", room: "Room 201" },
  { id: "2", time: "9:15 – 10:15", subject: "Physics", teacher: "Dr. Robert Taylor", room: "Lab 3" },
  { id: "3", time: "10:30 – 11:30", subject: "English Literature", teacher: "Ms. Amanda Foster", room: "Room 105" },
  { id: "4", time: "11:45 – 12:45", subject: "Spanish", teacher: "Sra. Maria Gonzalez", room: "Room 302" },
  { id: "5", time: "14:00 – 15:00", subject: "Physical Education", teacher: "Coach Williams", room: "Gymnasium" },
  { id: "6", time: "15:15 – 16:00", subject: "Creative Writing", teacher: "Mr. David Park", room: "Room 110" },
];

export function StudentSchedule() {
  return (
    <Card className=" border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-display flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-primary" />
          Today's Schedule
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {studentSchedule.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-4 p-3 rounded-lg bg-muted/40 hover:bg-muted/70 transition-colors"
          >
            <div className="w-24 shrink-0">
              <span className="text-xs font-mono font-medium text-primary">{item.time}</span>
            </div>
            <div className="h-8 w-1 rounded-full bg-primary/30" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{item.subject}</p>
              <p className="text-xs text-muted-foreground">
                {item.teacher} · {item.room}
              </p>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}

