import { getRequiredContext } from "@/lib/agents/utils";
import { database } from "@/lib/database";
import {
  academic_term,
  course,
  grade,
  section,
  subject,
} from "@/lib/database/schema";
import { and, eq } from "drizzle-orm";
import { tool } from "ai";
import z from "zod";
import { assertAdminAccess } from "./assert-admin-access";

export const getOrganizationAcademicOverview = tool({
  description:
    "Get academic overview metrics for the organization: terms, subjects, grades, sections, and courses.",
  inputSchema: z.object({}),
  execute: async (_, options) => {
    const { organizationId, userId } = getRequiredContext(
      options.experimental_context,
    );

    await assertAdminAccess({ organizationId, userId });

    const [terms, subjects, grades, sections, courses] = await Promise.all([
      database.query.academic_term.findMany({
        where: and(eq(academic_term.organization_id, organizationId)),
      }),
      database.query.subject.findMany({
        where: and(eq(subject.organization_id, organizationId)),
      }),
      database.query.grade.findMany({
        where: and(eq(grade.organization_id, organizationId)),
      }),
      database.query.section.findMany({
        where: and(eq(section.organization_id, organizationId)),
      }),
      database.query.course.findMany({
        where: and(eq(course.organization_id, organizationId)),
        with: {
          teacher: true,
          academicTerm: true,
          subject: true,
        },
      }),
    ]);

    const coursesByTeacher = courses.reduce<Record<string, number>>(
      (accumulator, current) => {
        const key = current.teacher.name;
        accumulator[key] = (accumulator[key] ?? 0) + 1;
        return accumulator;
      },
      {},
    );

    return {
      totals: {
        terms: terms.length,
        activeTerms: terms.filter((term) => term.is_active).length,
        subjects: subjects.length,
        grades: grades.length,
        sections: sections.length,
        courses: courses.length,
      },
      topTeachersByCourseLoad: Object.entries(coursesByTeacher)
        .map(([teacherName, coursesCount]) => ({
          teacherName,
          coursesCount,
        }))
        .sort((left, right) => right.coursesCount - left.coursesCount)
        .slice(0, 10),
      coursesByTerm: terms.map((term) => ({
        termId: term.id,
        termName: term.name,
        courses: courses.filter(
          (courseItem) => courseItem.academic_term_id === term.id,
        ).length,
      })),
    };
  },
});

