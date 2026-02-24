import { database } from "@/lib/database";
import { protectedProcedure } from "../..";
import z from "zod";
import { eq } from "drizzle-orm";
import { quiz_attempt } from "@/lib/database/schema";
import { ORPCError } from "@orpc/server";
import { auth } from "@/lib/auth/auth-server";
import { headers } from "next/headers";

export const deleteQuizAttempt = protectedProcedure
  .route({ method: "DELETE", path: "/:id", inputStructure: "detailed" })
  .input(
    z.object({
      params: z.object({
        id: z.uuid(),
      }),
    }),
  )
  .handler(async ({ input: { params }, context }) => {
    const { id } = params;

    const canDeleteQuizAttempt = await auth.api.hasPermission({
      headers: await headers(),
      body: {
        permissions: {
          quiz_attempt: ["delete"],
        },
      },
    });

    if (!canDeleteQuizAttempt.success) {
      throw new ORPCError("UNAUTHORIZED", {
        cause: "You do not have permission to delete a quiz attempt",
      });
    }

    const existingQuizAttempt = await database.query.quiz_attempt.findFirst({
      where: eq(quiz_attempt.id, id),
      with: {
        quiz: true,
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

    await database.delete(quiz_attempt).where(eq(quiz_attempt.id, id));

    return {
      success: true,
    };
  });

