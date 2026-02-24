import { auth } from "@/lib/auth/auth-server";
import { protectedProcedure } from "../..";
import { database } from "@/lib/database";
import z from "zod";
import { headers } from "next/headers";
import { academic_term, assessment, course } from "@/lib/database/schema";
import { ORPCError } from "@orpc/server";
import { and, eq } from "drizzle-orm";

const assessmentInputSchema = z.object({
  course_id: z.uuid(),
  academic_term_id: z.uuid(),
  title: z.string().min(1),
  description: z.string().optional(),
  type: z
    .enum([
      "exam",
      "quiz",
      "assignment",
      "project",
      "participation",
      "recovery",
      "other",
    ])
    .optional(),
  weight: z.string().optional(),
  max_score: z.string().optional(),
  due_time: z.coerce.date().nullable().optional(),
  is_published: z.boolean().optional(),
});

export const addAssessment = protectedProcedure
  .route({ method: "POST", path: "/", inputStructure: "detailed" })
  .input(
    z.object({
      body: assessmentInputSchema,
    }),
  )
  .handler(async ({ input: { body }, context }) => {
    const canAddAssessment = await auth.api.hasPermission({
      headers: await headers(),
      body: {
        permissions: {
          assessment: ["create"],
        },
      },
    });

    if (!canAddAssessment.success) {
      throw new ORPCError("UNAUTHORIZED", {
        cause: "You do not have permission to create assessments",
      });
    }

    const [existingCourse, existingTerm] = await Promise.all([
      database.query.course.findFirst({
        where: and(
          eq(course.id, body.course_id),
          eq(course.organization_id, context.organization.id),
        ),
      }),
      database.query.academic_term.findFirst({
        where: and(
          eq(academic_term.id, body.academic_term_id),
          eq(academic_term.organization_id, context.organization.id),
        ),
      }),
    ]);

    if (!existingCourse) {
      throw new ORPCError("NOT_FOUND", {
        cause: "Course not found",
      });
    }

    if (!existingTerm) {
      throw new ORPCError("NOT_FOUND", {
        cause: "Academic term not found",
      });
    }

    const createdAssessment = await database
      .insert(assessment)
      .values({
        organization_id: context.organization.id,
        course_id: body.course_id,
        academic_term_id: body.academic_term_id,
        created_by: context.session.user.id,
        title: body.title,
        description: body.description,
        type: body.type ?? "other",
        weight: body.weight ?? "1.00",
        max_score: body.max_score ?? "100.00",
        due_time: body.due_time === undefined ? null : body.due_time,
        is_published: body.is_published ?? false,
      })
      .returning({ id: assessment.id });

    return {
      success: true,
      assessmentId: createdAssessment[0]?.id,
    };
  });

