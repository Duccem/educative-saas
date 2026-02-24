import z from "zod";
import { protectedProcedure } from "../..";
import { database } from "@/lib/database";
import { and, ilike, count, eq, SQL, inArray } from "drizzle-orm";
import { quiz, quiz_attempt } from "@/lib/database/schema";

const listQuizAttemptsInput = z.object({
  query: z.object({
    quiz_id: z.string().optional(),
    student_id: z.string().optional(),
    page: z.coerce.number().int().positive().default(1),
    pageSize: z.coerce.number().int().positive().max(100).default(10),
  }),
});

export const listQuizAttempts = protectedProcedure
  .route({
    method: "GET",
    path: "/",
    inputStructure: "detailed",
  })
  .input(listQuizAttemptsInput)
  .handler(async ({ input: { query }, context }) => {
    const { quiz_id, student_id, page, pageSize } = query;
    const offset = (page - 1) * pageSize;

    const condition: SQL<unknown>[] = [
      eq(quiz_attempt.organization_id, context.organization.id),
    ];

    if (quiz_id) {
      condition.push(eq(quiz_attempt.quiz_id, quiz_id) as SQL<unknown>);
    }

    if (student_id) {
      condition.push(eq(quiz_attempt.student_id, student_id) as SQL<unknown>);
    }

    const [items, total] = await Promise.all([
      database.query.quiz_attempt.findMany({
        where: and(...condition),
        limit: pageSize,
        offset,
        with: {
          quiz: true,
          student: true,
        },
      }),
      database
        .select({ count: count(quiz_attempt.id) })
        .from(quiz_attempt)
        .where(and(...condition)),
    ]);

    return {
      items,
      total: Number(total[0]?.count ?? 0),
      page,
      pageSize,
    };
  });

