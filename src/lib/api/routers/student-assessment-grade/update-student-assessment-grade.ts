import z from "zod";
import { protectedProcedure } from "../..";
import { database } from "@/lib/database";
import { ORPCError } from "@orpc/server";
import {
  assessment,
  enrollment,
  student_assessment_grade,
} from "@/lib/database/schema";
import { and, eq } from "drizzle-orm";
import { auth } from "@/lib/auth/auth-server";
import { headers } from "next/headers";

const updateStudentAssessmentGradeInputSchema = z.object({
  body: z.object({
    assessment_id: z.uuid().optional(),
    enrollment_id: z.uuid().optional(),
    grader_id: z.uuid().nullable().optional(),
    raw_score: z.string().optional(),
    extra_credit: z.string().optional(),
    penalty_score: z.string().optional(),
    final_score: z.string().optional(),
    feedback: z.string().optional(),
    status: z.enum(["draft", "published", "excused", "missing"]).optional(),
    published_at: z.coerce.date().nullable().optional(),
  }),
  params: z.object({
    id: z.uuid(),
  }),
});

const toDecimalString = (value: number) => value.toFixed(2);

const calculateFinalScore = (
  rawScore?: string,
  extraCredit?: string,
  penaltyScore?: string,
) => {
  const raw = Number(rawScore ?? "0");
  const bonus = Number(extraCredit ?? "0");
  const penalty = Number(penaltyScore ?? "0");

  return toDecimalString(Math.max(raw + bonus - penalty, 0));
};

export const updateStudentAssessmentGrade = protectedProcedure
  .route({ method: "PUT", path: "/:id", inputStructure: "detailed" })
  .input(updateStudentAssessmentGradeInputSchema)
  .handler(async ({ input: { body, params }, context }) => {
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

    const canUpdateGrade = await auth.api.hasPermission({
      headers: await headers(),
      body: {
        permissions: {
          student_assessment_grade: ["update"],
        },
      },
    });

    if (!canUpdateGrade.success) {
      throw new ORPCError("UNAUTHORIZED", {
        cause: "You do not have permission to update assessment grades",
      });
    }

    const nextAssessmentId = body.assessment_id ?? existingGrade.assessment_id;
    const nextEnrollmentId = body.enrollment_id ?? existingGrade.enrollment_id;

    if (body.assessment_id) {
      const existingAssessment = await database.query.assessment.findFirst({
        where: and(
          eq(assessment.id, body.assessment_id),
          eq(assessment.organization_id, context.organization.id),
        ),
      });

      if (!existingAssessment) {
        throw new ORPCError("NOT_FOUND", {
          cause: "Assessment not found",
        });
      }
    }

    if (body.enrollment_id) {
      const existingEnrollment = await database.query.enrollment.findFirst({
        where: and(
          eq(enrollment.id, body.enrollment_id),
          eq(enrollment.organization_id, context.organization.id),
        ),
      });

      if (!existingEnrollment) {
        throw new ORPCError("NOT_FOUND", {
          cause: "Enrollment not found",
        });
      }
    }

    const [nextAssessment, nextEnrollment] = await Promise.all([
      database.query.assessment.findFirst({
        where: and(
          eq(assessment.id, nextAssessmentId),
          eq(assessment.organization_id, context.organization.id),
        ),
      }),
      database.query.enrollment.findFirst({
        where: and(
          eq(enrollment.id, nextEnrollmentId),
          eq(enrollment.organization_id, context.organization.id),
        ),
      }),
    ]);

    if (!nextAssessment || !nextEnrollment) {
      throw new ORPCError("NOT_FOUND", {
        cause: "Assessment or enrollment not found",
      });
    }

    if (nextAssessment.course_id !== nextEnrollment.course_id) {
      throw new ORPCError("BAD_REQUEST", {
        cause: "Assessment and enrollment must belong to the same course",
      });
    }

    const computedFinalScore =
      body.final_score ??
      calculateFinalScore(
        body.raw_score ?? existingGrade.raw_score,
        body.extra_credit ?? existingGrade.extra_credit,
        body.penalty_score ?? existingGrade.penalty_score,
      );

    await database
      .update(student_assessment_grade)
      .set({
        assessment_id: nextAssessmentId,
        enrollment_id: nextEnrollmentId,
        grader_id:
          body.grader_id === undefined
            ? existingGrade.grader_id
            : body.grader_id,
        raw_score: body.raw_score ?? existingGrade.raw_score,
        extra_credit: body.extra_credit ?? existingGrade.extra_credit,
        penalty_score: body.penalty_score ?? existingGrade.penalty_score,
        final_score: computedFinalScore,
        feedback: body.feedback ?? existingGrade.feedback,
        status: body.status ?? existingGrade.status,
        graded_at: new Date(),
        published_at:
          body.published_at === undefined
            ? existingGrade.published_at
            : body.published_at,
      })
      .where(eq(student_assessment_grade.id, params.id));

    return {
      success: true,
    };
  });

