import z from "zod";
import { protectedProcedure } from "../..";
import { database } from "@/lib/database";
import { and, count, eq, SQL } from "drizzle-orm";
import { course_final_grade } from "@/lib/database/schema";

const listCourseFinalGradesInput = z.object({
  query: z.object({
    course_id: z.uuid().optional(),
    enrollment_id: z.uuid().optional(),
    student_id: z.uuid().optional(),
    status: z.enum(["in_progress", "finalized", "published"]).optional(),
    page: z.coerce.number().int().positive().default(1),
    pageSize: z.coerce.number().int().positive().max(100).default(10),
  }),
});

export const listCourseFinalGrades = protectedProcedure
  .route({
    method: "GET",
    path: "/",
    inputStructure: "detailed",
  })
  .input(listCourseFinalGradesInput)
  .handler(async ({ input: { query }, context }) => {
    const { course_id, enrollment_id, student_id, status, page, pageSize } =
      query;
    const offset = (page - 1) * pageSize;

    const condition: SQL<unknown>[] = [
      eq(course_final_grade.organization_id, context.organization.id),
    ];

    if (course_id) {
      condition.push(
        eq(course_final_grade.course_id, course_id) as SQL<unknown>,
      );
    }

    if (enrollment_id) {
      condition.push(
        eq(course_final_grade.enrollment_id, enrollment_id) as SQL<unknown>,
      );
    }

    if (student_id) {
      condition.push(
        eq(course_final_grade.student_id, student_id) as SQL<unknown>,
      );
    }

    if (status) {
      condition.push(eq(course_final_grade.status, status) as SQL<unknown>);
    }

    const [items, total] = await Promise.all([
      database.query.course_final_grade.findMany({
        where: and(...condition),
        limit: pageSize,
        offset,
        with: {
          course: true,
          enrollment: true,
          student: true,
        },
      }),
      database
        .select({ count: count(course_final_grade.id) })
        .from(course_final_grade)
        .where(and(...condition)),
    ]);

    return {
      items,
      total: Number(total[0]?.count ?? 0),
      page,
      pageSize,
    };
  });

