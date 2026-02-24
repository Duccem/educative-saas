import { auth } from "@/lib/auth/auth-server";
import { protectedProcedure } from "../..";
import { database } from "@/lib/database";
import z from "zod";
import { headers } from "next/headers";
import { class_attendance, class_schedule } from "@/lib/database/schema";
import { ORPCError } from "@orpc/server";
import { eq } from "drizzle-orm";

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

const classAttendanceInputSchema = z.object({
  class_schedule_id: z.uuid(),
  student_id: z.uuid(),
  attendance_date: z.string().regex(dateRegex),
  status: z.string().min(1),
});

export const addClassAttendance = protectedProcedure
  .route({ method: "POST", path: "/", inputStructure: "detailed" })
  .input(
    z.object({
      body: classAttendanceInputSchema,
    }),
  )
  .handler(async ({ input: { body }, context }) => {
    const canAddClassAttendance = await auth.api.hasPermission({
      headers: await headers(),
      body: {
        permissions: {
          class_attendance: ["create"],
        },
      },
    });

    if (!canAddClassAttendance.success) {
      throw new ORPCError("UNAUTHORIZED", {
        cause: "You do not have permission to add a class attendance",
      });
    }

    const existingClassSchedule = await database.query.class_schedule.findFirst(
      {
        where: eq(class_schedule.id, body.class_schedule_id),
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

    await database.insert(class_attendance).values({
      class_schedule_id: body.class_schedule_id,
      student_id: body.student_id,
      attendance_date: body.attendance_date,
      status: body.status,
      organization_id: context.organization.id,
      course_id: existingClassSchedule.course_id,
    });

    return {
      success: true,
    };
  });

