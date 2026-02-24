import z from "zod";
import { protectedProcedure } from "../..";
import { and, eq } from "drizzle-orm";
import { database } from "@/lib/database";
import { quiz } from "@/lib/database/schema";
import { ORPCError } from "@orpc/server";

export const getQuiz = protectedProcedure
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

    const existingQuiz = await database.query.quiz.findFirst({
      where: and(
        eq(quiz.id, id),
        eq(quiz.organization_id, context.organization.id),
      ),
      with: {
        questions: true,
      },
    });

    if (!existingQuiz) {
      throw new ORPCError("NOT_FOUND", {
        cause: "Quiz not found",
      });
    }

    return {
      quiz: existingQuiz,
    };
  });

