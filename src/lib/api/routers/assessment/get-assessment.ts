import z from "zod";
import { protectedProcedure } from "../..";
import { and, eq } from "drizzle-orm";
import { database } from "@/lib/database";
import { assessment } from "@/lib/database/schema";
import { ORPCError } from "@orpc/server";

export const getAssessment = protectedProcedure
  .route({ method: "GET", path: "/:id", inputStructure: "detailed" })
  .input(
    z.object({
      params: z.object({
        id: z.uuid(),
      }),
    }),
  )
  .handler(async ({ input: { params }, context }) => {
    const existingAssessment = await database.query.assessment.findFirst({
      where: and(
        eq(assessment.id, params.id),
        eq(assessment.organization_id, context.organization.id),
      ),
      with: {
        course: true,
        academicTerm: true,
        creator: true,
      },
    });

    if (!existingAssessment) {
      throw new ORPCError("NOT_FOUND", {
        cause: "Assessment not found",
      });
    }

    return {
      assessment: existingAssessment,
    };
  });

