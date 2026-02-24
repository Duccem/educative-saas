import z from "zod";
import { protectedProcedure } from "../..";
import { and, eq } from "drizzle-orm";
import { database } from "@/lib/database";
import { course_final_grade, enrollment } from "@/lib/database/schema";
import { ORPCError } from "@orpc/server";
import { auth } from "@/lib/auth/auth-server";
import { headers } from "next/headers";

export const finalizeCourseFinalGrade = protectedProcedure
  .route({ method: "PATCH", path: "/:id/finalize", inputStructure: "detailed" })
  .input(
    z.object({
      params: z.object({
        id: z.uuid(),
      }),
    }),
  )
  .handler(async ({ input: { params }, context }) => {
    const canFinalizeFinalGrade = await auth.api.hasPermission({
      headers: await headers(),
      body: {
        permissions: {
          course_final_grade: ["update"],
        },
      },
    });

    if (!canFinalizeFinalGrade.success) {
      throw new ORPCError("UNAUTHORIZED", {
        cause: "You do not have permission to finalize final grades",
      });
    }

    const existingFinalGrade =
      await database.query.course_final_grade.findFirst({
        where: and(
          eq(course_final_grade.id, params.id),
          eq(course_final_grade.organization_id, context.organization.id),
        ),
      });

    if (!existingFinalGrade) {
      throw new ORPCError("NOT_FOUND", {
        cause: "Course final grade not found",
      });
    }

    const now = new Date();

    await database
      .update(course_final_grade)
      .set({
        status: "finalized",
        locked_at: now,
      })
      .where(eq(course_final_grade.id, params.id));

    await database
      .update(enrollment)
      .set({
        final_score: existingFinalGrade.final_score,
        final_letter: existingFinalGrade.final_letter,
        is_passing: existingFinalGrade.is_passing,
        finalized_at: now,
      })
      .where(eq(enrollment.id, existingFinalGrade.enrollment_id));

    return {
      success: true,
    };
  });

