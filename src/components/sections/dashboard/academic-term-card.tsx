"use client";
import { motion } from "framer-motion";
import { Calendar, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface AcademicTerm {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: "active" | "upcoming" | "completed";
  year: string;
}

export const academicTerms: AcademicTerm[] = [
  {
    id: "1",
    name: "Fall Semester 2025",
    startDate: "2025-09-01",
    endDate: "2025-12-20",
    status: "completed",
    year: "2025",
  },
  {
    id: "2",
    name: "Spring Semester 2026",
    startDate: "2026-01-15",
    endDate: "2026-05-30",
    status: "active",
    year: "2026",
  },
  {
    id: "3",
    name: "Summer Term 2026",
    startDate: "2026-06-15",
    endDate: "2026-08-15",
    status: "upcoming",
    year: "2026",
  },
];

const statusStyles: Record<string, string> = {
  active: "bg-emerald-500/15 text-emerald-500 border-emerald-500/20",
  upcoming: "bg-blue-500/15 text-blue-500 border-blue-500/20",
  completed: "bg-muted text-muted-foreground border-border",
};

export function AcademicTermsCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className="bg-card rounded-xl overflow-hidden"
    >
      <div className="p-5 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-accent" />
          <h3 className="font-display font-semibold text-foreground">Academic Terms</h3>
        </div>
        <button className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
          View all <ChevronRight className="h-3 w-3" />
        </button>
      </div>
      <div className="divide-y divide-border">
        {academicTerms.map((term) => (
          <div
            key={term.id}
            className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors cursor-pointer"
          >
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-foreground">{term.name}</span>
              <span className="text-xs text-muted-foreground">
                {term.startDate} — {term.endDate}
              </span>
            </div>
            <Badge variant="outline" className={statusStyles[term.status]}>
              {term.status}
            </Badge>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

