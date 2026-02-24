import { database } from "@/lib/database";
import { protectedProcedure } from "../..";
import z from "zod";
import { eq } from "drizzle-orm";
import { class_attendance } from "@/lib/database/schema";
import { ORPCError } from "@orpc/server";
import { auth } from "@/lib/auth/auth-server";
import { headers } from "next/headers";

export const deleteClassAttendance = protectedProcedure
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

    const canDeleteClassAttendance = await auth.api.hasPermission({
      headers: await headers(),
      body: {
        permissions: {
          class_attendance: ["delete"],
        },
      },
    });

    if (!canDeleteClassAttendance.success) {
      throw new ORPCError("UNAUTHORIZED", {
        cause: "You do not have permission to delete class attendance",
      });
    }

    const existingClassAttendance =
      await database.query.class_attendance.findFirst({
        where: eq(class_attendance.id, id),
        with: {
          schedule: {
            with: {
              course: true,
            },
          },
        },
      });

    if (!existingClassAttendance) {
      throw new ORPCError("NOT_FOUND", {
        cause: "Class attendance not found",
      });
    }

    if (
      existingClassAttendance.schedule.course.organization_id !==
      context.organization.id
    ) {
      throw new ORPCError("NOT_FOUND", {
        cause: "Class attendance not found",
      });
    }

    await database.delete(class_attendance).where(eq(class_attendance.id, id));

    return {
      success: true,
    };
  });

