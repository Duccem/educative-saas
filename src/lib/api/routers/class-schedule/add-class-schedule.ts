import { auth } from "@/lib/auth/auth-server";
import { protectedProcedure } from "../..";
import { database } from "@/lib/database";
import z from "zod";
import { headers } from "next/headers";
import { class_schedule, classroom, course } from "@/lib/database/schema";
import { ORPCError } from "@orpc/server";
import { and, eq } from "drizzle-orm";

const hourRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

const classScheduleInputSchema = z.object({
  course_id: z.uuid(),
  classroom_id: z.uuid(),
  day_of_week: z.string(),
  start_time: z.string().regex(hourRegex),
  end_time: z.string().regex(hourRegex),
});

export const addClassSchedule = protectedProcedure
  .route({ method: "POST", path: "/", inputStructure: "detailed" })
  .input(
    z.object({
      body: classScheduleInputSchema,
    }),
  )
  .handler(async ({ input: { body }, context }) => {
    const canAddClassSchedule = await auth.api.hasPermission({
      headers: await headers(),
      body: {
        permissions: {
          class_schedule: ["create"],
        },
      },
    });

    if (!canAddClassSchedule.success) {
      throw new ORPCError("UNAUTHORIZED", {
        cause: "You do not have permission to add a class schedule",
      });
    }

    const existingCourse = await database.query.course.findFirst({
      where: and(
        eq(course.id, body.course_id),
        eq(course.organization_id, context.organization.id),
      ),
    });

    if (!existingCourse) {
      throw new ORPCError("NOT_FOUND", {
        cause: "Course not found",
      });
    }

    const existingClassroom = await database.query.classroom.findFirst({
      where: and(
        eq(classroom.id, body.classroom_id),
        eq(classroom.organization_id, context.organization.id),
      ),
    });

    if (!existingClassroom) {
      throw new ORPCError("NOT_FOUND", {
        cause: "Classroom not found",
      });
    }

    const existingCourseScheduleAtSameTime =
      await database.query.class_schedule.findFirst({
        where: and(
          eq(class_schedule.course_id, body.course_id),
          eq(class_schedule.day_of_week, body.day_of_week),
          eq(class_schedule.start_time, body.start_time),
          eq(class_schedule.end_time, body.end_time),
        ),
      });

    if (existingCourseScheduleAtSameTime) {
      throw new ORPCError("CONFLICT", {
        cause:
          "A class schedule already exists for this course at the same day and time",
      });
    }

    const schedulesAtSameTime = await database.query.class_schedule.findMany({
      where: and(
        eq(class_schedule.day_of_week, body.day_of_week),
        eq(class_schedule.start_time, body.start_time),
        eq(class_schedule.end_time, body.end_time),
      ),
      with: {
        course: true,
      },
    });

    const teacherHasConflict = schedulesAtSameTime.some(
      (schedule) =>
        schedule.course.teacher_id === existingCourse.teacher_id &&
        schedule.course.organization_id === context.organization.id,
    );

    if (teacherHasConflict) {
      throw new ORPCError("CONFLICT", {
        cause:
          "The teacher already has another class scheduled at the same day and time",
      });
    }

    await database.insert(class_schedule).values({
      course_id: body.course_id,
      classroom_id: body.classroom_id,
      day_of_week: body.day_of_week,
      start_time: body.start_time,
      end_time: body.end_time,
      organization_id: context.organization.id,
    });

    return {
      success: true,
    };
  });

