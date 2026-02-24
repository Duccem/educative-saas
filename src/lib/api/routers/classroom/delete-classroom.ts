import { database } from "@/lib/database";
import { protectedProcedure } from "../..";
import z from "zod";
import { and, eq } from "drizzle-orm";
import { classroom } from "@/lib/database/schema";
import { ORPCError } from "@orpc/server";
import { auth } from "@/lib/auth/auth-server";
import { headers } from "next/headers";

export const deleteClassroom = protectedProcedure
  .route({ method: "DELETE", path: "/:id", inputStructure: "detailed" })
  .input(
    z.object({
      params: z.object({
        id: z.uuid(),
      }),
    }),
  )
  .handler(async ({ input: { params }, context }) => {
    const { id } = params;

    const canDeleteClassroom = await auth.api.hasPermission({
      headers: await headers(),
      body: {
        permissions: {
          classroom: ["delete"],
        },
      },
    });

    if (!canDeleteClassroom.success) {
      throw new ORPCError("UNAUTHORIZED", {
        cause: "You do not have permission to delete a classroom",
      });
    }

    const existingClassroom = await database.query.classroom.findFirst({
      where: and(
        eq(classroom.id, id),
        eq(classroom.organization_id, context.organization.id),
      ),
    });

    if (!existingClassroom) {
      throw new ORPCError("NOT_FOUND", {
        cause: "Classroom not found",
      });
    }

    await database.delete(classroom).where(eq(classroom.id, id));

    return {
      success: true,
    };
  });

