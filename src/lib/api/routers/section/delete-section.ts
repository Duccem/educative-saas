import { database } from "@/lib/database";
import { protectedProcedure } from "../..";
import z from "zod";
import { and, eq } from "drizzle-orm";
import { section } from "@/lib/database/schema";
import { ORPCError } from "@orpc/server";
import { auth } from "@/lib/auth/auth-server";
import { headers } from "next/headers";

export const deleteSection = protectedProcedure
  .route({ method: "DELETE", path: "/:id", inputStructure: "detailed" })
  .input(
    z.object({
      params: z.object({
        id: z.uuid(),
      }),
    }),
  )
  .handler(async ({ input: { params }, context }) => {
    const { id } = params;

    const canDeleteSection = await auth.api.hasPermission({
      headers: await headers(),
      body: {
        permissions: {
          section: ["delete"],
        },
      },
    });

    if (!canDeleteSection.success) {
      throw new ORPCError("UNAUTHORIZED", {
        cause: "You do not have permission to delete a section",
      });
    }

    const existingSection = await database.query.section.findFirst({
      where: and(
        eq(section.id, id),
        eq(section.organization_id, context.organization.id),
      ),
    });

    if (!existingSection) {
      throw new ORPCError("NOT_FOUND", {
        cause: "Section not found",
      });
    }

    await database.delete(section).where(eq(section.id, id));

    return {
      success: true,
    };
  });

