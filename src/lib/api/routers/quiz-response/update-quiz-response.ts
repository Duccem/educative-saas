import z from "zod";
import { protectedProcedure } from "../..";
import { database } from "@/lib/database";
import { ORPCError } from "@orpc/server";
import { question, quiz_attempt, quiz_response } from "@/lib/database/schema";
import { and, eq } from "drizzle-orm";
import { auth } from "@/lib/auth/auth-server";
import { headers } from "next/headers";

const updateQuizResponseInputSchema = z.object({
  body: z.object({
    quiz_attempt_id: z.uuid().optional(),
    question_id: z.uuid().optional(),
    selected_option: z.coerce.number().int().nonnegative().optional(),
  }),
  params: z.object({
    id: z.uuid(),
  }),
});

export const updateQuizResponse = protectedProcedure
  .route({ method: "PUT", path: "/:id", inputStructure: "detailed" })
  .input(updateQuizResponseInputSchema)
  .handler(async ({ input: { body, params }, context }) => {
    const { id } = params;

    const existingQuizResponse = await database.query.quiz_response.findFirst({
      where: eq(quiz_response.id, id),
      with: {
        attempt: {
          with: {
            quiz: true,
          },
        },
        question: true,
      },
    });

    if (!existingQuizResponse) {
      throw new ORPCError("NOT_FOUND", {
        cause: "Quiz response not found",
      });
    }

    if (
      existingQuizResponse.attempt.quiz.organization_id !==
      context.organization.id
    ) {
      throw new ORPCError("NOT_FOUND", {
        cause: "Quiz response not found",
      });
    }

    const canUpdateQuizResponse = await auth.api.hasPermission({
      headers: await headers(),
      body: {
        permissions: {
          quiz_response: ["update"],
        },
      },
    });

    if (!canUpdateQuizResponse.success) {
      throw new ORPCError("UNAUTHORIZED", {
        cause: "You do not have permission to update a quiz response",
      });
    }

    const targetAttemptId =
      body.quiz_attempt_id ?? existingQuizResponse.quiz_attempt_id;
    const targetQuestionId =
      body.question_id ?? existingQuizResponse.question_id;

    const targetAttempt = await database.query.quiz_attempt.findFirst({
      where: eq(quiz_attempt.id, targetAttemptId),
      with: {
        quiz: true,
      },
    });

    if (
      !targetAttempt ||
      targetAttempt.quiz.organization_id !== context.organization.id
    ) {
      throw new ORPCError("NOT_FOUND", {
        cause: "Quiz attempt not found",
      });
    }

    const targetQuestion = await database.query.question.findFirst({
      where: eq(question.id, targetQuestionId),
      with: {
        quiz: true,
      },
    });

    if (!targetQuestion) {
      throw new ORPCError("NOT_FOUND", {
        cause: "Question not found",
      });
    }

    if (targetQuestion.quiz.id !== targetAttempt.quiz_id) {
      throw new ORPCError("CONFLICT", {
        cause: "Question does not belong to this quiz attempt",
      });
    }

    const questionOptions = targetQuestion.options ?? [];
    const selectedOption =
      body.selected_option ?? existingQuizResponse.selected_option;

    if (
      questionOptions.length > 0 &&
      selectedOption >= questionOptions.length
    ) {
      throw new ORPCError("BAD_REQUEST", {
        cause: "selected_option must be a valid options index",
      });
    }

    const duplicate = await database.query.quiz_response.findFirst({
      where: and(
        eq(quiz_response.quiz_attempt_id, targetAttemptId),
        eq(quiz_response.question_id, targetQuestionId),
      ),
    });

    if (duplicate && duplicate.id !== id) {
      throw new ORPCError("CONFLICT", {
        cause: "This question already has a response for the attempt",
      });
    }

    await database
      .update(quiz_response)
      .set({
        quiz_attempt_id: targetAttemptId,
        question_id: targetQuestionId,
        selected_option: selectedOption,
      })
      .where(eq(quiz_response.id, id));

    return {
      success: true,
    };
  });

