import z from "zod";
import { protectedProcedure } from "../..";
import { eq } from "drizzle-orm";
import { database } from "@/lib/database";
import { quiz_attempt } from "@/lib/database/schema";
import { ORPCError } from "@orpc/server";

export const getQuizAttempt = protectedProcedure
  .route({ method: "GET", path: "/:id", inputStructure: "detailed" })
  .input(
    z.object({
      params: z.object({
        id: z.uuid(),
      }),
    }),
  )
  .handler(async ({ input: { params }, context }) => {
    const { id } = params;

    const existingQuizAttempt = await database.query.quiz_attempt.findFirst({
      where: eq(quiz_attempt.id, id),
      with: {
        quiz: true,
        student: true,
        responses: true,
      },
    });

    if (!existingQuizAttempt) {
      throw new ORPCError("NOT_FOUND", {
        cause: "Quiz attempt not found",
      });
    }

    if (existingQuizAttempt.quiz.organization_id !== context.organization.id) {
      throw new ORPCError("NOT_FOUND", {
        cause: "Quiz attempt not found",
      });
    }

    return {
      quizAttempt: existingQuizAttempt,
    };
  });

