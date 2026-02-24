import { auth } from "@/lib/auth/auth-server";
import { protectedProcedure } from "../..";
import { database } from "@/lib/database";
import z from "zod";
import { headers } from "next/headers";
import { course, question, quiz } from "@/lib/database/schema";
import { ORPCError } from "@orpc/server";
import { and, eq } from "drizzle-orm";

const questionInputSchema = z
  .object({
    text: z.string().min(1),
    options: z.array(z.string()).default([]),
    correct_option: z.coerce.number().int().nonnegative(),
    value: z.string().optional(),
  })
  .superRefine((value, ctx) => {
    if (
      value.options.length > 0 &&
      value.correct_option >= value.options.length
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "correct_option must be a valid options index",
        path: ["correct_option"],
      });
    }
  });

const quizInputSchema = z.object({
  course_id: z.uuid(),
  title: z.string().min(1),
  description: z.string().optional(),
  weight: z.string().optional(),
  due_time: z.coerce.date().optional(),
  questions: z.array(questionInputSchema).default([]),
});

export const addQuiz = protectedProcedure
  .route({ method: "POST", path: "/", inputStructure: "detailed" })
  .input(
    z.object({
      body: quizInputSchema,
    }),
  )
  .handler(async ({ input: { body }, context }) => {
    const canAddQuiz = await auth.api.hasPermission({
      headers: await headers(),
      body: {
        permissions: {
          quiz: ["create"],
          question: ["create"],
        },
      },
    });

    if (!canAddQuiz.success) {
      throw new ORPCError("UNAUTHORIZED", {
        cause: "You do not have permission to create quizzes",
      });
    }

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

    const createdQuiz = await database
      .insert(quiz)
      .values({
        course_id: body.course_id,
        organization_id: context.organization.id,
        title: body.title,
        description: body.description,
        weight: body.weight ?? "1.00",
        due_time: body.due_time,
      })
      .returning({ id: quiz.id });

    const quizId = createdQuiz[0]?.id;

    if (!quizId) {
      throw new ORPCError("INTERNAL_SERVER_ERROR", {
        cause: "Failed to create quiz",
      });
    }

    if (body.questions.length > 0) {
      await database.insert(question).values(
        body.questions.map((item) => ({
          quiz_id: quizId,
          text: item.text,
          options: item.options,
          correct_option: item.correct_option,
          value: item.value ?? "1.00",
        })),
      );
    }

    return {
      success: true,
      quizId,
    };
  });

