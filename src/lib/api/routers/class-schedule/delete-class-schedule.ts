import { database } from "@/lib/database";
import { protectedProcedure } from "../..";
import z from "zod";
import { eq } from "drizzle-orm";
import { class_schedule } from "@/lib/database/schema";
import { ORPCError } from "@orpc/server";
import { auth } from "@/lib/auth/auth-server";
import { headers } from "next/headers";

export const deleteClassSchedule = protectedProcedure
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

    const canDeleteClassSchedule = await auth.api.hasPermission({
      headers: await headers(),
      body: {
        permissions: {
          class_schedule: ["delete"],
        },
      },
    });

    if (!canDeleteClassSchedule.success) {
      throw new ORPCError("UNAUTHORIZED", {
        cause: "You do not have permission to delete a class schedule",
      });
    }

    const existingClassSchedule = await database.query.class_schedule.findFirst(
      {
        where: eq(class_schedule.id, id),
        with: {
          course: true,
        },
      },
    );

    if (!existingClassSchedule) {
      throw new ORPCError("NOT_FOUND", {
        cause: "Class schedule not found",
      });
    }

    if (
      existingClassSchedule.course.organization_id !== context.organization.id
    ) {
      throw new ORPCError("NOT_FOUND", {
        cause: "Class schedule not found",
      });
    }

    await database.delete(class_schedule).where(eq(class_schedule.id, id));

    return {
      success: true,
    };
  });

