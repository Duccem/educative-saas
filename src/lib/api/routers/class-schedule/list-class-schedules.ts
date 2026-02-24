import z from "zod";
import { protectedProcedure } from "../..";
import { database } from "@/lib/database";
import { and, count, eq, inArray, ilike, SQL, gte } from "drizzle-orm";
import { class_schedule, classroom, course } from "@/lib/database/schema";

const listClassSchedulesInput = z.object({
  query: z.object({
    hour: z.string().optional(),
    course_id: z.string().optional(),
    classroom_id: z.string().optional(),
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
    const { hour, course_id, classroom_id, page, pageSize } = query;
    const offset = (page - 1) * pageSize;

    const condition: SQL<unknown>[] = [
      eq(class_schedule.organization_id, context.organization.id),
    ];

    if (hour) {
      condition.push(eq(class_schedule.start_time, hour));
    }

    if (course_id) {
      condition.push(eq(class_schedule.course_id, course_id));
    }

    if (classroom_id) {
      condition.push(eq(class_schedule.classroom_id, classroom_id));
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

