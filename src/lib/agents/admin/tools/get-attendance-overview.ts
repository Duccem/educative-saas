import { getRequiredContext } from "@/lib/agents/utils";
import { database } from "@/lib/database";
import { class_attendance } from "@/lib/database/schema";
import { and, eq, gte, lte } from "drizzle-orm";
import { tool } from "ai";
import z from "zod";
import { assertAdminAccess } from "./assert-admin-access";

export const getAttendanceOverview = tool({
  description:
    "Get attendance summary for the organization, with optional course and date range filters.",
  inputSchema: z.object({
    courseId: z.string().uuid().optional(),
    fromDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional(),
    toDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional(),
  }),
  execute: async ({ courseId, fromDate, toDate }, options) => {
    const { organizationId, userId } = getRequiredContext(
      options.experimental_context,
    );

    await assertAdminAccess({ organizationId, userId });

    const whereConditions = [
      eq(class_attendance.organization_id, organizationId),
    ];

    if (courseId) {
      whereConditions.push(eq(class_attendance.course_id, courseId));
    }

    if (fromDate) {
      whereConditions.push(gte(class_attendance.attendance_date, fromDate));
    }

    if (toDate) {
      whereConditions.push(lte(class_attendance.attendance_date, toDate));
    }

    const rows = await database.query.class_attendance.findMany({
      where: and(...whereConditions),
      with: {
        student: true,
        schedule: {
          with: {
            course: true,
          },
        },
      },
    });

    const statusTotals = rows.reduce<Record<string, number>>(
      (accumulator, row) => {
        const key = row.status.toLowerCase();
        accumulator[key] = (accumulator[key] ?? 0) + 1;
        return accumulator;
      },
      {},
    );

    const courseTotals = rows.reduce<
      Record<
        string,
        {
          courseId: string;
          courseName: string;
          total: number;
          present: number;
          absent: number;
          late: number;
        }
      >
    >((accumulator, row) => {
      const key = row.course_id;
      const entry = accumulator[key] ?? {
        courseId: row.course_id,
        courseName: row.schedule.course.name,
        total: 0,
        present: 0,
        absent: 0,
        late: 0,
      };

      entry.total += 1;
      if (row.status.toLowerCase() === "present") entry.present += 1;
      if (row.status.toLowerCase() === "absent") entry.absent += 1;
      if (row.status.toLowerCase() === "late") entry.late += 1;

      accumulator[key] = entry;
      return accumulator;
    }, {});

    return {
      totals: {
        records: rows.length,
        byStatus: statusTotals,
      },
      byCourse: Object.values(courseTotals),
      sample: rows.slice(0, 50).map((row) => ({
        id: row.id,
        date: row.attendance_date,
        status: row.status,
        courseId: row.course_id,
        courseName: row.schedule.course.name,
        studentId: row.student_id,
        studentName: row.student.name,
      })),
    };
  },
});

