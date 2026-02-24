import z from "zod";
import { protectedProcedure } from "../..";
import { and, eq } from "drizzle-orm";
import { database } from "@/lib/database";
import { subject } from "@/lib/database/schema";
import { ORPCError } from "@orpc/server";

export const getSubject = protectedProcedure
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

    const existingSubject = await database.query.subject.findFirst({
      where: and(
        eq(subject.id, id),
        eq(subject.organization_id, organization.id),
      ),
    });

    if (!existingSubject) {
      throw new ORPCError("NOT_FOUND", {
        cause: "Subject not found",
      });
    }

    return {
      subject: existingSubject,
    };
  });

