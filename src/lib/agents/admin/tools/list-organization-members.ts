import { getRequiredContext } from "@/lib/agents/utils";
import { database } from "@/lib/database";
import { member } from "@/lib/database/schema";
import { and, eq } from "drizzle-orm";
import { tool } from "ai";
import z from "zod";
import { assertAdminAccess } from "./assert-admin-access";

export const listOrganizationMembers = tool({
  description:
    "List organization members, optionally filtering by role or search term.",
  inputSchema: z.object({
    role: z.string().optional(),
    term: z.string().min(1).optional(),
  }),
  execute: async ({ role, term }, options) => {
    const { organizationId, userId } = getRequiredContext(
      options.experimental_context,
    );

    await assertAdminAccess({ organizationId, userId });

    const memberships = await database.query.member.findMany({
      where: and(eq(member.organizationId, organizationId)),
      with: {
        user: true,
      },
    });

    const normalizedTerm = term?.trim().toLowerCase();

    const items = memberships
      .map((entry) => ({
        memberId: entry.id,
        userId: entry.userId,
        role: entry.role,
        name: entry.user.name,
        email: entry.user.email,
        createdAt: entry.createdAt,
      }))
      .filter((entry) => (role ? entry.role === role : true))
      .filter((entry) => {
        if (!normalizedTerm) return true;

        return (
          entry.name.toLowerCase().includes(normalizedTerm) ||
          entry.email.toLowerCase().includes(normalizedTerm) ||
          entry.role.toLowerCase().includes(normalizedTerm)
        );
      });

    return {
      total: items.length,
      items,
    };
  },
});

