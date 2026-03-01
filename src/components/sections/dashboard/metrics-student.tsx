"use client";

import { Award, BarChart3, BookOpen, CheckCircle } from "lucide-react";
import { StatCard } from "./stat-card";

export const studentProfile = {
  name: "Emma Thompson",
  initials: "ET",
  grade: "3rd Grade",
  section: "Section A",
  gpa: 3.7,
  rank: 5,
  totalStudents: 75,
  attendanceRate: 96,
  completedAssignments: 42,
  totalAssignments: 45,
};

export function MetricsStudent() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <StatCard title="GPA" value={studentProfile.gpa} icon={Award} index={0} />
      <StatCard
        title="Class Rank"
        value={`#${studentProfile.rank}`}
        subtitle={`of ${studentProfile.totalStudents}`}
        icon={BarChart3}
        index={1}
      />
      <StatCard
        title="Attendance"
        value={`${studentProfile.attendanceRate}%`}
        icon={CheckCircle}
        trend={{ value: 1.2, positive: true }}
        index={2}
      />
      <StatCard
        title="Assignments"
        value={`${studentProfile.completedAssignments}/${studentProfile.totalAssignments}`}
        icon={BookOpen}
        index={3}
      />
    </div>
  );
}

