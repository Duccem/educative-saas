"use client";
import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export interface Grade {
  id: string;
  name: string;
  level: number;
  sectionsCount: number;
  studentsCount: number;
}

export const grades: Grade[] = [
  { id: "1", name: "1st Grade", level: 1, sectionsCount: 3, studentsCount: 72 },
  { id: "2", name: "2nd Grade", level: 2, sectionsCount: 3, studentsCount: 68 },
  { id: "3", name: "3rd Grade", level: 3, sectionsCount: 3, studentsCount: 75 },
  { id: "4", name: "4th Grade", level: 4, sectionsCount: 2, studentsCount: 56 },
  { id: "5", name: "5th Grade", level: 5, sectionsCount: 3, studentsCount: 70 },
  { id: "6", name: "6th Grade", level: 6, sectionsCount: 2, studentsCount: 52 },
  { id: "7", name: "7th Grade", level: 7, sectionsCount: 2, studentsCount: 48 },
  { id: "8", name: "8th Grade", level: 8, sectionsCount: 2, studentsCount: 45 },
];

const chartData = grades.map((g) => ({
  name: g.name.replace(" Grade", ""),
  students: g.studentsCount,
  sections: g.sectionsCount,
}));

export function EnrollmentChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.4 }}
      className="bg-card rounded-xl overflow-hidden"
    >
      <div className="p-5 border-b border-border flex items-center gap-2">
        <BarChart3 className="h-4 w-4 text-accent" />
        <h3 className="font-display font-semibold text-foreground">Enrollment by Grade</h3>
      </div>
      <div className="p-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 18%, 90%)" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: "hsl(220, 15%, 46%)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis tick={{ fontSize: 11, fill: "hsl(220, 15%, 46%)" }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                background: "hsl(0, 0%, 100%)",
                border: "1px solid hsl(220, 18%, 90%)",
                borderRadius: "8px",
                fontSize: "12px",
                boxShadow: "0 4px 12px hsl(220 40% 13% / 0.08)",
              }}
            />
            <Bar dataKey="students" fill="hsl(220, 60%, 22%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

