"use client";

import { BookOpen, ClipboardList, TrendingUp, Users } from "lucide-react";
import { StatCard } from "./stat-card";

export const teacherProfile = {
  name: "Dr. Sarah Mitchell",
  initials: "SM",
  role: "Mathematics Department",
  totalStudents: 145,
  classesToday: 4,
  pendingGrading: 23,
  avgClassPerformance: 82,
};

export function MetricsTeacher() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <StatCard title="My Students" value={teacherProfile.totalStudents} icon={Users} index={0} />
      <StatCard title="Classes Today" value={teacherProfile.classesToday} icon={BookOpen} index={1} />
      <StatCard
        title="Pending Grading"
        value={teacherProfile.pendingGrading}
        icon={ClipboardList}
        trend={{ value: 5, positive: false }}
        index={2}
      />
      <StatCard
        title="Avg Performance"
        value={`${teacherProfile.avgClassPerformance}%`}
        icon={TrendingUp}
        trend={{ value: 2.1, positive: true }}
        index={3}
      />
    </div>
  );
}

