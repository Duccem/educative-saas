"use client";
import { motion } from "framer-motion";
import { BookOpen, Users, FileText, ChevronRight } from "lucide-react";

export interface Course {
  id: string;
  name: string;
  code: string;
  termId: string;
  studentsCount: number;
  subjectsCount: number;
  color: string;
}

export const courses: Course[] = [
  {
    id: "1",
    name: "Mathematics",
    code: "MATH",
    termId: "2",
    studentsCount: 145,
    subjectsCount: 4,
    color: "hsl(220, 60%, 22%)",
  },
  {
    id: "2",
    name: "Natural Sciences",
    code: "SCI",
    termId: "2",
    studentsCount: 132,
    subjectsCount: 3,
    color: "hsl(152, 58%, 42%)",
  },
  {
    id: "3",
    name: "Language Arts",
    code: "LANG",
    termId: "2",
    studentsCount: 160,
    subjectsCount: 5,
    color: "hsl(38, 92%, 55%)",
  },
  {
    id: "4",
    name: "Social Studies",
    code: "SOC",
    termId: "2",
    studentsCount: 128,
    subjectsCount: 3,
    color: "hsl(205, 78%, 52%)",
  },
  {
    id: "5",
    name: "Physical Education",
    code: "PE",
    termId: "2",
    studentsCount: 180,
    subjectsCount: 2,
    color: "hsl(0, 72%, 55%)",
  },
  {
    id: "6",
    name: "Arts & Music",
    code: "ART",
    termId: "2",
    studentsCount: 95,
    subjectsCount: 3,
    color: "hsl(280, 55%, 50%)",
  },
];

export function CoursesGrid() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.4 }}
      className="bg-card rounded-xl overflow-hidden"
    >
      <div className="p-5 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-accent" />
          <h3 className="font-display font-semibold text-foreground">Courses</h3>
        </div>
        <button className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
          View all <ChevronRight className="h-3 w-3" />
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4">
        {courses.map((course, i) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.45 + i * 0.05 }}
            className="group rounded-lg border border-border p-4 hover:border-accent/40 hover:shadow-sm transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="h-2 w-10 rounded-full" style={{ backgroundColor: course.color }} />
              <span className="text-xs text-muted-foreground font-mono">{course.code}</span>
            </div>
            <h4 className="text-sm font-semibold text-foreground mb-2">{course.name}</h4>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {course.studentsCount}
              </span>
              <span className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                {course.subjectsCount} subjects
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

