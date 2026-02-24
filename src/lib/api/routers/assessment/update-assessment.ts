import z from "zod";
import { protectedProcedure } from "../..";
import { database } from "@/lib/database";
import { ORPCError } from "@orpc/server";
import { academic_term, assessment, course } from "@/lib/database/schema";
import { and, eq } from "drizzle-orm";
import { auth } from "@/lib/auth/auth-server";
import { headers } from "next/headers";

const updateAssessmentInputSchema = z.object({
  body: z.object({
    course_id: z.uuid().optional(),
    academic_term_id: z.uuid().optional(),
    title: z.string().min(1).optional(),
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
  }),
  params: z.object({
    id: z.uuid(),
  }),
});

export const updateAssessment = protectedProcedure
  .route({ method: "PUT", path: "/:id", inputStructure: "detailed" })
  .input(updateAssessmentInputSchema)
  .handler(async ({ input: { body, params }, context }) => {
    const existingAssessment = await database.query.assessment.findFirst({
      where: and(
        eq(assessment.id, params.id),
        eq(assessment.organization_id, context.organization.id),
      ),
    });

    if (!existingAssessment) {
      throw new ORPCError("NOT_FOUND", {
        cause: "Assessment not found",
      });
    }

    const canUpdateAssessment = await auth.api.hasPermission({
      headers: await headers(),
      body: {
        permissions: {
          assessment: ["update"],
        },
      },
    });

    if (!canUpdateAssessment.success) {
      throw new ORPCError("UNAUTHORIZED", {
        cause: "You do not have permission to update an assessment",
      });
    }

    if (body.course_id) {
      const existingCourse = await database.query.course.findFirst({
        where: and(
          eq(course.id, body.course_id),
          eq(course.organization_id, context.organization.id),
        ),
      });

      if (!existingCourse) {
        throw new ORPCError("NOT_FOUND", {
          cause: "Course not found",
        });
      }
    }

    if (body.academic_term_id) {
      const existingTerm = await database.query.academic_term.findFirst({
        where: and(
          eq(academic_term.id, body.academic_term_id),
          eq(academic_term.organization_id, context.organization.id),
        ),
      });

      if (!existingTerm) {
        throw new ORPCError("NOT_FOUND", {
          cause: "Academic term not found",
        });
      }
    }

    await database
      .update(assessment)
      .set({
        course_id: body.course_id ?? existingAssessment.course_id,
        academic_term_id:
          body.academic_term_id ?? existingAssessment.academic_term_id,
        title: body.title ?? existingAssessment.title,
        description: body.description ?? existingAssessment.description,
        type: body.type ?? existingAssessment.type,
        weight: body.weight ?? existingAssessment.weight,
        max_score: body.max_score ?? existingAssessment.max_score,
        due_time:
          body.due_time === undefined
            ? existingAssessment.due_time
            : body.due_time,
        is_published: body.is_published ?? existingAssessment.is_published,
      })
      .where(eq(assessment.id, params.id));

    return {
      success: true,
    };
  });

