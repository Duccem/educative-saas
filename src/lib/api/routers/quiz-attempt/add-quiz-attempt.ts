import { auth } from "@/lib/auth/auth-server";
import { protectedProcedure } from "../..";
import { database } from "@/lib/database";
import z from "zod";
import { headers } from "next/headers";
import { member, quiz, quiz_attempt } from "@/lib/database/schema";
import { ORPCError } from "@orpc/server";
import { and, eq } from "drizzle-orm";

const quizAttemptInputSchema = z.object({
  quiz_id: z.uuid(),
  student_id: z.uuid().optional(),
  score: z.string().optional(),
  feedback: z.string().optional(),
});

export const addQuizAttempt = protectedProcedure
  .route({ method: "POST", path: "/", inputStructure: "detailed" })
  .input(
    z.object({
      body: quizAttemptInputSchema,
    }),
  )
  .handler(async ({ input: { body }, context }) => {
    const canAddQuizAttempt = await auth.api.hasPermission({
      headers: await headers(),
      body: {
        permissions: {
          quiz_attempt: ["create"],
        },
      },
    });

    if (!canAddQuizAttempt.success) {
      throw new ORPCError("UNAUTHORIZED", {
        cause: "You do not have permission to create a quiz attempt",
      });
    }

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

    const studentId = body.student_id ?? context.session.user.id;

    const studentMember = await database.query.member.findFirst({
      where: and(
        eq(member.organizationId, context.organization.id),
        eq(member.userId, studentId),
        eq(member.role, "student"),
      ),
    });

    if (!studentMember) {
      throw new ORPCError("NOT_FOUND", {
        cause: "Student not found in this organization",
      });
    }

    const createdAttempt = await database
      .insert(quiz_attempt)
      .values({
        quiz_id: body.quiz_id,
        student_id: studentId,
        score: body.score ?? "0.00",
        feedback: body.feedback,
        organization_id: context.organization.id,
      })
      .returning({ id: quiz_attempt.id });

    return {
      success: true,
      quizAttemptId: createdAttempt[0]?.id,
    };
  });

