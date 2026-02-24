import z from "zod";
import { protectedProcedure } from "../..";
import { database } from "@/lib/database";
import { and, ilike, count, eq, SQL } from "drizzle-orm";
import { classroom } from "@/lib/database/schema";

const listClassroomsInput = z.object({
  query: z.object({
    term: z.string().optional(),
    page: z.coerce.number().int().positive().default(1),
    pageSize: z.coerce.number().int().positive().max(100).default(10),
  }),
});

export const listClassrooms = protectedProcedure
  .route({
    method: "GET",
    path: "/",
    inputStructure: "detailed",
  })
  .input(listClassroomsInput)
  .handler(async ({ input: { query }, context }) => {
    const { term, page, pageSize } = query;
    const { organization } = context;
    const offset = (page - 1) * pageSize;

    const condition: SQL<unknown>[] = [
      eq(classroom.organization_id, organization.id),
    ];

    if (term) {
      condition.push(ilike(classroom.name, `%${term}%`) as SQL<unknown>);
    }

    const [items, total] = await Promise.all([
      database.query.classroom.findMany({
        where: and(...condition),
        limit: pageSize,
        offset,
      }),
      database
        .select({ count: count(classroom.id) })
        .from(classroom)
        .where(and(...condition)),
    ]);

    return {
      items,
      total: Number(total[0]?.count ?? 0),
      page,
      pageSize,
    };
  });

