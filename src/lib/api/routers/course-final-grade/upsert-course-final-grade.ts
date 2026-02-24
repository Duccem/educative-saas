import { auth } from "@/lib/auth/auth-server";
import { protectedProcedure } from "../..";
import { database } from "@/lib/database";
import z from "zod";
import { headers } from "next/headers";
import { course, course_final_grade, enrollment } from "@/lib/database/schema";
import { ORPCError } from "@orpc/server";
import { and, eq } from "drizzle-orm";

const upsertFinalGradeInputSchema = z.object({
  course_id: z.uuid(),
  enrollment_id: z.uuid(),
  student_id: z.uuid(),
  final_score: z.string().optional(),
  final_letter: z.string().optional(),
  is_passing: z.boolean().optional(),
  status: z.enum(["in_progress", "finalized", "published"]).optional(),
  notes: z.string().optional(),
  published_at: z.coerce.date().nullable().optional(),
  locked_at: z.coerce.date().nullable().optional(),
});

export const upsertCourseFinalGrade = protectedProcedure
  .route({ method: "POST", path: "/upsert", inputStructure: "detailed" })
  .input(
    z.object({
      body: upsertFinalGradeInputSchema,
    }),
  )
  .handler(async ({ input: { body }, context }) => {
    const canUpsertFinalGrade = await auth.api.hasPermission({
      headers: await headers(),
      body: {
        permissions: {
          course_final_grade: ["create", "update"],
        },
      },
    });

    if (!canUpsertFinalGrade.success) {
      throw new ORPCError("UNAUTHORIZED", {
        cause: "You do not have permission to upsert final grades",
      });
    }

    const [existingCourse, existingEnrollment] = await Promise.all([
      database.query.course.findFirst({
        where: and(
          eq(course.id, body.course_id),
          eq(course.organization_id, context.organization.id),
        ),
      }),
      database.query.enrollment.findFirst({
        where: and(
          eq(enrollment.id, body.enrollment_id),
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

    if (existingEnrollment.course_id !== body.course_id) {
      throw new ORPCError("BAD_REQUEST", {
        cause: "Enrollment does not belong to the course",
      });
    }

    if (existingEnrollment.student_id !== body.student_id) {
      throw new ORPCError("BAD_REQUEST", {
        cause: "Enrollment does not belong to the student",
      });
    }

    const existingFinalGrade =
      await database.query.course_final_grade.findFirst({
        where: and(
          eq(course_final_grade.enrollment_id, body.enrollment_id),
          eq(course_final_grade.organization_id, context.organization.id),
        ),
      });

    if (!existingFinalGrade) {
      const createdFinalGrade = await database
        .insert(course_final_grade)
        .values({
          organization_id: context.organization.id,
          course_id: body.course_id,
          enrollment_id: body.enrollment_id,
          student_id: body.student_id,
          final_score: body.final_score ?? "0.00",
          final_letter: body.final_letter,
          is_passing: body.is_passing ?? false,
          status: body.status ?? "in_progress",
          notes: body.notes,
          calculated_at: new Date(),
          published_at:
            body.published_at === undefined ? null : body.published_at,
          locked_at: body.locked_at === undefined ? null : body.locked_at,
        })
        .returning({ id: course_final_grade.id });

      return {
        success: true,
        operation: "created" as const,
        courseFinalGradeId: createdFinalGrade[0]?.id,
      };
    }

    await database
      .update(course_final_grade)
      .set({
        course_id: body.course_id,
        student_id: body.student_id,
        final_score: body.final_score ?? existingFinalGrade.final_score,
        final_letter: body.final_letter ?? existingFinalGrade.final_letter,
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
      .where(eq(course_final_grade.id, existingFinalGrade.id));

    return {
      success: true,
      operation: "updated" as const,
      courseFinalGradeId: existingFinalGrade.id,
    };
  });

