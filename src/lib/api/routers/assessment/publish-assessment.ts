import z from "zod";
import { protectedProcedure } from "../..";
import { and, eq } from "drizzle-orm";
import { database } from "@/lib/database";
import { assessment } from "@/lib/database/schema";
import { ORPCError } from "@orpc/server";
import { auth } from "@/lib/auth/auth-server";
import { headers } from "next/headers";

export const publishAssessment = protectedProcedure
  .route({ method: "PATCH", path: "/:id/publish", inputStructure: "detailed" })
  .input(
    z.object({
      params: z.object({
        id: z.uuid(),
      }),
    }),
  )
  .handler(async ({ input: { params }, context }) => {
    const canPublishAssessment = await auth.api.hasPermission({
      headers: await headers(),
      body: {
        permissions: {
          assessment: ["update"],
        },
      },
    });

    if (!canPublishAssessment.success) {
      throw new ORPCError("UNAUTHORIZED", {
        cause: "You do not have permission to publish an assessment",
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

    await database
      .update(assessment)
      .set({
        is_published: true,
      })
      .where(eq(assessment.id, params.id));

    return {
      success: true,
    };
  });

