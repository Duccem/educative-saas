import z from "zod";
import { protectedProcedure } from "../..";
import { and, eq } from "drizzle-orm";
import { database } from "@/lib/database";
import { student_assessment_grade } from "@/lib/database/schema";
import { ORPCError } from "@orpc/server";

export const getStudentAssessmentGrade = protectedProcedure
  .route({ method: "GET", path: "/:id", inputStructure: "detailed" })
  .input(
    z.object({
      params: z.object({
        id: z.uuid(),
      }),
    }),
  )
  .handler(async ({ input: { params }, context }) => {
    const existingGrade =
      await database.query.student_assessment_grade.findFirst({
        where: and(
          eq(student_assessment_grade.id, params.id),
          eq(student_assessment_grade.organization_id, context.organization.id),
        ),
        with: {
          assessment: true,
          enrollment: true,
          grader: true,
        },
      });

    if (!existingGrade) {
      throw new ORPCError("NOT_FOUND", {
        cause: "Student assessment grade not found",
      });
    }

    return {
      studentAssessmentGrade: existingGrade,
    };
  });

