import z from "zod";
import { protectedProcedure } from "../..";
import { database } from "@/lib/database";
import { ORPCError } from "@orpc/server";
import { course, quiz } from "@/lib/database/schema";
import { and, eq } from "drizzle-orm";
import { auth } from "@/lib/auth/auth-server";
import { headers } from "next/headers";

const updateQuizInputSchema = z.object({
  body: z.object({
    course_id: z.uuid().optional(),
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    weight: z.string().optional(),
    due_time: z.coerce.date().nullable().optional(),
  }),
  params: z.object({
    id: z.uuid(),
  }),
});

export const updateQuiz = protectedProcedure
  .route({ method: "PUT", path: "/:id", inputStructure: "detailed" })
  .input(updateQuizInputSchema)
  .handler(async ({ input: { body, params }, context }) => {
    const { id } = params;

    const existingQuiz = await database.query.quiz.findFirst({
      where: and(
        eq(quiz.id, id),
        eq(quiz.organization_id, context.organization.id),
      ),
    });

    if (!existingQuiz) {
      throw new ORPCError("NOT_FOUND", {
        cause: "Quiz not found",
      });
    }

    const canUpdateQuiz = await auth.api.hasPermission({
      headers: await headers(),
      body: {
        permissions: {
          quiz: ["update"],
        },
      },
    });

    if (!canUpdateQuiz.success) {
      throw new ORPCError("UNAUTHORIZED", {
        cause: "You do not have permission to update a quiz",
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

    await database
      .update(quiz)
      .set({
        course_id: body.course_id ?? existingQuiz.course_id,
        title: body.title ?? existingQuiz.title,
        description: body.description ?? existingQuiz.description,
        weight: body.weight ?? existingQuiz.weight,
        due_time:
          body.due_time === undefined ? existingQuiz.due_time : body.due_time,
      })
      .where(eq(quiz.id, id));

    return {
      success: true,
    };
  });

