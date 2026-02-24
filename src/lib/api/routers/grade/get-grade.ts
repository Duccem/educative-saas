import z from "zod";
import { protectedProcedure } from "../..";
import { and, eq } from "drizzle-orm";
import { database } from "@/lib/database";
import { grade } from "@/lib/database/schema";
import { ORPCError } from "@orpc/server";

export const getGrade = protectedProcedure
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

    const existingGrade = await database.query.grade.findFirst({
      where: and(eq(grade.id, id), eq(grade.organization_id, organization.id)),
    });

    if (!existingGrade) {
      throw new ORPCError("NOT_FOUND", {
        cause: "Grade not found",
      });
    }

    return {
      grade: existingGrade,
    };
  });

