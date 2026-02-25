import { getRequiredContext } from "@/lib/agents/utils";
import { database } from "@/lib/database";
import { class_schedule, course } from "@/lib/database/schema";
import { and, eq, inArray } from "drizzle-orm";
import { tool } from "ai";
import z from "zod";

export const getClassScheduleOverview = tool({
  description:
    "Get class schedule overview for teacher-owned courses, optionally filtered by a course.",
  inputSchema: z.object({
    courseId: z.string().uuid().optional(),
  }),
  execute: async ({ courseId }, options) => {
    const { organizationId, userId } = getRequiredContext(
      options.experimental_context,
    );

    const teacherCourses = await database.query.course.findMany({
      where: and(
        eq(course.organization_id, organizationId),
        eq(course.teacher_id, userId),
      ),
      columns: {
        id: true,
        name: true,
      },
    });

    const teacherCourseIds = teacherCourses.map((entry) => entry.id);

    if (teacherCourseIds.length === 0) {
      return {
        total: 0,
        items: [],
      };
    }

    if (courseId && !teacherCourseIds.includes(courseId)) {
      return {
        error: "Course is not assigned to you.",
      };
    }

    const scopedCourseIds = courseId ? [courseId] : teacherCourseIds;

    const schedules = await database.query.class_schedule.findMany({
      where: and(
        eq(class_schedule.organization_id, organizationId),
        inArray(class_schedule.course_id, scopedCourseIds),
      ),
      with: {
        classroom: true,
        course: true,
      },
    });

    const items = schedules
      .map((entry) => ({
        id: entry.id,
        courseId: entry.course_id,
        courseName: entry.course.name,
        dayOfWeek: entry.day_of_week,
        startTime: entry.start_time,
        endTime: entry.end_time,
        classroom: {
          id: entry.classroom_id,
          name: entry.classroom.name,
          isVirtual: entry.classroom.is_virtual,
          capacity: entry.classroom.capacity,
        },
      }))
      .sort((left, right) => {
        if (left.dayOfWeek === right.dayOfWeek) {
          return left.startTime.localeCompare(right.startTime);
        }

        return left.dayOfWeek.localeCompare(right.dayOfWeek);
      });

    return {
      total: items.length,
      items,
    };
  },
});

