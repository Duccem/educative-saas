import z from "zod";
import { protectedProcedure } from "../..";
import { database } from "@/lib/database";
import { and, count, eq, inArray, SQL } from "drizzle-orm";
import { enrollment, student_assessment_grade } from "@/lib/database/schema";

const listStudentAssessmentGradesInput = z.object({
  query: z.object({
    assessment_id: z.uuid().optional(),
    enrollment_id: z.uuid().optional(),
    student_id: z.uuid().optional(),
    status: z.enum(["draft", "published", "excused", "missing"]).optional(),
    page: z.coerce.number().int().positive().default(1),
    pageSize: z.coerce.number().int().positive().max(100).default(10),
  }),
});

export const listStudentAssessmentGrades = protectedProcedure
  .route({
    method: "GET",
    path: "/",
    inputStructure: "detailed",
  })
  .input(listStudentAssessmentGradesInput)
  .handler(async ({ input: { query }, context }) => {
    const { assessment_id, enrollment_id, student_id, status, page, pageSize } =
      query;
    const offset = (page - 1) * pageSize;

    const condition: SQL<unknown>[] = [
      eq(student_assessment_grade.organization_id, context.organization.id),
    ];

    if (assessment_id) {
      condition.push(
        eq(
          student_assessment_grade.assessment_id,
          assessment_id,
        ) as SQL<unknown>,
      );
    }

    if (enrollment_id) {
      condition.push(
        eq(
          student_assessment_grade.enrollment_id,
          enrollment_id,
        ) as SQL<unknown>,
      );
    }

    if (status) {
      condition.push(
        eq(student_assessment_grade.status, status) as SQL<unknown>,
      );
    }

    if (student_id) {
      const enrollments = await database
        .select({ id: enrollment.id })
        .from(enrollment)
        .where(
          and(
            eq(enrollment.organization_id, context.organization.id),
            eq(enrollment.student_id, student_id),
          ),
        );

      const enrollmentIds = enrollments.map((item) => item.id);

      if (enrollmentIds.length === 0) {
        return {
          items: [],
          total: 0,
          page,
          pageSize,
        };
      }

      condition.push(
        inArray(
          student_assessment_grade.enrollment_id,
          enrollmentIds,
        ) as SQL<unknown>,
      );
    }

    const [items, total] = await Promise.all([
      database.query.student_assessment_grade.findMany({
        where: and(...condition),
        limit: pageSize,
        offset,
        with: {
          assessment: true,
          enrollment: true,
          grader: true,
        },
      }),
      database
        .select({ count: count(student_assessment_grade.id) })
        .from(student_assessment_grade)
        .where(and(...condition)),
    ]);

    return {
      items,
      total: Number(total[0]?.count ?? 0),
      page,
      pageSize,
    };
  });

