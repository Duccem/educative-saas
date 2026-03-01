import { BetterSession } from "@/lib/auth/auth-server";
import { MetricsStudent } from "../metrics-student";
import { StudentSchedule } from "../student-schedule";
import { GradeOverview } from "../grade-overview";
import { Assignments } from "../assignments";

export const StudentDashboardLayout = ({ session }: { session: BetterSession }) => {
  return (
    <div className="flex w-full mx-auto flex-col gap-6 pb-10">
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Good morning, {session.user.name}</p>
      </div>
      <MetricsStudent />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <StudentSchedule />
        <GradeOverview />
      </div>
      <Assignments />
    </div>
  );
};

