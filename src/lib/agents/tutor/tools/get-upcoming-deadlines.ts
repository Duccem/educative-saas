import { getRequiredContext } from "@/lib/agents/utils";
import { database } from "@/lib/database";
import { assessment, course, enrollment, quiz } from "@/lib/database/schema";
import { and, eq, gte, inArray, lte } from "drizzle-orm";
import { tool } from "ai";
import z from "zod";

export const getUpcomingDeadlines = tool({
  description:
    "Get upcoming quiz and assessment deadlines for enrolled courses in the next N days.",
  inputSchema: z.object({
    daysAhead: z.coerce.number().int().positive().max(120).default(14),
    courseId: z.uuid().optional(),
  }),
  execute: async ({ daysAhead, courseId }, options) => {
    const { organizationId, userId } = getRequiredContext(
      options.experimental_context,
    );

    const studentEnrollments = await database.query.enrollment.findMany({
      where: and(
        eq(enrollment.organization_id, organizationId),
        eq(enrollment.student_id, userId),
        eq(enrollment.status, "active"),
      ),
      columns: {
        course_id: true,
      },
    });

    const enrolledCourseIds = studentEnrollments.map((item) => item.course_id);

    if (enrolledCourseIds.length === 0) {
      return {
        total: 0,
        items: [],
      };
    }

    if (courseId && !enrolledCourseIds.includes(courseId)) {
      return {
        error: "You are not actively enrolled in this course.",
      };
    }

    const scopedCourseIds = courseId ? [courseId] : enrolledCourseIds;

    const now = new Date();
    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() + daysAhead);

    const [courses, quizzes, assessments] = await Promise.all([
      database.query.course.findMany({
        where: inArray(course.id, scopedCourseIds),
        columns: {
          id: true,
          name: true,
        },
      }),
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

    const courseNameById = new Map(courses.map((item) => [item.id, item.name]));

    const items = [
      ...quizzes.map((item) => ({
        type: "quiz",
        id: item.id,
        title: item.title,
        courseId: item.course_id,
        courseName: courseNameById.get(item.course_id) ?? "Unknown course",
        dueTime: item.due_time,
      })),
      ...assessments.map((item) => ({
        type: "assessment",
        id: item.id,
        title: item.title,
        courseId: item.course_id,
        courseName: courseNameById.get(item.course_id) ?? "Unknown course",
        dueTime: item.due_time,
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

