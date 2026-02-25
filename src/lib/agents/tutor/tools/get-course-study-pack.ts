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

export const getCourseStudyPack = tool({
  description:
    "Get the full study pack for one enrolled course: modules, lessons, quizzes, and assessments.",
  inputSchema: z.object({
    courseId: z.uuid(),
  }),
  execute: async ({ courseId }, options) => {
    const { organizationId, userId } = getRequiredContext(
      options.experimental_context,
    );

    const studentEnrollment = await database.query.enrollment.findFirst({
      where: and(
        eq(enrollment.organization_id, organizationId),
        eq(enrollment.student_id, userId),
        eq(enrollment.course_id, courseId),
      ),
    });

    if (!studentEnrollment) {
      return {
        error: "You are not enrolled in this course.",
      };
    }

    const [courseRecord, modules, quizzes, assessments] = await Promise.all([
      database.query.course.findFirst({
        where: and(
          eq(course.id, courseId),
          eq(course.organization_id, organizationId),
        ),
        with: {
          subject: true,
          teacher: true,
          academicTerm: true,
        },
      }),
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
    ]);

    const orderedModules = modules
      .sort((left, right) => left.order - right.order)
      .map((entry) => ({
        ...entry,
        lessons: entry.lessons.sort(
          (leftLesson, rightLesson) => leftLesson.order - rightLesson.order,
        ),
      }));

    return {
      course: courseRecord,
      modules: orderedModules,
      quizzes: quizzes
        .sort((left, right) => {
          const leftTime = left.due_time ? left.due_time.getTime() : Infinity;
          const rightTime = right.due_time
            ? right.due_time.getTime()
            : Infinity;
          return leftTime - rightTime;
        })
        .map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          dueTime: item.due_time,
          weight: item.weight,
        })),
      assessments: assessments
        .sort((left, right) => {
          const leftTime = left.due_time ? left.due_time.getTime() : Infinity;
          const rightTime = right.due_time
            ? right.due_time.getTime()
            : Infinity;
          return leftTime - rightTime;
        })
        .map((item) => ({
          id: item.id,
          title: item.title,
          type: item.type,
          dueTime: item.due_time,
          weight: item.weight,
          maxScore: item.max_score,
          isPublished: item.is_published,
        })),
      summary: {
        moduleCount: orderedModules.length,
        lessonCount: orderedModules.reduce(
          (accumulator, current) => accumulator + current.lessons.length,
          0,
        ),
        quizCount: quizzes.length,
        assessmentCount: assessments.length,
      },
    };
  },
});

