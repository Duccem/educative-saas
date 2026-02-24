import z from "zod";
import { protectedProcedure } from "../..";
import { database } from "@/lib/database";
import { and, count, eq, ilike, SQL } from "drizzle-orm";
import { assessment } from "@/lib/database/schema";

const listAssessmentsInput = z.object({
  query: z.object({
    term: z.string().optional(),
    course_id: z.uuid().optional(),
    academic_term_id: z.uuid().optional(),
    is_published: z.coerce.boolean().optional(),
    page: z.coerce.number().int().positive().default(1),
    pageSize: z.coerce.number().int().positive().max(100).default(10),
  }),
});

export const listAssessments = protectedProcedure
  .route({
    method: "GET",
    path: "/",
    inputStructure: "detailed",
  })
  .input(listAssessmentsInput)
  .handler(async ({ input: { query }, context }) => {
    const { term, course_id, academic_term_id, is_published, page, pageSize } =
      query;
    const offset = (page - 1) * pageSize;

    const condition: SQL<unknown>[] = [
      eq(assessment.organization_id, context.organization.id),
    ];

    if (term) {
      condition.push(ilike(assessment.title, `%${term}%`) as SQL<unknown>);
    }

    if (course_id) {
      condition.push(eq(assessment.course_id, course_id) as SQL<unknown>);
    }

    if (academic_term_id) {
      condition.push(
        eq(assessment.academic_term_id, academic_term_id) as SQL<unknown>,
      );
    }

    if (is_published !== undefined) {
      condition.push(eq(assessment.is_published, is_published) as SQL<unknown>);
    }

    const [items, total] = await Promise.all([
      database.query.assessment.findMany({
        where: and(...condition),
        limit: pageSize,
        offset,
        with: {
          course: true,
          academicTerm: true,
        },
      }),
      database
        .select({ count: count(assessment.id) })
        .from(assessment)
        .where(and(...condition)),
    ]);

    return {
      items,
      total: Number(total[0]?.count ?? 0),
      page,
      pageSize,
    };
  });

