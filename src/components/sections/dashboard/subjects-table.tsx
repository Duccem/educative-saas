"use client";
import { motion } from "framer-motion";
import { FileText, ChevronRight, Clock } from "lucide-react";
import { courses } from "./courses-grid";

export interface Subject {
  id: string;
  name: string;
  code: string;
  courseId: string;
  teacherName: string;
  hoursPerWeek: number;
}

export const subjects: Subject[] = [
  { id: "1", name: "Algebra I", code: "MATH-101", courseId: "1", teacherName: "Dr. Sarah Mitchell", hoursPerWeek: 5 },
  { id: "2", name: "Geometry", code: "MATH-102", courseId: "1", teacherName: "Prof. James Wilson", hoursPerWeek: 4 },
  { id: "3", name: "Calculus", code: "MATH-201", courseId: "1", teacherName: "Dr. Sarah Mitchell", hoursPerWeek: 5 },
  { id: "4", name: "Statistics", code: "MATH-103", courseId: "1", teacherName: "Ms. Elena Rodriguez", hoursPerWeek: 3 },
  { id: "5", name: "Biology", code: "SCI-101", courseId: "2", teacherName: "Dr. Michael Chen", hoursPerWeek: 5 },
  { id: "6", name: "Chemistry", code: "SCI-102", courseId: "2", teacherName: "Prof. Laura Kim", hoursPerWeek: 4 },
  { id: "7", name: "Physics", code: "SCI-201", courseId: "2", teacherName: "Dr. Robert Taylor", hoursPerWeek: 5 },
  {
    id: "8",
    name: "English Literature",
    code: "LANG-101",
    courseId: "3",
    teacherName: "Ms. Amanda Foster",
    hoursPerWeek: 4,
  },
  {
    id: "9",
    name: "Creative Writing",
    code: "LANG-102",
    courseId: "3",
    teacherName: "Mr. David Park",
    hoursPerWeek: 3,
  },
  { id: "10", name: "Spanish", code: "LANG-201", courseId: "3", teacherName: "Sra. Maria Gonzalez", hoursPerWeek: 4 },
];

export function SubjectsTable() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.4 }}
      className="bg-card rounded-xl overflow-hidden"
    >
      <div className="p-5 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-accent" />
          <h3 className="font-display font-semibold text-foreground">Subjects</h3>
        </div>
        <button className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
          View all <ChevronRight className="h-3 w-3" />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Subject
              </th>
              <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell">
                Code
              </th>
              <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                Course
              </th>
              <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Teacher
              </th>
              <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell">
                Hours/Week
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {subjects.slice(0, 7).map((subject) => {
              const course = courses.find((c) => c.id === subject.courseId);
              return (
                <tr key={subject.id} className="hover:bg-muted/20 transition-colors cursor-pointer">
                  <td className="py-2.5 px-4 font-medium text-foreground">{subject.name}</td>
                  <td className="py-2.5 px-4 text-muted-foreground font-mono text-xs hidden sm:table-cell">
                    {subject.code}
                  </td>
                  <td className="py-2.5 px-4 hidden md:table-cell">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: course?.color }} />
                      <span className="text-muted-foreground">{course?.name}</span>
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-muted-foreground">{subject.teacherName}</td>
                  <td className="py-2.5 px-4 hidden sm:table-cell">
                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {subject.hoursPerWeek}h
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

