import { database } from "@/lib/database";
import { member } from "@/lib/database/schema";
import { and, eq, inArray } from "drizzle-orm";

export const assertAdminAccess = async ({
  organizationId,
  userId,
}: {
  organizationId: string;
  userId: string;
}) => {
  const organizationMembership = await database.query.member.findFirst({
    where: and(
      eq(member.organizationId, organizationId),
      eq(member.userId, userId),
      inArray(member.role, ["admin", "superadmin"]),
    ),
  });

  if (!organizationMembership) {
    throw new Error("Admin access required for this tool.");
  }
};

