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
    status: z.string().optional(),
    student_id: z.string().optional(),
    schedule_id: z.string().optional(),
    course_id: z.string().optional(),
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
    const { status, student_id, schedule_id, course_id, page, pageSize } =
      query;
    const offset = (page - 1) * pageSize;

    const condition: SQL<unknown>[] = [
      eq(class_attendance.organization_id, context.organization.id),
    ];

    if (status) {
      condition.push(eq(class_attendance.status, status));
    }

    if (student_id) {
      condition.push(eq(class_attendance.student_id, student_id));
    }

    if (schedule_id) {
      condition.push(eq(class_attendance.class_schedule_id, schedule_id));
    }

    if (course_id) {
      condition.push(eq(class_attendance.course_id, course_id));
    }

    const [items, total] = await Promise.all([
      database.query.class_attendance.findMany({
        where: and(...condition),
        limit: pageSize,
        offset,
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

