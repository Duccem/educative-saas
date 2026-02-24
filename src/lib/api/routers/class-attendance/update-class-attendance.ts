import z from "zod";
import { protectedProcedure } from "../..";
import { database } from "@/lib/database";
import { ORPCError } from "@orpc/server";
import { class_attendance, class_schedule } from "@/lib/database/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth/auth-server";
import { headers } from "next/headers";

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

const updateClassAttendanceInputSchema = z.object({
  body: z.object({
    class_schedule_id: z.uuid().optional(),
    student_id: z.uuid().optional(),
    attendance_date: z.string().regex(dateRegex).optional(),
    status: z.string().min(1).optional(),
  }),
  params: z.object({
    id: z.uuid(),
  }),
});

export const updateClassAttendance = protectedProcedure
  .route({ method: "PUT", path: "/:id", inputStructure: "detailed" })
  .input(updateClassAttendanceInputSchema)
  .handler(async ({ input: { body, params }, context }) => {
    const { id } = params;
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

    const canUpdateClassAttendance = await auth.api.hasPermission({
      headers: await headers(),
      body: {
        permissions: {
          class_attendance: ["update"],
        },
      },
    });

    if (!canUpdateClassAttendance.success) {
      throw new ORPCError("UNAUTHORIZED", {
        cause: "You do not have permission to update class attendance",
      });
    }

    if (body.class_schedule_id) {
      const targetClassSchedule = await database.query.class_schedule.findFirst(
        {
          where: eq(class_schedule.id, body.class_schedule_id),
          with: {
            course: true,
          },
        },
      );

      if (!targetClassSchedule) {
        throw new ORPCError("NOT_FOUND", {
          cause: "Class schedule not found",
        });
      }

      if (
        targetClassSchedule.course.organization_id !== context.organization.id
      ) {
        throw new ORPCError("NOT_FOUND", {
          cause: "Class schedule not found",
        });
      }
    }

    await database
      .update(class_attendance)
      .set({
        class_schedule_id:
          body.class_schedule_id ?? existingClassAttendance.class_schedule_id,
        student_id: body.student_id ?? existingClassAttendance.student_id,
        attendance_date:
          body.attendance_date ?? existingClassAttendance.attendance_date,
        status: body.status ?? existingClassAttendance.status,
      })
      .where(eq(class_attendance.id, id));

    return {
      success: true,
    };
  });

