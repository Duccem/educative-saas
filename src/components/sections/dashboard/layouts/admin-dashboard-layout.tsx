import { format } from "date-fns";
import { MetricsAdmin } from "../metrics-admin";
import { AcademicTermsCard } from "../academic-term-card";
import { EnrollmentChart } from "../enrollment-chart";
import { CoursesGrid } from "../courses-grid";
import { GradesSectionsCard } from "../grades-sections-card";
import { SubjectsTable } from "../subjects-table";
import { BetterSession } from "@/lib/auth/auth-server";

export const AdminDashboardLayout = ({ session }: { session: BetterSession }) => {
  return (
    <div className="flex w-full mx-auto flex-col gap-6 pb-10">
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {format(new Date(), "PPp")} · Welcome back, {session.user.name}!
        </p>
      </div>
      <MetricsAdmin />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AcademicTermsCard />
        <EnrollmentChart />
      </div>
      <CoursesGrid />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GradesSectionsCard />
        <SubjectsTable />
      </div>
    </div>
  );
};

