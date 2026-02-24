import z from "zod";
import { protectedProcedure } from "../..";
import { database } from "@/lib/database";
import { and, count, eq, inArray, ilike, SQL } from "drizzle-orm";
import {
  class_attendance,
  class_schedule,
  course,
} from "@/lib/database/schema";

const listClassAttendanceInput = z.object({
  query: z.object({
    term: z.string().optional(),
    page: z.coerce.number().int().positive().default(1),
    pageSize: z.coerce.number().int().positive().max(100).default(10),
  }),
});

export const listClassAttendance = protectedProcedure
  .route({
    method: "GET",
    path: "/",
    inputStructure: "detailed",
  })
  .input(listClassAttendanceInput)
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

    const organizationSchedules = await database.query.class_schedule.findMany({
      where: inArray(class_schedule.course_id, courseIds),
      columns: { id: true },
    });

    const scheduleIds = organizationSchedules.map((item) => item.id);

    if (scheduleIds.length === 0) {
      return {
        items: [],
        total: 0,
        page,
        pageSize,
      };
    }

    const condition: SQL<unknown>[] = [
      inArray(class_attendance.class_schedule_id, scheduleIds),
    ];

    if (term) {
      condition.push(
        ilike(class_attendance.status, `%${term}%`) as SQL<unknown>,
      );
    }

    const [items, total] = await Promise.all([
      database.query.class_attendance.findMany({
        where: and(...condition),
        limit: pageSize,
        offset,
        with: {
          schedule: {
            with: {
              course: true,
              classroom: true,
            },
          },
          student: true,
        },
      }),
      database
        .select({ count: count(class_attendance.id) })
        .from(class_attendance)
        .where(and(...condition)),
    ]);

    return {
      items,
      total: Number(total[0]?.count ?? 0),
      page,
      pageSize,
    };
  });

