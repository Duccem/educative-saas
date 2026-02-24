import { auth } from "@/lib/auth/auth-server";
import { protectedProcedure } from "../..";
import { database } from "@/lib/database";
import z from "zod";
import { headers } from "next/headers";
import {
  assessment,
  enrollment,
  student_assessment_grade,
} from "@/lib/database/schema";
import { ORPCError } from "@orpc/server";
import { and, eq } from "drizzle-orm";

const gradeInputSchema = z.object({
  assessment_id: z.uuid(),
  enrollment_id: z.uuid(),
  grader_id: z.uuid().optional(),
  raw_score: z.string().optional(),
  extra_credit: z.string().optional(),
  penalty_score: z.string().optional(),
  final_score: z.string().optional(),
  feedback: z.string().optional(),
  status: z.enum(["draft", "published", "excused", "missing"]).optional(),
  published_at: z.coerce.date().nullable().optional(),
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

export const addStudentAssessmentGrade = protectedProcedure
  .route({ method: "POST", path: "/", inputStructure: "detailed" })
  .input(
    z.object({
      body: gradeInputSchema,
    }),
  )
  .handler(async ({ input: { body }, context }) => {
    const canAddGrade = await auth.api.hasPermission({
      headers: await headers(),
      body: {
        permissions: {
          student_assessment_grade: ["create"],
        },
      },
    });

    if (!canAddGrade.success) {
      throw new ORPCError("UNAUTHORIZED", {
        cause: "You do not have permission to create assessment grades",
      });
    }

    const [existingAssessment, existingEnrollment] = await Promise.all([
      database.query.assessment.findFirst({
        where: and(
          eq(assessment.id, body.assessment_id),
          eq(assessment.organization_id, context.organization.id),
        ),
      }),
      database.query.enrollment.findFirst({
        where: and(
          eq(enrollment.id, body.enrollment_id),
          eq(enrollment.organization_id, context.organization.id),
        ),
      }),
    ]);

    if (!existingAssessment) {
      throw new ORPCError("NOT_FOUND", {
        cause: "Assessment not found",
      });
    }

    if (!existingEnrollment) {
      throw new ORPCError("NOT_FOUND", {
        cause: "Enrollment not found",
      });
    }

    if (existingAssessment.course_id !== existingEnrollment.course_id) {
      throw new ORPCError("BAD_REQUEST", {
        cause: "Assessment and enrollment must belong to the same course",
      });
    }

    const existingGrade =
      await database.query.student_assessment_grade.findFirst({
        where: and(
          eq(student_assessment_grade.assessment_id, body.assessment_id),
          eq(student_assessment_grade.enrollment_id, body.enrollment_id),
        ),
      });

    if (existingGrade) {
      throw new ORPCError("CONFLICT", {
        cause: "Grade already exists for this assessment and enrollment",
      });
    }

    const computedFinalScore =
      body.final_score ??
      calculateFinalScore(
        body.raw_score,
        body.extra_credit,
        body.penalty_score,
      );

    const createdGrade = await database
      .insert(student_assessment_grade)
      .values({
        organization_id: context.organization.id,
        assessment_id: body.assessment_id,
        enrollment_id: body.enrollment_id,
        grader_id: body.grader_id ?? context.session.user.id,
        raw_score: body.raw_score ?? "0.00",
        extra_credit: body.extra_credit ?? "0.00",
        penalty_score: body.penalty_score ?? "0.00",
        final_score: computedFinalScore,
        feedback: body.feedback,
        status: body.status ?? "draft",
        graded_at: new Date(),
        published_at:
          body.published_at === undefined ? null : body.published_at,
      })
      .returning({ id: student_assessment_grade.id });

    return {
      success: true,
      studentAssessmentGradeId: createdGrade[0]?.id,
    };
  });

