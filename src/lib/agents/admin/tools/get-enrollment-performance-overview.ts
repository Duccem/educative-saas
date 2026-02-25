import { getRequiredContext } from "@/lib/agents/utils";
import { database } from "@/lib/database";
import { course_final_grade, enrollment } from "@/lib/database/schema";
import { and, eq } from "drizzle-orm";
import { tool } from "ai";
import z from "zod";
import { assertAdminAccess } from "./assert-admin-access";

export const getEnrollmentPerformanceOverview = tool({
  description:
    "Get organization-wide enrollment status and final-grade performance overview.",
  inputSchema: z.object({
    courseId: z.string().uuid().optional(),
  }),
  execute: async ({ courseId }, options) => {
    const { organizationId, userId } = getRequiredContext(
      options.experimental_context,
    );

    await assertAdminAccess({ organizationId, userId });

    const enrollments = await database.query.enrollment.findMany({
      where: and(eq(enrollment.organization_id, organizationId)),
      with: {
        course: true,
        student: true,
      },
    });

    const filteredEnrollments = courseId
      ? enrollments.filter((entry) => entry.course_id === courseId)
      : enrollments;

    const enrollmentIds = filteredEnrollments.map((entry) => entry.id);

    const finalGrades =
      enrollmentIds.length > 0
        ? await database.query.course_final_grade.findMany({
            where: and(eq(course_final_grade.organization_id, organizationId)),
          })
        : [];

    const scopedFinalGrades = finalGrades.filter((entry) =>
      enrollmentIds.includes(entry.enrollment_id),
    );

    const avgFinalScore =
      scopedFinalGrades.length > 0
        ? scopedFinalGrades.reduce(
            (accumulator, current) => accumulator + Number(current.final_score),
            0,
          ) / scopedFinalGrades.length
        : null;

    return {
      totals: {
        enrollments: filteredEnrollments.length,
        active: filteredEnrollments.filter((entry) => entry.status === "active")
          .length,
        completed: filteredEnrollments.filter(
          (entry) => entry.status === "completed",
        ).length,
        dropped: filteredEnrollments.filter(
          (entry) => entry.status === "dropped",
        ).length,
      },
      finalGrades: {
        records: scopedFinalGrades.length,
        averageScore: avgFinalScore,
        passing: scopedFinalGrades.filter((entry) => entry.is_passing).length,
        inProgress: scopedFinalGrades.filter(
          (entry) => entry.status === "in_progress",
        ).length,
        finalized: scopedFinalGrades.filter(
          (entry) => entry.status === "finalized",
        ).length,
        published: scopedFinalGrades.filter(
          (entry) => entry.status === "published",
        ).length,
      },
      sample: filteredEnrollments.slice(0, 30).map((entry) => ({
        enrollmentId: entry.id,
        courseId: entry.course_id,
        courseName: entry.course.name,
        studentId: entry.student_id,
        studentName: entry.student.name,
        status: entry.status,
      })),
    };
  },
});

