import { getRequiredContext } from "@/lib/agents/utils";
import { database } from "@/lib/database";
import {
  course,
  enrollment,
  quiz,
  quiz_attempt,
  student_assessment_grade,
} from "@/lib/database/schema";
import { and, eq, inArray } from "drizzle-orm";
import { tool } from "ai";
import z from "zod";

export const getCourseStudentPerformance = tool({
  description:
    "Get per-student performance overview for a teacher-owned course using quiz attempts and assessment grades.",
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
      columns: {
        id: true,
        name: true,
      },
    });

    if (!teacherCourse) {
      return {
        error:
          "Course not found or you do not have teacher access to this course.",
      };
    }

    const [enrollments, quizzes] = await Promise.all([
      database.query.enrollment.findMany({
        where: and(
          eq(enrollment.organization_id, organizationId),
          eq(enrollment.course_id, courseId),
        ),
        with: {
          student: true,
        },
      }),
      database.query.quiz.findMany({
        where: and(
          eq(quiz.organization_id, organizationId),
          eq(quiz.course_id, courseId),
        ),
        columns: {
          id: true,
        },
      }),
    ]);

    if (enrollments.length === 0) {
      return {
        course: teacherCourse,
        totalStudents: 0,
        students: [],
      };
    }

    const enrollmentIds = enrollments.map((entry) => entry.id);
    const studentIds = enrollments.map((entry) => entry.student_id);
    const quizIds = quizzes.map((entry) => entry.id);

    const [assessmentGrades, quizAttempts] = await Promise.all([
      database.query.student_assessment_grade.findMany({
        where: and(
          eq(student_assessment_grade.organization_id, organizationId),
          inArray(student_assessment_grade.enrollment_id, enrollmentIds),
        ),
        with: {
          enrollment: true,
          assessment: true,
        },
      }),
      quizIds.length > 0
        ? database.query.quiz_attempt.findMany({
            where: and(
              eq(quiz_attempt.organization_id, organizationId),
              inArray(quiz_attempt.student_id, studentIds),
              inArray(quiz_attempt.quiz_id, quizIds),
            ),
            with: {
              quiz: true,
              student: true,
            },
          })
        : Promise.resolve([]),
    ]);

    const enrollmentIdByStudentId = new Map(
      enrollments.map((entry) => [entry.student_id, entry.id]),
    );

    const students = enrollments.map((entry) => {
      const studentQuizAttempts = quizAttempts.filter(
        (attempt) => attempt.student_id === entry.student_id,
      );

      const studentAssessmentGrades = assessmentGrades.filter(
        (gradeEntry) => gradeEntry.enrollment_id === entry.id,
      );

      const averageQuizScore =
        studentQuizAttempts.length > 0
          ? studentQuizAttempts.reduce(
              (accumulator, current) => accumulator + Number(current.score),
              0,
            ) / studentQuizAttempts.length
          : null;

      const averageAssessmentPercentage =
        studentAssessmentGrades.length > 0
          ? studentAssessmentGrades.reduce((accumulator, current) => {
              const maxScore = Number(current.assessment.max_score);
              const finalScore = Number(current.final_score);
              return (
                accumulator + (maxScore > 0 ? (finalScore / maxScore) * 100 : 0)
              );
            }, 0) / studentAssessmentGrades.length
          : null;

      return {
        studentId: entry.student_id,
        studentName: entry.student.name,
        enrollmentStatus: entry.status,
        enrollmentId: enrollmentIdByStudentId.get(entry.student_id) ?? null,
        attemptsCount: studentQuizAttempts.length,
        assessmentsCount: studentAssessmentGrades.length,
        averageQuizScore,
        averageAssessmentPercentage,
        atRisk:
          averageAssessmentPercentage !== null
            ? averageAssessmentPercentage < 60
            : averageQuizScore !== null
              ? averageQuizScore < 60
              : false,
      };
    });

    return {
      course: teacherCourse,
      totalStudents: students.length,
      students,
      aggregates: {
        atRiskStudents: students.filter((student) => student.atRisk).length,
        avgQuizScore:
          students.filter((student) => student.averageQuizScore !== null)
            .length > 0
            ? students
                .filter((student) => student.averageQuizScore !== null)
                .reduce(
                  (accumulator, current) =>
                    accumulator + Number(current.averageQuizScore),
                  0,
                ) /
              students.filter((student) => student.averageQuizScore !== null)
                .length
            : null,
      },
    };
  },
});

