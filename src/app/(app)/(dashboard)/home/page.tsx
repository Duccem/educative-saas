import { requireAuth, requireOrganizations } from "@/lib/auth/guards";
import { auth } from "@/lib/auth/auth-server";
import { headers } from "next/headers";
import { AdminDashboardLayout } from "@/components/sections/dashboard/layouts/admin-dashboard-layout";
import { TeacherDashboardLayout } from "@/components/sections/dashboard/layouts/teacher-dashboard-layout";
import { ParentDashboardLayout } from "@/components/sections/dashboard/layouts/parent-dashboard-layout";
import { StudentDashboardLayout } from "@/components/sections/dashboard/layouts/student-dashboard-layout";

export default async function Page() {
  const session = await requireAuth();
  await requireOrganizations();
  const role = await auth.api.getActiveMemberRole({
    headers: await headers(),
  });
  switch (role.role) {
    case "admin":
      return <AdminDashboardLayout session={session} />;
    case "teacher":
      return <TeacherDashboardLayout session={session} />;
    case "parent":
      return <ParentDashboardLayout session={session} />;
    case "student":
      return <StudentDashboardLayout session={session} />;
    default:
      return <div></div>;
  }
}

