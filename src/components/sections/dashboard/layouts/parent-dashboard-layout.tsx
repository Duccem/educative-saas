import { BetterSession } from "@/lib/auth/auth-server";
import { Children } from "../children";
import { ChildrenGrades } from "../children-grades";
import { ParentUpcomingEvents } from "../parent-upcoming-events";

export const ParentDashboardLayout = ({ session }: { session: BetterSession }) => {
  return (
    <div className="flex w-full mx-auto flex-col gap-6 pb-10">
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Good morning, {session.user.name}</p>
      </div>
      <Children />
      <ChildrenGrades />
      <ParentUpcomingEvents />
    </div>
  );
};

