import z from "zod";
import { protectedProcedure } from "../..";
import { database } from "@/lib/database";
import { and, ilike, count, or, eq, SQL } from "drizzle-orm";
import { section } from "@/lib/database/schema";

const listSectionsInput = z.object({
  query: z.object({
    term: z.string().optional(),
    grade_id: z.uuid().optional(),
    page: z.coerce.number().int().positive().default(1),
    pageSize: z.coerce.number().int().positive().max(100).default(10),
  }),
});

export const listSections = protectedProcedure
  .route({
    method: "GET",
    path: "/",
    inputStructure: "detailed",
  })
  .input(listSectionsInput)
  .handler(async ({ input: { query }, context }) => {
    const { term, grade_id, page, pageSize } = query;
    const { organization } = context;
    const offset = (page - 1) * pageSize;

    const condition: SQL<unknown>[] = [
      eq(section.organization_id, organization.id),
    ];

    if (grade_id) {
      condition.push(eq(section.grade_id, grade_id));
    }

    if (term) {
      condition.push(
        or(
          ilike(section.name, `%${term}%`),
          ilike(section.description, `%${term}%`),
        ) as SQL<unknown>,
      );
    }

    const [items, total] = await Promise.all([
      database.query.section.findMany({
        where: and(...condition),
        limit: pageSize,
        offset,
      }),
      database
        .select({ count: count(section.id) })
        .from(section)
        .where(and(...condition)),
    ]);

    return {
      items,
      total: Number(total[0]?.count ?? 0),
      page,
      pageSize,
    };
  });

