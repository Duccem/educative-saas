import z from "zod";
import { protectedProcedure } from "../..";
import { and, eq } from "drizzle-orm";
import { database } from "@/lib/database";
import { assessment, student_assessment_grade } from "@/lib/database/schema";
import { ORPCError } from "@orpc/server";
import { auth } from "@/lib/auth/auth-server";
import { headers } from "next/headers";

export const publishAssessmentGrades = protectedProcedure
  .route({
    method: "PATCH",
    path: "/assessment/:assessmentId/publish",
    inputStructure: "detailed",
  })
  .input(
    z.object({
      params: z.object({
        assessmentId: z.uuid(),
      }),
    }),
  )
  .handler(async ({ input: { params }, context }) => {
    const canPublishGrades = await auth.api.hasPermission({
      headers: await headers(),
      body: {
        permissions: {
          student_assessment_grade: ["update"],
        },
      },
    });

    if (!canPublishGrades.success) {
      throw new ORPCError("UNAUTHORIZED", {
        cause: "You do not have permission to publish assessment grades",
      });
    }

    const existingAssessment = await database.query.assessment.findFirst({
      where: and(
        eq(assessment.id, params.assessmentId),
        eq(assessment.organization_id, context.organization.id),
      ),
    });

    if (!existingAssessment) {
      throw new ORPCError("NOT_FOUND", {
        cause: "Assessment not found",
      });
    }

    const publishedAt = new Date();

    const updatedRows = await database
      .update(student_assessment_grade)
      .set({
        status: "published",
        published_at: publishedAt,
      })
      .where(
        and(
          eq(student_assessment_grade.organization_id, context.organization.id),
          eq(student_assessment_grade.assessment_id, params.assessmentId),
        ),
      )
      .returning({ id: student_assessment_grade.id });

    return {
      success: true,
      publishedCount: updatedRows.length,
    };
  });

