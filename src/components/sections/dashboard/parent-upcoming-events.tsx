"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, CalendarDays, CreditCard } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export interface ParentEvent {
  id: string;
  title: string;
  date: string;
  type: "academic" | "event" | "payment";
}

export const parentEvents: ParentEvent[] = [
  { id: "1", title: "Parent-Teacher Conference", date: "2026-03-10", type: "academic" },
  { id: "2", title: "Science Fair", date: "2026-03-15", type: "event" },
  { id: "3", title: "Tuition Payment Due", date: "2026-03-20", type: "payment" },
  { id: "4", title: "Spring Break Begins", date: "2026-04-01", type: "event" },
  { id: "5", title: "Report Cards Released", date: "2026-03-25", type: "academic" },
];

const eventIcon = (type: string) => {
  if (type === "academic") return <BookOpen className="h-3.5 w-3.5" />;
  if (type === "payment") return <CreditCard className="h-3.5 w-3.5" />;
  return <CalendarDays className="h-3.5 w-3.5" />;
};

export function ParentUpcomingEvents() {
  return (
    <Card className="glass-card border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-display flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-primary" />
          Upcoming Events
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {parentEvents.map((ev, i) => (
            <motion.div
              key={ev.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-center gap-3 p-3 rounded-lg bg-muted/40"
            >
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                {eventIcon(ev.type)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{ev.title}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(ev.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                </p>
              </div>
              <Badge
                variant={ev.type === "payment" ? "destructive" : ev.type === "academic" ? "default" : "secondary"}
                className="text-xs"
              >
                {ev.type}
              </Badge>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

