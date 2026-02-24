import { database } from "@/lib/database";
import { protectedProcedure } from "../..";
import z from "zod";
import { eq } from "drizzle-orm";
import { quiz_response } from "@/lib/database/schema";
import { ORPCError } from "@orpc/server";
import { auth } from "@/lib/auth/auth-server";
import { headers } from "next/headers";

export const deleteQuizResponse = protectedProcedure
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

    const canDeleteQuizResponse = await auth.api.hasPermission({
      headers: await headers(),
      body: {
        permissions: {
          quiz_response: ["delete"],
        },
      },
    });

    if (!canDeleteQuizResponse.success) {
      throw new ORPCError("UNAUTHORIZED", {
        cause: "You do not have permission to delete a quiz response",
      });
    }

    const existingQuizResponse = await database.query.quiz_response.findFirst({
      where: eq(quiz_response.id, id),
      with: {
        attempt: {
          with: {
            quiz: true,
          },
        },
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

    await database.delete(quiz_response).where(eq(quiz_response.id, id));

    return {
      success: true,
    };
  });

