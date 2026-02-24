import z from "zod";
import { protectedProcedure } from "../..";
import { database } from "@/lib/database";
import { ORPCError } from "@orpc/server";
import { course, course_final_grade, enrollment } from "@/lib/database/schema";
import { and, eq } from "drizzle-orm";
import { auth } from "@/lib/auth/auth-server";
import { headers } from "next/headers";

const updateCourseFinalGradeInputSchema = z.object({
  body: z.object({
    course_id: z.uuid().optional(),
    enrollment_id: z.uuid().optional(),
    student_id: z.uuid().optional(),
    final_score: z.string().optional(),
    final_letter: z.string().nullable().optional(),
    is_passing: z.boolean().optional(),
    status: z.enum(["in_progress", "finalized", "published"]).optional(),
    notes: z.string().optional(),
    published_at: z.coerce.date().nullable().optional(),
    locked_at: z.coerce.date().nullable().optional(),
  }),
  params: z.object({
    id: z.uuid(),
  }),
});

export const updateCourseFinalGrade = protectedProcedure
  .route({ method: "PUT", path: "/:id", inputStructure: "detailed" })
  .input(updateCourseFinalGradeInputSchema)
  .handler(async ({ input: { body, params }, context }) => {
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

    const canUpdateFinalGrade = await auth.api.hasPermission({
      headers: await headers(),
      body: {
        permissions: {
          course_final_grade: ["update"],
        },
      },
    });

    if (!canUpdateFinalGrade.success) {
      throw new ORPCError("UNAUTHORIZED", {
        cause: "You do not have permission to update final grades",
      });
    }

    const nextCourseId = body.course_id ?? existingFinalGrade.course_id;
    const nextEnrollmentId =
      body.enrollment_id ?? existingFinalGrade.enrollment_id;
    const nextStudentId = body.student_id ?? existingFinalGrade.student_id;

    const [existingCourse, existingEnrollment] = await Promise.all([
      database.query.course.findFirst({
        where: and(
          eq(course.id, nextCourseId),
          eq(course.organization_id, context.organization.id),
        ),
      }),
      database.query.enrollment.findFirst({
        where: and(
          eq(enrollment.id, nextEnrollmentId),
          eq(enrollment.organization_id, context.organization.id),
        ),
      }),
    ]);

    if (!existingCourse) {
      throw new ORPCError("NOT_FOUND", {
        cause: "Course not found",
      });
    }

    if (!existingEnrollment) {
      throw new ORPCError("NOT_FOUND", {
        cause: "Enrollment not found",
      });
    }

    if (existingEnrollment.course_id !== nextCourseId) {
      throw new ORPCError("BAD_REQUEST", {
        cause: "Enrollment does not belong to the course",
      });
    }

    if (existingEnrollment.student_id !== nextStudentId) {
      throw new ORPCError("BAD_REQUEST", {
        cause: "Enrollment does not belong to the student",
      });
    }

    await database
      .update(course_final_grade)
      .set({
        course_id: nextCourseId,
        enrollment_id: nextEnrollmentId,
        student_id: nextStudentId,
        final_score: body.final_score ?? existingFinalGrade.final_score,
        final_letter:
          body.final_letter === undefined
            ? existingFinalGrade.final_letter
            : body.final_letter,
        is_passing: body.is_passing ?? existingFinalGrade.is_passing,
        status: body.status ?? existingFinalGrade.status,
        notes: body.notes ?? existingFinalGrade.notes,
        calculated_at: new Date(),
        published_at:
          body.published_at === undefined
            ? existingFinalGrade.published_at
            : body.published_at,
        locked_at:
          body.locked_at === undefined
            ? existingFinalGrade.locked_at
            : body.locked_at,
      })
      .where(eq(course_final_grade.id, params.id));

    return {
      success: true,
    };
  });

