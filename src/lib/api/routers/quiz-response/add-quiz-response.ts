import { auth } from "@/lib/auth/auth-server";
import { protectedProcedure } from "../..";
import { database } from "@/lib/database";
import z from "zod";
import { headers } from "next/headers";
import { question, quiz_attempt, quiz_response } from "@/lib/database/schema";
import { ORPCError } from "@orpc/server";
import { and, eq } from "drizzle-orm";

const quizResponseInputSchema = z.object({
  quiz_attempt_id: z.uuid(),
  question_id: z.uuid(),
  selected_option: z.coerce.number().int().nonnegative(),
});

export const addQuizResponse = protectedProcedure
  .route({ method: "POST", path: "/", inputStructure: "detailed" })
  .input(
    z.object({
      body: quizResponseInputSchema,
    }),
  )
  .handler(async ({ input: { body }, context }) => {
    const canAddQuizResponse = await auth.api.hasPermission({
      headers: await headers(),
      body: {
        permissions: {
          quiz_response: ["create"],
        },
      },
    });

    if (!canAddQuizResponse.success) {
      throw new ORPCError("UNAUTHORIZED", {
        cause: "You do not have permission to create a quiz response",
      });
    }

    const existingAttempt = await database.query.quiz_attempt.findFirst({
      where: eq(quiz_attempt.id, body.quiz_attempt_id),
      with: {
        quiz: true,
      },
    });

    if (!existingAttempt) {
      throw new ORPCError("NOT_FOUND", {
        cause: "Quiz attempt not found",
      });
    }

    if (existingAttempt.quiz.organization_id !== context.organization.id) {
      throw new ORPCError("NOT_FOUND", {
        cause: "Quiz attempt not found",
      });
    }

    const existingQuestion = await database.query.question.findFirst({
      where: eq(question.id, body.question_id),
      with: {
        quiz: true,
      },
    });

    if (!existingQuestion) {
      throw new ORPCError("NOT_FOUND", {
        cause: "Question not found",
      });
    }

    if (existingQuestion.quiz.id !== existingAttempt.quiz_id) {
      throw new ORPCError("CONFLICT", {
        cause: "Question does not belong to this quiz attempt",
      });
    }

    const questionOptions = existingQuestion.options ?? [];

    if (
      questionOptions.length > 0 &&
      body.selected_option >= questionOptions.length
    ) {
      throw new ORPCError("BAD_REQUEST", {
        cause: "selected_option must be a valid options index",
      });
    }

    const existingResponse = await database.query.quiz_response.findFirst({
      where: and(
        eq(quiz_response.quiz_attempt_id, body.quiz_attempt_id),
        eq(quiz_response.question_id, body.question_id),
      ),
    });

    if (existingResponse) {
      throw new ORPCError("CONFLICT", {
        cause: "This question already has a response for the attempt",
      });
    }

    await database.insert(quiz_response).values({
      quiz_attempt_id: body.quiz_attempt_id,
      question_id: body.question_id,
      selected_option: body.selected_option,
      organization_id: context.organization.id,
    });

    return {
      success: true,
    };
  });

