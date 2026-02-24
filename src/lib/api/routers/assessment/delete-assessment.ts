import { database } from "@/lib/database";
import { protectedProcedure } from "../..";
import z from "zod";
import { and, eq } from "drizzle-orm";
import { assessment } from "@/lib/database/schema";
import { ORPCError } from "@orpc/server";
import { auth } from "@/lib/auth/auth-server";
import { headers } from "next/headers";

export const deleteAssessment = protectedProcedure
  .route({ method: "DELETE", path: "/:id", inputStructure: "detailed" })
  .input(
    z.object({
      params: z.object({
        id: z.uuid(),
      }),
    }),
  )
  .handler(async ({ input: { params }, context }) => {
    const canDeleteAssessment = await auth.api.hasPermission({
      headers: await headers(),
      body: {
        permissions: {
          assessment: ["delete"],
        },
      },
    });

    if (!canDeleteAssessment.success) {
      throw new ORPCError("UNAUTHORIZED", {
        cause: "You do not have permission to delete an assessment",
      });
    }

    const existingAssessment = await database.query.assessment.findFirst({
      where: and(
        eq(assessment.id, params.id),
        eq(assessment.organization_id, context.organization.id),
      ),
    });

    if (!existingAssessment) {
      throw new ORPCError("NOT_FOUND", {
        cause: "Assessment not found",
      });
    }

    await database.delete(assessment).where(eq(assessment.id, params.id));

    return {
      success: true,
    };
  });

