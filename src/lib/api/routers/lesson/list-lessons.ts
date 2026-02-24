import z from "zod";
import { protectedProcedure } from "../..";
import { database } from "@/lib/database";
import { and, ilike, count, eq, inArray, SQL } from "drizzle-orm";
import { course, lesson, module as moduleTable } from "@/lib/database/schema";

const listLessonsInput = z.object({
  query: z.object({
    term: z.string().optional(),
    page: z.coerce.number().int().positive().default(1),
    pageSize: z.coerce.number().int().positive().max(100).default(10),
  }),
});

export const listLessons = protectedProcedure
  .route({
    method: "GET",
    path: "/",
    inputStructure: "detailed",
  })
  .input(listLessonsInput)
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

    const organizationModules = await database.query.module.findMany({
      where: inArray(moduleTable.course_id, courseIds),
      columns: { id: true },
    });

    const moduleIds = organizationModules.map((item) => item.id);

    if (moduleIds.length === 0) {
      return {
        items: [],
        total: 0,
        page,
        pageSize,
      };
    }

    const condition: SQL<unknown>[] = [inArray(lesson.module_id, moduleIds)];

    if (term) {
      condition.push(ilike(lesson.title, `%${term}%`) as SQL<unknown>);
    }

    const [items, total] = await Promise.all([
      database.query.lesson.findMany({
        where: and(...condition),
        limit: pageSize,
        offset,
      }),
      database
        .select({ count: count(lesson.id) })
        .from(lesson)
        .where(and(...condition)),
    ]);

    return {
      items,
      total: Number(total[0]?.count ?? 0),
      page,
      pageSize,
    };
  });

