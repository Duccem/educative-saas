import { getRequiredContext } from "@/lib/agents/utils";
import { database } from "@/lib/database";
import {
  assessment,
  course,
  enrollment,
  module,
  quiz,
} from "@/lib/database/schema";
import { and, eq } from "drizzle-orm";
import { tool } from "ai";
import z from "zod";

export const getCourseContentOverview = tool({
  description:
    "Get full teaching content overview for one teacher-owned course: modules, lessons, quizzes, assessments, and enrollment stats.",
  inputSchema: z.object({
    courseId: z.string().uuid(),
  }),
  execute: async ({ courseId }, options) => {
    const { organizationId, userId } = getRequiredContext(
      options.experimental_context,
    );

    const teacherCourse = await database.query.course.findFirst({
      where: and(
        eq(course.id, courseId),
        eq(course.organization_id, organizationId),
        eq(course.teacher_id, userId),
      ),
      with: {
        subject: true,
        grade: true,
        section: true,
        academicTerm: true,
      },
    });

    if (!teacherCourse) {
      return {
        error:
          "Course not found or you do not have teacher access to this course.",
      };
    }

    const [modules, quizzes, assessments, enrollments] = await Promise.all([
      database.query.module.findMany({
        where: eq(module.course_id, courseId),
        with: {
          lessons: true,
        },
      }),
      database.query.quiz.findMany({
        where: and(
          eq(quiz.organization_id, organizationId),
          eq(quiz.course_id, courseId),
        ),
      }),
      database.query.assessment.findMany({
        where: and(
          eq(assessment.organization_id, organizationId),
          eq(assessment.course_id, courseId),
        ),
      }),
      database.query.enrollment.findMany({
        where: and(
          eq(enrollment.organization_id, organizationId),
          eq(enrollment.course_id, courseId),
        ),
      }),
    ]);

    const orderedModules = modules
      .sort((left, right) => left.order - right.order)
      .map((moduleEntry) => ({
        ...moduleEntry,
        lessons: moduleEntry.lessons.sort(
          (left, right) => left.order - right.order,
        ),
      }));

    return {
      course: {
        id: teacherCourse.id,
        name: teacherCourse.name,
        subject: teacherCourse.subject.name,
        grade: teacherCourse.grade?.name ?? null,
        section: teacherCourse.section?.name ?? null,
        academicTerm: teacherCourse.academicTerm.name,
      },
      modules: orderedModules,
      quizzes: quizzes
        .sort((left, right) => {
          const leftTime = left.due_time ? left.due_time.getTime() : Infinity;
          const rightTime = right.due_time
            ? right.due_time.getTime()
            : Infinity;
          return leftTime - rightTime;
        })
        .map((entry) => ({
          id: entry.id,
          title: entry.title,
          dueTime: entry.due_time,
          weight: entry.weight,
        })),
      assessments: assessments
        .sort((left, right) => {
          const leftTime = left.due_time ? left.due_time.getTime() : Infinity;
          const rightTime = right.due_time
            ? right.due_time.getTime()
            : Infinity;
          return leftTime - rightTime;
        })
        .map((entry) => ({
          id: entry.id,
          title: entry.title,
          type: entry.type,
          dueTime: entry.due_time,
          maxScore: entry.max_score,
          weight: entry.weight,
          isPublished: entry.is_published,
        })),
      summary: {
        moduleCount: orderedModules.length,
        lessonCount: orderedModules.reduce(
          (accumulator, current) => accumulator + current.lessons.length,
          0,
        ),
        quizCount: quizzes.length,
        assessmentCount: assessments.length,
        students: {
          total: enrollments.length,
          active: enrollments.filter((item) => item.status === "active").length,
          completed: enrollments.filter((item) => item.status === "completed")
            .length,
          dropped: enrollments.filter((item) => item.status === "dropped")
            .length,
        },
      },
    };
  },
});

