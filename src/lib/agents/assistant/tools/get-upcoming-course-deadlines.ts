import { getRequiredContext } from "@/lib/agents/utils";
import { database } from "@/lib/database";
import { assessment, course, quiz } from "@/lib/database/schema";
import { and, eq, gte, inArray, lte } from "drizzle-orm";
import { tool } from "ai";
import z from "zod";

export const getUpcomingCourseDeadlines = tool({
  description:
    "Get upcoming quiz and assessment deadlines for teacher-owned courses in the next N days.",
  inputSchema: z.object({
    daysAhead: z.coerce.number().int().positive().max(120).default(14),
    courseId: z.string().uuid().optional(),
  }),
  execute: async ({ daysAhead, courseId }, options) => {
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
    const now = new Date();
    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() + daysAhead);

    const [quizzes, assessments] = await Promise.all([
      database.query.quiz.findMany({
        where: and(
          eq(quiz.organization_id, organizationId),
          inArray(quiz.course_id, scopedCourseIds),
          gte(quiz.due_time, now),
          lte(quiz.due_time, endDate),
        ),
      }),
      database.query.assessment.findMany({
        where: and(
          eq(assessment.organization_id, organizationId),
          inArray(assessment.course_id, scopedCourseIds),
          gte(assessment.due_time, now),
          lte(assessment.due_time, endDate),
        ),
      }),
    ]);

    const courseNameById = new Map(
      teacherCourses.map((entry) => [entry.id, entry.name]),
    );

    const items = [
      ...quizzes.map((entry) => ({
        type: "quiz",
        id: entry.id,
        title: entry.title,
        dueTime: entry.due_time,
        courseId: entry.course_id,
        courseName: courseNameById.get(entry.course_id) ?? "Unknown course",
      })),
      ...assessments.map((entry) => ({
        type: "assessment",
        id: entry.id,
        title: entry.title,
        dueTime: entry.due_time,
        courseId: entry.course_id,
        courseName: courseNameById.get(entry.course_id) ?? "Unknown course",
      })),
    ].sort((left, right) => {
      const leftTime = left.dueTime ? left.dueTime.getTime() : Infinity;
      const rightTime = right.dueTime ? right.dueTime.getTime() : Infinity;
      return leftTime - rightTime;
    });

    return {
      window: {
        from: now,
        to: endDate,
      },
      total: items.length,
      items,
    };
  },
});

