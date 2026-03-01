"use client";
import { Users, BookOpen, Layers, TrendingUp, GraduationCap, Award } from "lucide-react";
import { StatCard } from "./stat-card";

export const dashboardStats = {
  totalStudents: 486,
  totalTeachers: 38,
  totalCourses: 6,
  totalSections: 20,
  attendanceRate: 94.2,
  averageGPA: 3.4,
};
export const MetricsAdmin = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
      <StatCard
        title="Students"
        value={dashboardStats.totalStudents}
        icon={Users}
        trend={{ value: 3.2, positive: true }}
        index={0}
      />
      <StatCard title="Teachers" value={dashboardStats.totalTeachers} icon={GraduationCap} index={1} />
      <StatCard title="Courses" value={dashboardStats.totalCourses} icon={BookOpen} index={2} />
      <StatCard title="Sections" value={dashboardStats.totalSections} icon={Layers} index={3} />
      <StatCard
        title="Attendance"
        value={`${dashboardStats.attendanceRate}%`}
        icon={TrendingUp}
        trend={{ value: 1.5, positive: true }}
        index={4}
      />
      <StatCard title="Avg GPA" value={dashboardStats.averageGPA} icon={Award} index={5} />
    </div>
  );
};

