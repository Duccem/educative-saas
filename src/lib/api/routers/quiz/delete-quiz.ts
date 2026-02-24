import { database } from "@/lib/database";
import { protectedProcedure } from "../..";
import z from "zod";
import { and, eq } from "drizzle-orm";
import { quiz } from "@/lib/database/schema";
import { ORPCError } from "@orpc/server";
import { auth } from "@/lib/auth/auth-server";
import { headers } from "next/headers";

export const deleteQuiz = protectedProcedure
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

    const canDeleteQuiz = await auth.api.hasPermission({
      headers: await headers(),
      body: {
        permissions: {
          quiz: ["delete"],
        },
      },
    });

    if (!canDeleteQuiz.success) {
      throw new ORPCError("UNAUTHORIZED", {
        cause: "You do not have permission to delete a quiz",
      });
    }

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

    await database.delete(quiz).where(eq(quiz.id, id));

    return {
      success: true,
    };
  });

