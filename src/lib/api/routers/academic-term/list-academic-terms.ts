import z from "zod";
import { protectedProcedure } from "../..";
import { database } from "@/lib/database";
import { and, ilike, count, eq } from "drizzle-orm";
import { academic_term } from "@/lib/database/schema";

const listAcademicTermsInput = z.object({
  query: z.object({
    term: z.string().optional(),
    page: z.coerce.number().int().positive().default(1),
    pageSize: z.coerce.number().int().positive().max(100).default(10),
  }),
});

export const listAcademicTerms = protectedProcedure
  .route({
    method: "GET",
    path: "/",
    inputStructure: "detailed",
  })
  .input(listAcademicTermsInput)
  .handler(async ({ input: { query }, context }) => {
    const { term, page, pageSize } = query;
    const { organization } = context;
    const offset = (page - 1) * pageSize;

    const condition = [eq(academic_term.organization_id, organization.id)];

    if (term) {
      condition.push(ilike(academic_term.name, `%${term}%`));
    }

    const [items, total] = await Promise.all([
      database.query.academic_term.findMany({
        where: and(...condition),
        limit: pageSize,
        offset,
      }),
      database
        .select({ count: count(academic_term.id) })
        .from(academic_term)
        .where(and(...condition)),
    ]);

    return {
      items,
      total: Number(total[0]?.count ?? 0),
      page,
      pageSize,
    };
  });

