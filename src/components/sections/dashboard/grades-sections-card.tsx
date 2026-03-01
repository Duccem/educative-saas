"use client";
import { motion } from "framer-motion";
import { Layers, Users, ChevronRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { grades } from "./enrollment-chart";

export interface Section {
  id: string;
  name: string;
  gradeId: string;
  gradeName: string;
  capacity: number;
  enrolled: number;
  tutorName: string;
}

export const sections: Section[] = [
  {
    id: "1",
    name: "Section A",
    gradeId: "1",
    gradeName: "1st Grade",
    capacity: 28,
    enrolled: 24,
    tutorName: "Ms. Johnson",
  },
  {
    id: "2",
    name: "Section B",
    gradeId: "1",
    gradeName: "1st Grade",
    capacity: 28,
    enrolled: 26,
    tutorName: "Mr. Williams",
  },
  {
    id: "3",
    name: "Section C",
    gradeId: "1",
    gradeName: "1st Grade",
    capacity: 28,
    enrolled: 22,
    tutorName: "Ms. Davis",
  },
  {
    id: "4",
    name: "Section A",
    gradeId: "2",
    gradeName: "2nd Grade",
    capacity: 30,
    enrolled: 24,
    tutorName: "Mrs. Brown",
  },
  {
    id: "5",
    name: "Section B",
    gradeId: "2",
    gradeName: "2nd Grade",
    capacity: 30,
    enrolled: 22,
    tutorName: "Mr. Garcia",
  },
  {
    id: "6",
    name: "Section C",
    gradeId: "2",
    gradeName: "2nd Grade",
    capacity: 30,
    enrolled: 22,
    tutorName: "Ms. Martinez",
  },
  {
    id: "7",
    name: "Section A",
    gradeId: "3",
    gradeName: "3rd Grade",
    capacity: 28,
    enrolled: 26,
    tutorName: "Mr. Anderson",
  },
  {
    id: "8",
    name: "Section B",
    gradeId: "3",
    gradeName: "3rd Grade",
    capacity: 28,
    enrolled: 25,
    tutorName: "Ms. Thomas",
  },
  {
    id: "9",
    name: "Section C",
    gradeId: "3",
    gradeName: "3rd Grade",
    capacity: 28,
    enrolled: 24,
    tutorName: "Mrs. Jackson",
  },
  {
    id: "10",
    name: "Section A",
    gradeId: "4",
    gradeName: "4th Grade",
    capacity: 30,
    enrolled: 28,
    tutorName: "Mr. White",
  },
  {
    id: "11",
    name: "Section B",
    gradeId: "4",
    gradeName: "4th Grade",
    capacity: 30,
    enrolled: 28,
    tutorName: "Ms. Harris",
  },
];

export function GradesSectionsCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      className="bg-card rounded-xl overflow-hidden"
    >
      <div className="p-5 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-accent" />
          <h3 className="font-display font-semibold text-foreground">Grades & Sections</h3>
        </div>
        <button className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
          View all <ChevronRight className="h-3 w-3" />
        </button>
      </div>
      <div className="p-4 space-y-3">
        {grades.slice(0, 5).map((grade, i) => {
          const gradeSections = sections.filter((s) => s.gradeId === grade.id);
          return (
            <motion.div
              key={grade.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.55 + i * 0.05 }}
              className="rounded-lg border border-border p-3 hover:border-accent/40 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-foreground">{grade.name}</span>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {grade.studentsCount}
                  </span>
                  <span>{grade.sectionsCount} sections</span>
                </div>
              </div>
              <div className="flex gap-2">
                {gradeSections.map((section) => {
                  const pct = Math.round((section.enrolled / section.capacity) * 100);
                  return (
                    <div key={section.id} className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground">{section.name}</span>
                        <span className="text-xs text-muted-foreground">{pct}%</span>
                      </div>
                      <Progress value={pct} className="h-1.5" />
                    </div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

