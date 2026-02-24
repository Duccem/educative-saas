import z from "zod";
import { protectedProcedure } from "../..";
import { database } from "@/lib/database";
import { ORPCError } from "@orpc/server";
import { member, quiz, quiz_attempt } from "@/lib/database/schema";
import { and, eq } from "drizzle-orm";
import { auth } from "@/lib/auth/auth-server";
import { headers } from "next/headers";

const updateQuizAttemptInputSchema = z.object({
  body: z.object({
    quiz_id: z.uuid().optional(),
    student_id: z.uuid().optional(),
    score: z.string().optional(),
    feedback: z.string().optional(),
  }),
  params: z.object({
    id: z.uuid(),
  }),
});

export const updateQuizAttempt = protectedProcedure
  .route({ method: "PUT", path: "/:id", inputStructure: "detailed" })
  .input(updateQuizAttemptInputSchema)
  .handler(async ({ input: { body, params }, context }) => {
    const { id } = params;

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

    const canUpdateQuizAttempt = await auth.api.hasPermission({
      headers: await headers(),
      body: {
        permissions: {
          quiz_attempt: ["update"],
        },
      },
    });

    if (!canUpdateQuizAttempt.success) {
      throw new ORPCError("UNAUTHORIZED", {
        cause: "You do not have permission to update a quiz attempt",
      });
    }

    if (body.quiz_id) {
      const existingQuiz = await database.query.quiz.findFirst({
        where: and(
          eq(quiz.id, body.quiz_id),
          eq(quiz.organization_id, context.organization.id),
        ),
      });

      if (!existingQuiz) {
        throw new ORPCError("NOT_FOUND", {
          cause: "Quiz not found",
        });
      }
    }

    if (body.student_id) {
      const studentMember = await database.query.member.findFirst({
        where: and(
          eq(member.organizationId, context.organization.id),
          eq(member.userId, body.student_id),
          eq(member.role, "student"),
        ),
      });

      if (!studentMember) {
        throw new ORPCError("NOT_FOUND", {
          cause: "Student not found in this organization",
        });
      }
    }

    await database
      .update(quiz_attempt)
      .set({
        quiz_id: body.quiz_id ?? existingQuizAttempt.quiz_id,
        student_id: body.student_id ?? existingQuizAttempt.student_id,
        score: body.score ?? existingQuizAttempt.score,
        feedback: body.feedback ?? existingQuizAttempt.feedback,
      })
      .where(eq(quiz_attempt.id, id));

    return {
      success: true,
    };
  });

