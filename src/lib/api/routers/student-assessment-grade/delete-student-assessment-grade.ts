import { database } from "@/lib/database";
import { protectedProcedure } from "../..";
import z from "zod";
import { and, eq } from "drizzle-orm";
import { student_assessment_grade } from "@/lib/database/schema";
import { ORPCError } from "@orpc/server";
import { auth } from "@/lib/auth/auth-server";
import { headers } from "next/headers";

export const deleteStudentAssessmentGrade = protectedProcedure
  .route({ method: "DELETE", path: "/:id", inputStructure: "detailed" })
  .input(
    z.object({
      params: z.object({
        id: z.uuid(),
      }),
    }),
  )
  .handler(async ({ input: { params }, context }) => {
    const canDeleteGrade = await auth.api.hasPermission({
      headers: await headers(),
      body: {
        permissions: {
          student_assessment_grade: ["delete"],
        },
      },
    });

    if (!canDeleteGrade.success) {
      throw new ORPCError("UNAUTHORIZED", {
        cause: "You do not have permission to delete assessment grades",
      });
    }

    const existingGrade =
      await database.query.student_assessment_grade.findFirst({
        where: and(
          eq(student_assessment_grade.id, params.id),
          eq(student_assessment_grade.organization_id, context.organization.id),
        ),
      });

    if (!existingGrade) {
      throw new ORPCError("NOT_FOUND", {
        cause: "Student assessment grade not found",
      });
    }

    await database
      .delete(student_assessment_grade)
      .where(eq(student_assessment_grade.id, params.id));

    return {
      success: true,
    };
  });

