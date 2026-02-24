import z from "zod";
import { protectedProcedure } from "../..";
import { and, eq } from "drizzle-orm";
import { database } from "@/lib/database";
import { academic_term } from "@/lib/database/schema";
import { ORPCError } from "@orpc/server";

export const getAcademicTerm = protectedProcedure
  .route({ method: "GET", path: "/:id", inputStructure: "detailed" })
  .input(
    z.object({
      params: z.object({
        id: z.uuid(),
      }),
    }),
  )
  .handler(async ({ input: { params }, context }) => {
    const { id } = params;
    const { organization } = context;

    const existingAcademicTerm = await database.query.academic_term.findFirst({
      where: and(
        eq(academic_term.id, id),
        eq(academic_term.organization_id, organization.id),
      ),
    });

    if (!existingAcademicTerm) {
      throw new ORPCError("NOT_FOUND", {
        cause: "Academic term not found",
      });
    }

    return {
      academicTerm: existingAcademicTerm,
    };
  });

