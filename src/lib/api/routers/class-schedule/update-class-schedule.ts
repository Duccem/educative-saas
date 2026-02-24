import z from "zod";
import { protectedProcedure } from "../..";
import { database } from "@/lib/database";
import { ORPCError } from "@orpc/server";
import { class_schedule, classroom, course } from "@/lib/database/schema";
import { and, eq } from "drizzle-orm";
import { auth } from "@/lib/auth/auth-server";
import { headers } from "next/headers";

const hourRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

const updateClassScheduleInputSchema = z.object({
  body: z.object({
    course_id: z.uuid().optional(),
    classroom_id: z.uuid().optional(),
    day_of_week: z.string().optional(),
    start_time: z.string().regex(hourRegex).optional(),
    end_time: z.string().regex(hourRegex).optional(),
  }),
  params: z.object({
    id: z.uuid(),
  }),
});

export const updateClassSchedule = protectedProcedure
  .route({ method: "PUT", path: "/:id", inputStructure: "detailed" })
  .input(updateClassScheduleInputSchema)
  .handler(async ({ input: { body, params }, context }) => {
    const { id } = params;
    const existingClassSchedule = await database.query.class_schedule.findFirst(
      {
        where: eq(class_schedule.id, id),
        with: {
          course: true,
          classroom: true,
        },
      },
    );

    if (!existingClassSchedule) {
      throw new ORPCError("NOT_FOUND", {
        cause: "Class schedule not found",
      });
    }

    if (existingClassSchedule.organization_id !== context.organization.id) {
      throw new ORPCError("UNAUTHORIZED", {
        cause: "You do not have permission to update this class schedule",
      });
    }

    const canUpdateClassSchedule = await auth.api.hasPermission({
      headers: await headers(),
      body: {
        permissions: {
          class_schedule: ["update"],
        },
      },
    });

    if (!canUpdateClassSchedule.success) {
      throw new ORPCError("UNAUTHORIZED", {
        cause: "You do not have permission to update a class schedule",
      });
    }

    if (body.course_id) {
      const targetCourse = await database.query.course.findFirst({
        where: and(
          eq(course.id, body.course_id),
          eq(course.organization_id, context.organization.id),
        ),
      });

      if (!targetCourse) {
        throw new ORPCError("NOT_FOUND", {
          cause: "Course not found",
        });
      }
    }

    if (body.classroom_id) {
      const targetClassroom = await database.query.classroom.findFirst({
        where: and(
          eq(classroom.id, body.classroom_id),
          eq(classroom.organization_id, context.organization.id),
        ),
      });

      if (!targetClassroom) {
        throw new ORPCError("NOT_FOUND", {
          cause: "Classroom not found",
        });
      }
    }

    await database
      .update(class_schedule)
      .set({
        course_id: body.course_id ?? existingClassSchedule.course_id,
        classroom_id: body.classroom_id ?? existingClassSchedule.classroom_id,
        day_of_week: body.day_of_week ?? existingClassSchedule.day_of_week,
        start_time: body.start_time ?? existingClassSchedule.start_time,
        end_time: body.end_time ?? existingClassSchedule.end_time,
      })
      .where(eq(class_schedule.id, id));

    return {
      success: true,
    };
  });

