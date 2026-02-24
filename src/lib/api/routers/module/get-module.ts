import z from "zod";
import { protectedProcedure } from "../..";
import { eq } from "drizzle-orm";
import { database } from "@/lib/database";
import { module as moduleTable } from "@/lib/database/schema";
import { ORPCError } from "@orpc/server";

export const getModule = protectedProcedure
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

    const existingModule = await database.query.module.findFirst({
      where: eq(moduleTable.id, id),
      with: {
        course: true,
      },
    });

    if (!existingModule) {
      throw new ORPCError("NOT_FOUND", {
        cause: "Module not found",
      });
    }

    if (existingModule.course.organization_id !== context.organization.id) {
      throw new ORPCError("NOT_FOUND", {
        cause: "Module not found",
      });
    }

    return {
      module: existingModule,
    };
  });

