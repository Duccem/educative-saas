import { BetterSession } from "@/lib/auth/auth-server";
import { MetricsTeacher } from "../metrics-teacher";
import { TeacherClasses } from "../teacher-classes";
import { WeeklyHours } from "../weekly-hours";
import { TeacherUpcomingEvents } from "../teacher-upcoming-events";

export const TeacherDashboardLayout = ({ session }: { session: BetterSession }) => {
  return (
    <div className="flex w-full mx-auto flex-col gap-6 pb-10">
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Good morning, {session.user.name}</p>
      </div>
      <MetricsTeacher />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TeacherClasses />
        <WeeklyHours />
      </div>
      <TeacherUpcomingEvents />
    </div>
  );
};

