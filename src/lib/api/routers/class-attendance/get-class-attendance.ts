import z from "zod";
import { protectedProcedure } from "../..";
import { eq } from "drizzle-orm";
import { database } from "@/lib/database";
import { class_attendance } from "@/lib/database/schema";
import { ORPCError } from "@orpc/server";

export const getClassAttendance = protectedProcedure
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

    const existingClassAttendance =
      await database.query.class_attendance.findFirst({
        where: eq(class_attendance.id, id),
        with: {
          schedule: {
            with: {
              course: true,
              classroom: true,
            },
          },
          student: true,
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

    return {
      classAttendance: existingClassAttendance,
    };
  });

