import z from "zod";
import { protectedProcedure } from "../..";
import { database } from "@/lib/database";
import { and, ilike, count, or, eq, SQL } from "drizzle-orm";
import { subject } from "@/lib/database/schema";
const listSubjectsInput = z.object({
  query: z.object({
    term: z.string().optional(),
    page: z.coerce.number().int().positive().default(1),
    pageSize: z.coerce.number().int().positive().max(100).default(10),
  }),
});
export const listSubjects = protectedProcedure
  .route({
    method: "GET",
    path: "/",
    inputStructure: "detailed",
  })
  .input(listSubjectsInput)
  .handler(async ({ input: { query }, context }) => {
    const { term, page, pageSize } = query;
    const { organization } = context;
    const offset = (page - 1) * pageSize;

    const condition = [eq(subject.organization_id, organization.id)];

    if (term) {
      condition.push(
        or(
          ilike(subject.name, `%${term}%`),
          ilike(subject.description, `%${term}%`),
        ) as SQL<unknown>,
      );
    }

    const [items, total] = await Promise.all([
      database.query.subject.findMany({
        where: and(...condition),
        limit: pageSize,
        offset,
      }),
      database
        .select({ count: count(subject.id) })
        .from(subject)
        .where(and(...condition)),
    ]);

    return {
      items,
      total: Number(total[0]?.count ?? 0),
      page,
      pageSize,
    };
  });

