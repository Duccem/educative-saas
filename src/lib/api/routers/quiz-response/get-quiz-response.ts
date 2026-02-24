import z from "zod";
import { protectedProcedure } from "../..";
import { eq } from "drizzle-orm";
import { database } from "@/lib/database";
import { quiz_response } from "@/lib/database/schema";
import { ORPCError } from "@orpc/server";

export const getQuizResponse = protectedProcedure
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

    return {
      quizResponse: existingQuizResponse,
    };
  });

