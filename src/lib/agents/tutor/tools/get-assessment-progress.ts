import { getRequiredContext } from "@/lib/agents/utils";
import { database } from "@/lib/database";
import {
  course_final_grade,
  enrollment,
  student_assessment_grade,
} from "@/lib/database/schema";
import { and, eq, inArray } from "drizzle-orm";
import { tool } from "ai";
import z from "zod";

export const getAssessmentProgress = tool({
  description:
    "Get assessment and final-grade progress for the student, grouped by enrolled course.",
  inputSchema: z.object({
    courseId: z.uuid().optional(),
  }),
  execute: async ({ courseId }, options) => {
    const { organizationId, userId } = getRequiredContext(
      options.experimental_context,
    );

    const enrollmentWhere = [
      eq(enrollment.organization_id, organizationId),
      eq(enrollment.student_id, userId),
    ];

    if (courseId) {
      enrollmentWhere.push(eq(enrollment.course_id, courseId));
    }

    const enrollments = await database.query.enrollment.findMany({
      where: and(...enrollmentWhere),
      with: {
        course: true,
      },
    });

    const enrollmentIds = enrollments.map((item) => item.id);
    const courseIds = enrollments.map((item) => item.course_id);

    if (enrollmentIds.length === 0) {
      return {
        courses: [],
        totalAssessments: 0,
      };
    }

    const [assessmentGrades, finalGrades] = await Promise.all([
      database.query.student_assessment_grade.findMany({
        where: and(
          eq(student_assessment_grade.organization_id, organizationId),
          inArray(student_assessment_grade.enrollment_id, enrollmentIds),
        ),
        with: {
          assessment: true,
          enrollment: true,
        },
      }),
      database.query.course_final_grade.findMany({
        where: and(
          eq(course_final_grade.organization_id, organizationId),
          eq(course_final_grade.student_id, userId),
          inArray(course_final_grade.course_id, courseIds),
        ),
      }),
    ]);

    const courseById = new Map(
      enrollments.map((item) => [item.course.id, item.course.name]),
    );

    const finalGradeByCourseId = new Map(
      finalGrades.map((item) => [item.course_id, item]),
    );

    const gradesByCourse = assessmentGrades.reduce<
      Record<
        string,
        Array<{
          assessmentId: string;
          title: string;
          type: string;
          status: string;
          finalScore: string;
          maxScore: string;
          dueTime: Date | null;
          percentage: number;
        }>
      >
    >((accumulator, gradeRow) => {
      const currentCourseId = gradeRow.assessment.course_id;
      const finalScore = Number(gradeRow.final_score);
      const maxScore = Number(gradeRow.assessment.max_score);
      const percentage = maxScore > 0 ? (finalScore / maxScore) * 100 : 0;

      if (!accumulator[currentCourseId]) {
        accumulator[currentCourseId] = [];
      }

      accumulator[currentCourseId].push({
        assessmentId: gradeRow.assessment_id,
        title: gradeRow.assessment.title,
        type: gradeRow.assessment.type,
        status: gradeRow.status,
        finalScore: gradeRow.final_score,
        maxScore: gradeRow.assessment.max_score,
        dueTime: gradeRow.assessment.due_time,
        percentage,
      });

      return accumulator;
    }, {});

    const courses = courseIds.map((currentCourseId) => {
      const assessmentsForCourse = gradesByCourse[currentCourseId] ?? [];
      const averagePercentage =
        assessmentsForCourse.length > 0
          ? assessmentsForCourse.reduce(
              (accumulator, current) => accumulator + current.percentage,
              0,
            ) / assessmentsForCourse.length
          : 0;

      return {
        courseId: currentCourseId,
        courseName: courseById.get(currentCourseId) ?? "Unknown course",
        averageAssessmentPercentage: averagePercentage,
        assessments: assessmentsForCourse,
        finalGrade: finalGradeByCourseId.get(currentCourseId) ?? null,
      };
    });

    return {
      courses,
      totalAssessments: assessmentGrades.length,
    };
  },
});

