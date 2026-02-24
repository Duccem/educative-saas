import z from "zod";
import { protectedProcedure } from "../..";
import { database } from "@/lib/database";
import { ORPCError } from "@orpc/server";
import { classroom } from "@/lib/database/schema";
import { and, eq } from "drizzle-orm";
import { auth } from "@/lib/auth/auth-server";
import { headers } from "next/headers";

const updateClassroomInputSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    capacity: z.coerce.number().int().positive().optional(),
    is_virtual: z.boolean().optional(),
  }),
  params: z.object({
    id: z.uuid(),
  }),
});

export const updateClassroom = protectedProcedure
  .route({ method: "PUT", path: "/:id", inputStructure: "detailed" })
  .input(updateClassroomInputSchema)
  .handler(async ({ input: { body, params }, context }) => {
    const { id } = params;
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

    const canUpdateClassroom = await auth.api.hasPermission({
      headers: await headers(),
      body: {
        permissions: {
          classroom: ["update"],
        },
      },
    });

    if (!canUpdateClassroom.success) {
      throw new ORPCError("UNAUTHORIZED", {
        cause: "You do not have permission to update a classroom",
      });
    }

    await database
      .update(classroom)
      .set({
        name: body.name ?? existingClassroom.name,
        capacity: body.capacity ?? existingClassroom.capacity,
        is_virtual: body.is_virtual ?? existingClassroom.is_virtual,
      })
      .where(eq(classroom.id, id));

    return {
      success: true,
    };
  });

