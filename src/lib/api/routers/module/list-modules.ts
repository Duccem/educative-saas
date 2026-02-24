import z from "zod";
import { protectedProcedure } from "../..";
import { database } from "@/lib/database";
import { and, ilike, count, eq, inArray } from "drizzle-orm";
import { course, module as moduleTable } from "@/lib/database/schema";

const listModulesInput = z.object({
  query: z.object({
    term: z.string().optional(),
    page: z.coerce.number().int().positive().default(1),
    pageSize: z.coerce.number().int().positive().max(100).default(10),
  }),
});

export const listModules = protectedProcedure
  .route({
    method: "GET",
    path: "/",
    inputStructure: "detailed",
  })
  .input(listModulesInput)
  .handler(async ({ input: { query }, context }) => {
    const { term, page, pageSize } = query;
    const offset = (page - 1) * pageSize;

    const organizationCourses = await database.query.course.findMany({
      where: eq(course.organization_id, context.organization.id),
      columns: { id: true },
    });

    const courseIds = organizationCourses.map((item) => item.id);

    if (courseIds.length === 0) {
      return {
        items: [],
        total: 0,
        page,
        pageSize,
      };
    }

    const condition = [inArray(moduleTable.course_id, courseIds)];

    if (term) {
      condition.push(ilike(moduleTable.title, `%${term}%`));
    }

    const [items, total] = await Promise.all([
      database.query.module.findMany({
        where: and(...condition),
        limit: pageSize,
        offset,
      }),
      database
        .select({ count: count(moduleTable.id) })
        .from(moduleTable)
        .where(and(...condition)),
    ]);

    return {
      items,
      total: Number(total[0]?.count ?? 0),
      page,
      pageSize,
    };
  });

