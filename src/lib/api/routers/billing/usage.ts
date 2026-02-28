import { database } from "@/lib/database";
import { protectedProcedure } from "../..";
import { section, user } from "@/lib/database/schema";
import { count, eq } from "drizzle-orm";
import { auth } from "@/lib/auth/auth-server";
import { headers } from "next/headers";

export const usage = protectedProcedure
  .route({ method: "GET", path: "/usage", inputStructure: "detailed" })
  .handler(async ({ context: { organization } }) => {
    const [sections, members] = await Promise.all([
      database
        .select({ count: count(user.id) })
        .from(section)
        .where(eq(section.organization_id, organization.id)),
      auth.api.listMembers({
        headers: await headers(),
        query: {
          filterField: "role",
          filterValue: "student",
          filterOperator: "eq",
        },
      }),
    ]);

    return {
      sections: sections[0].count,
      students: members.total,
      ai_usage: 0,
    };
  });

