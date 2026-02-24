import z from "zod";
import { protectedProcedure } from "../..";
import { database } from "@/lib/database";
import { and, ilike, count, or, eq, SQL } from "drizzle-orm";
import { quiz } from "@/lib/database/schema";

const listQuizzesInput = z.object({
  query: z.object({
    term: z.string().optional(),
    page: z.coerce.number().int().positive().default(1),
    pageSize: z.coerce.number().int().positive().max(100).default(10),
  }),
});

export const listQuizzes = protectedProcedure
  .route({
    method: "GET",
    path: "/",
    inputStructure: "detailed",
  })
  .input(listQuizzesInput)
  .handler(async ({ input: { query }, context }) => {
    const { term, page, pageSize } = query;
    const offset = (page - 1) * pageSize;

    const condition: SQL<unknown>[] = [
      eq(quiz.organization_id, context.organization.id),
    ];

    if (term) {
      condition.push(
        or(
          ilike(quiz.title, `%${term}%`),
          ilike(quiz.description, `%${term}%`),
        ) as SQL<unknown>,
      );
    }

    const [items, total] = await Promise.all([
      database.query.quiz.findMany({
        where: and(...condition),
        limit: pageSize,
        offset,
      }),
      database
        .select({ count: count(quiz.id) })
        .from(quiz)
        .where(and(...condition)),
    ]);

    return {
      items,
      total: Number(total[0]?.count ?? 0),
      page,
      pageSize,
    };
  });

