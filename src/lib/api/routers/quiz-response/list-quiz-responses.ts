import z from "zod";
import { protectedProcedure } from "../..";
import { database } from "@/lib/database";
import { and, count, eq, SQL } from "drizzle-orm";
import { quiz_response } from "@/lib/database/schema";

const listQuizResponsesInput = z.object({
  query: z.object({
    attempt_id: z.string().optional(),
    page: z.coerce.number().int().positive().default(1),
    pageSize: z.coerce.number().int().positive().max(100).default(10),
  }),
});

export const listQuizResponses = protectedProcedure
  .route({
    method: "GET",
    path: "/",
    inputStructure: "detailed",
  })
  .input(listQuizResponsesInput)
  .handler(async ({ input: { query }, context }) => {
    const { page, pageSize } = query;
    const offset = (page - 1) * pageSize;

    const condition: SQL<unknown>[] = [
      eq(quiz_response.organization_id, context.organization.id),
    ];

    if (query.attempt_id) {
      condition.push(
        eq(quiz_response.quiz_attempt_id, query.attempt_id) as SQL<unknown>,
      );
    }

    const [items, total] = await Promise.all([
      database.query.quiz_response.findMany({
        where: and(...condition),
        limit: pageSize,
        offset,
        with: {
          question: true,
        },
      }),
      database
        .select({ count: count(quiz_response.id) })
        .from(quiz_response)
        .where(and(...condition)),
    ]);

    return {
      items,
      total: Number(total[0]?.count ?? 0),
      page,
      pageSize,
    };
  });

