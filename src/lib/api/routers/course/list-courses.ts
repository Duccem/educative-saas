import z from "zod";
import { protectedProcedure } from "../..";
import { database } from "@/lib/database";
import { and, ilike, count, eq } from "drizzle-orm";
import { course } from "@/lib/database/schema";

const listCoursesInput = z.object({
  query: z.object({
    term: z.string().optional(),
    page: z.coerce.number().int().positive().default(1),
    pageSize: z.coerce.number().int().positive().max(100).default(10),
  }),
});

export const listCourses = protectedProcedure
  .route({
    method: "GET",
    path: "/",
    inputStructure: "detailed",
  })
  .input(listCoursesInput)
  .handler(async ({ input: { query }, context }) => {
    const { term, page, pageSize } = query;
    const { organization } = context;
    const offset = (page - 1) * pageSize;

    const condition = [eq(course.organization_id, organization.id)];

    if (term) {
      condition.push(ilike(course.name, `%${term}%`));
    }

    const [items, total] = await Promise.all([
      database.query.course.findMany({
        where: and(...condition),
        limit: pageSize,
        offset,
      }),
      database
        .select({ count: count(course.id) })
        .from(course)
        .where(and(...condition)),
    ]);

    return {
      items,
      total: Number(total[0]?.count ?? 0),
      page,
      pageSize,
    };
  });

