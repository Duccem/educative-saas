import z from "zod";
import { protectedProcedure } from "../..";
import { and, eq } from "drizzle-orm";
import { database } from "@/lib/database";
import { course_final_grade } from "@/lib/database/schema";
import { ORPCError } from "@orpc/server";

export const getCourseFinalGrade = protectedProcedure
  .route({ method: "GET", path: "/:id", inputStructure: "detailed" })
  .input(
    z.object({
      params: z.object({
        id: z.uuid(),
      }),
    }),
  )
  .handler(async ({ input: { params }, context }) => {
    const existingFinalGrade =
      await database.query.course_final_grade.findFirst({
        where: and(
          eq(course_final_grade.id, params.id),
          eq(course_final_grade.organization_id, context.organization.id),
        ),
        with: {
          course: true,
          enrollment: true,
          student: true,
        },
      });

    if (!existingFinalGrade) {
      throw new ORPCError("NOT_FOUND", {
        cause: "Course final grade not found",
      });
    }

    return {
      courseFinalGrade: existingFinalGrade,
    };
  });

