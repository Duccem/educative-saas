"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export interface TeacherClass {
  id: string;
  subjectName: string;
  subjectCode: string;
  gradeName: string;
  sectionName: string;
  schedule: string;
  studentsCount: number;
  avgGrade: number;
}

export const teacherClasses: TeacherClass[] = [
  {
    id: "1",
    subjectName: "Algebra I",
    subjectCode: "MATH-101",
    gradeName: "1st Grade",
    sectionName: "Section A",
    schedule: "Mon/Wed/Fri 8:00–9:00",
    studentsCount: 24,
    avgGrade: 85,
  },
  {
    id: "2",
    subjectName: "Algebra I",
    subjectCode: "MATH-101",
    gradeName: "1st Grade",
    sectionName: "Section B",
    schedule: "Mon/Wed/Fri 9:15–10:15",
    studentsCount: 26,
    avgGrade: 78,
  },
  {
    id: "3",
    subjectName: "Calculus",
    subjectCode: "MATH-201",
    gradeName: "3rd Grade",
    sectionName: "Section A",
    schedule: "Tue/Thu 10:30–12:00",
    studentsCount: 26,
    avgGrade: 72,
  },
  {
    id: "4",
    subjectName: "Calculus",
    subjectCode: "MATH-201",
    gradeName: "3rd Grade",
    sectionName: "Section B",
    schedule: "Tue/Thu 13:00–14:30",
    studentsCount: 25,
    avgGrade: 80,
  },
  {
    id: "5",
    subjectName: "Statistics",
    subjectCode: "MATH-103",
    gradeName: "2nd Grade",
    sectionName: "Section A",
    schedule: "Wed/Fri 14:00–15:00",
    studentsCount: 24,
    avgGrade: 88,
  },
];

export function TeacherClasses() {
  return (
    <Card className="bg-card border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-display flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-primary" />
          My Classes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {teacherClasses.map((cls, i) => (
          <motion.div
            key={cls.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            className="flex items-center justify-between p-3 rounded-lg bg-muted/40 hover:bg-muted/70 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm text-foreground">{cls.subjectName}</span>
                <Badge variant="outline" className="text-xs font-mono">
                  {cls.subjectCode}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {cls.gradeName} · {cls.sectionName} · {cls.schedule}
              </p>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <div className="text-right">
                <p className="text-sm font-semibold text-foreground">{cls.studentsCount}</p>
                <p className="text-xs text-muted-foreground">students</p>
              </div>
              <div className="w-16">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-foreground">{cls.avgGrade}%</span>
                </div>
                <Progress value={cls.avgGrade} className="h-1.5" />
              </div>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}

