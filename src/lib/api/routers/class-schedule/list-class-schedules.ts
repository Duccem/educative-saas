import z from "zod";
import { protectedProcedure } from "../..";
import { database } from "@/lib/database";
import { and, count, eq, inArray, ilike, SQL } from "drizzle-orm";
import { class_schedule, course } from "@/lib/database/schema";

const listClassSchedulesInput = z.object({
  query: z.object({
    term: z.string().optional(),
    page: z.coerce.number().int().positive().default(1),
    pageSize: z.coerce.number().int().positive().max(100).default(10),
  }),
});

export const listClassSchedules = protectedProcedure
  .route({
    method: "GET",
    path: "/",
    inputStructure: "detailed",
  })
  .input(listClassSchedulesInput)
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

    const condition: SQL<unknown>[] = [
      inArray(class_schedule.course_id, courseIds),
    ];

    if (term) {
      condition.push(
        ilike(class_schedule.start_time, `%${term}%`) as SQL<unknown>,
      );
    }

    const [items, total] = await Promise.all([
      database.query.class_schedule.findMany({
        where: and(...condition),
        limit: pageSize,
        offset,
        with: {
          course: true,
          classroom: true,
        },
      }),
      database
        .select({ count: count(class_schedule.id) })
        .from(class_schedule)
        .where(and(...condition)),
    ]);

    return {
      items,
      total: Number(total[0]?.count ?? 0),
      page,
      pageSize,
    };
  });

