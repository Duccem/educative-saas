import { getRequiredContext } from "@/lib/agents/utils";
import { database } from "@/lib/database";
import { invitation } from "@/lib/database/schema";
import { and, eq } from "drizzle-orm";
import { tool } from "ai";
import z from "zod";
import { assertAdminAccess } from "./assert-admin-access";

export const listPendingInvitations = tool({
  description:
    "List pending organization invitations, optionally filtered by role.",
  inputSchema: z.object({
    role: z.string().optional(),
  }),
  execute: async ({ role }, options) => {
    const { organizationId, userId } = getRequiredContext(
      options.experimental_context,
    );

    await assertAdminAccess({ organizationId, userId });

    const invitations = await database.query.invitation.findMany({
      where: and(eq(invitation.organizationId, organizationId)),
      with: {
        inviter: true,
      },
    });

    const items = invitations
      .filter((entry) => entry.status.toLowerCase() === "pending")
      .filter((entry) => (role ? entry.role === role : true))
      .map((entry) => ({
        id: entry.id,
        email: entry.email,
        role: entry.role,
        status: entry.status,
        expiresAt: entry.expiresAt,
        inviter: {
          id: entry.inviter.id,
          name: entry.inviter.name,
          email: entry.inviter.email,
        },
        createdAt: entry.createdAt,
      }));

    return {
      total: items.length,
      items,
    };
  },
});

