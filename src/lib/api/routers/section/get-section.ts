import z from "zod";
import { protectedProcedure } from "../..";
import { and, eq } from "drizzle-orm";
import { database } from "@/lib/database";
import { section } from "@/lib/database/schema";
import { ORPCError } from "@orpc/server";

export const getSection = protectedProcedure
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

    const existingSection = await database.query.section.findFirst({
      where: and(
        eq(section.id, id),
        eq(section.organization_id, organization.id),
      ),
    });

    if (!existingSection) {
      throw new ORPCError("NOT_FOUND", {
        cause: "Section not found",
      });
    }

    return {
      section: existingSection,
    };
  });

