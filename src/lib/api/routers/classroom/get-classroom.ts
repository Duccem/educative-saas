import z from "zod";
import { protectedProcedure } from "../..";
import { and, eq } from "drizzle-orm";
import { database } from "@/lib/database";
import { classroom } from "@/lib/database/schema";
import { ORPCError } from "@orpc/server";

export const getClassroom = protectedProcedure
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

    const existingClassroom = await database.query.classroom.findFirst({
      where: and(
        eq(classroom.id, id),
        eq(classroom.organization_id, organization.id),
      ),
    });

    if (!existingClassroom) {
      throw new ORPCError("NOT_FOUND", {
        cause: "Classroom not found",
      });
    }

    return {
      classroom: existingClassroom,
    };
  });

